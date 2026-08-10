import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getLawyerBySlug, getReviewsByLawyerId } from '@/lib/lawyer-store';
import ReviewSection from './ReviewSection';

const SITE_URL = 'https://mishpatly.co.il';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  if (slug === 'login' || slug === 'register') return {};
  const lawyer = await getLawyerBySlug(slug);
  if (!lawyer) return { title: 'עורך דין לא נמצא | משפטלי' };

  const specs = lawyer.specializations.join(', ');
  const title = `עו"ד ${lawyer.fullName} - ${specs || 'עורך דין'} | ${lawyer.city} | פורטל עורכי דין משפטלי`;
  const description = `עו"ד ${lawyer.fullName} - עורך דין ${specs ? `המתמחה ב${specs}` : ''} ב${lawyer.city}. ${lawyer.yearsExperience > 0 ? `${lawyer.yearsExperience} שנות ניסיון. ` : ''}${lawyer.rating > 0 ? `דירוג ${lawyer.rating}/5 (${lawyer.reviewCount} המלצות). ` : ''}פרופיל מלא, חוות דעת לקוחות, טלפון וWhatsApp ליצירת קשר ישירה. ${lawyer.courtDistrict ? `פעיל במחוז ${lawyer.courtDistrict}. ` : ''}משפטלי - פורטל עורכי הדין של ישראל.`;

  return {
    title,
    description,
    keywords: [
      lawyer.fullName,
      `עורך דין ${lawyer.city}`,
      ...lawyer.specializations.map(s => `עורך דין ${s}`),
      ...lawyer.specializations,
      `עו"ד ${lawyer.fullName}`,
      'עורך דין',
      'עורכי דין',
      'משפטלי',
      lawyer.city,
      lawyer.courtDistrict || '',
    ].filter(Boolean),
    alternates: {
      canonical: `${SITE_URL}/lawyers/${slug}`,
    },
    openGraph: {
      title: `עו"ד ${lawyer.fullName} - ${specs || 'עורך דין'} | ${lawyer.city}`,
      description,
      type: 'profile',
      locale: 'he_IL',
      siteName: 'משפטלי',
      url: `${SITE_URL}/lawyers/${slug}`,
      images: lawyer.profileImage
        ? [{ url: `${SITE_URL}/api/lawyers/${slug}/image`, alt: `עו"ד ${lawyer.fullName}` }]
        : [{ url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630, alt: 'משפטלי' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `עו"ד ${lawyer.fullName} | משפטלי`,
      description,
    },
    robots: { index: true, follow: true },
  };
}

/** Build a rich, unique SEO paragraph for the lawyer profile (200-400 words). */
function buildLawyerSeoContent(lawyer: NonNullable<Awaited<ReturnType<typeof getLawyerBySlug>>>) {
  const specs = lawyer.specializations;
  const name = lawyer.fullName;
  const city = lawyer.city;
  const years = lawyer.yearsExperience;
  const district = lawyer.courtDistrict;
  const rating = lawyer.rating;
  const reviewCount = lawyer.reviewCount;
  const education = lawyer.education;

  const specText = specs.length > 0 ? specs.join(', ') : 'משפט כללי';
  const specListText = specs.length > 1
    ? `${specs.slice(0, -1).join(', ')} ו${specs[specs.length - 1]}`
    : specText;

  const paragraphs: string[] = [];

  // Intro paragraph
  paragraphs.push(
    `עו"ד ${name} הוא עורך דין ב${city} המתמחה בתחומי ${specListText}. ` +
    (years > 0
      ? `עם ניסיון מקצועי של ${years} שנים בעולם המשפט, עו"ד ${name} מעניק ייצוג משפטי מקצועי ומסור ללקוחותיו. `
      : `עו"ד ${name} מעניק ייצוג משפטי מקצועי ומסור ללקוחותיו. `) +
    (district ? `המשרד פעיל במחוז ${district} ומייצג לקוחות בבתי המשפט באזור. ` : '') +
    (education ? `${name} הוא בוגר ${education}. ` : '')
  );

  // Specializations detail paragraph
  if (specs.length > 0) {
    const specDetails: Record<string, string> = {
      'דיני משפחה': 'ליווי בהליכי גירושין, חלוקת רכוש, משמורת ילדים, מזונות והסכמי ממון',
      'דיני עבודה': 'ייצוג עובדים ומעסיקים בסכסוכי עבודה, פיטורין שלא כדין, הפליה ותנאי העסקה',
      'נדל"ן': 'ליווי עסקאות מקרקעין, רכישת דירות, הסכמי שכירות וסכסוכי שכנים',
      'פלילי': 'ייצוג חשודים ונאשמים בהליכים פליליים, חקירות משטרה, הסדרי טיעון וערעורים',
      'נזיקין': 'תביעות נזקי גוף, תאונות דרכים, תאונות עבודה ורשלנות רפואית',
      'מסחרי': 'ליווי עסקים, הסכמים מסחריים, דיני חברות והקמת תאגידים',
      'ביטוח לאומי': 'תביעות נכות, גמלאות, דמי אבטלה ומול המוסד לביטוח לאומי',
      'צוואות וירושות': 'עריכת צוואות, צווי ירושה, התנגדויות לצוואות וניהול עיזבונות',
      'הוצאה לפועל': 'ייצוג בהליכי הוצאה לפועל, עיקולים, פשיטות רגל והסדרי חובות',
      'מקרקעין': 'רישום בטאבו, תכנון ובנייה, היתרים ועסקאות נדל"ן',
      'אזרחי': 'תביעות אזרחיות, סכסוכים כספיים, הפרת חוזים וייצוג בבתי משפט שלום ומחוזי',
      'תעבורה': 'ייצוג בעבירות תנועה, שלילת רישיון, תאונות דרכים ודו"חות תנועה',
      'מיסוי': 'תכנון מס, ייצוג מול רשות המיסים, מס הכנסה, מע"מ ומיסוי מקרקעין',
      'הגירה': 'ויזות עבודה, אשרות שהייה, הסדרת מעמד ואזרחות',
      'קניין רוחני': 'רישום פטנטים, סימני מסחר, זכויות יוצרים והגנה על קניין רוחני',
      'צרכנות': 'תביעות צרכניות, הטעיית צרכנים, ביטול עסקאות וייצוגיות',
    };

    const matched = specs
      .map(s => {
        const key = Object.keys(specDetails).find(k => s.includes(k) || k.includes(s));
        return key ? specDetails[key] : null;
      })
      .filter(Boolean);

    if (matched.length > 0) {
      paragraphs.push(
        `תחומי הפעילות של המשרד כוללים: ${matched.join('; ')}. ` +
        `עו"ד ${name} מלווה את לקוחותיו לאורך כל ההליך המשפטי, החל מייעוץ ראשוני וניתוח המקרה ועד לייצוג בבית המשפט והשגת התוצאה הטובה ביותר.`
      );
    }
  }

  // Rating / trust paragraph
  if (rating > 0 && reviewCount > 0) {
    paragraphs.push(
      `עו"ד ${name} זכה לדירוג של ${rating} מתוך 5 כוכבים על סמך ${reviewCount} חוות דעת של לקוחות ממליצים במשפטלי. ` +
      `שביעות הרצון הגבוהה של הלקוחות משקפת את המקצועיות, האמינות והיחס האישי שמעניק המשרד.`
    );
  }

  // CTA paragraph
  paragraphs.push(
    `לייעוץ משפטי ראשוני או לקביעת פגישה עם עו"ד ${name} ב${city}, ניתן ליצור קשר ישירות דרך פרטי ההתקשרות המופיעים בעמוד זה. ` +
    `משפטלי - פורטל עורכי הדין המוביל בישראל, מאפשר לכם למצוא את עורך הדין המתאים לכם לפי תחום התמחות, אזור ודירוג לקוחות.`
  );

  // FAQ items
  const faqs = [
    {
      q: `באילו תחומים מתמחה עו"ד ${name}?`,
      a: `עו"ד ${name} מתמחה בתחומי ${specListText}${district ? ` ופעיל במחוז ${district}` : ''}.`,
    },
    {
      q: `איפה נמצא המשרד של עו"ד ${name}?`,
      a: `המשרד של עו"ד ${name} נמצא ב${city}${lawyer.address ? `, ${lawyer.address}` : ''}.`,
    },
    {
      q: `מה הדירוג של עו"ד ${name}?`,
      a: rating > 0
        ? `עו"ד ${name} מדורג ${rating}/5 על סמך ${reviewCount} חוות דעת במשפטלי.`
        : `עו"ד ${name} רשום בפורטל משפטלי. ניתן להשאיר חוות דעת לאחר קבלת שירות.`,
    },
    {
      q: `איך יוצרים קשר עם עו"ד ${name}?`,
      a: `ניתן ליצור קשר עם עו"ד ${name} בטלפון${lawyer.phone ? ` ${lawyer.phone}` : ''}, בוואטסאפ או באימייל דרך עמוד הפרופיל במשפטלי.`,
    },
  ];

  if (years > 0) {
    faqs.push({
      q: `כמה שנות ניסיון יש לעו"ד ${name}?`,
      a: `לעו"ד ${name} ${years} שנות ניסיון בתחומי ${specListText}.`,
    });
  }

  return { paragraphs, faqs };
}

function StarRating({ rating, size = 'text-lg' }: { rating: number; size?: string }) {
  return (
    <span className={size}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= Math.round(rating) ? 'text-accent' : 'text-gray-300'}>&#9733;</span>
      ))}
    </span>
  );
}

export default async function LawyerProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);

  // Static routes like /lawyers/login and /lawyers/register are handled by their own pages
  if (slug === 'login' || slug === 'register') {
    notFound();
  }

  const lawyer = await getLawyerBySlug(slug);

  if (!lawyer) {
    notFound();
  }

  const reviews = await getReviewsByLawyerId(lawyer.id);
  const seoContent = buildLawyerSeoContent(lawyer);

  // JSON-LD structured data for lawyer profile
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LegalService",
        "@id": `${SITE_URL}/lawyers/${slug}#business`,
        "name": `עו"ד ${lawyer.fullName}`,
        "description": lawyer.bio || `עורך דין ${lawyer.specializations.join(', ')} ב${lawyer.city}`,
        "url": `${SITE_URL}/lawyers/${slug}`,
        "telephone": lawyer.phone || undefined,
        "email": lawyer.email || undefined,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": lawyer.city,
          "streetAddress": lawyer.address || undefined,
          "addressCountry": "IL",
        },
        "areaServed": { "@type": "Country", "name": "Israel" },
        "priceRange": "$$",
        ...(lawyer.rating > 0 && {
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": lawyer.rating,
            "reviewCount": lawyer.reviewCount,
            "bestRating": 5,
            "worstRating": 1,
          },
        }),
        "image": lawyer.profileImage || `${SITE_URL}/logo.png`,
        "isPartOf": { "@type": "WebSite", "name": "משפטלי", "url": SITE_URL },
      },
      {
        "@type": "Person",
        "name": lawyer.fullName,
        "jobTitle": "עורך דין",
        "knowsAbout": lawyer.specializations,
        "worksFor": { "@id": `${SITE_URL}/lawyers/${slug}#business` },
        ...(lawyer.profileImage && { "image": lawyer.profileImage }),
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "דף הבית", "item": SITE_URL },
          { "@type": "ListItem", "position": 2, "name": "פורטל עורכי דין", "item": `${SITE_URL}/lawyers` },
          { "@type": "ListItem", "position": 3, "name": lawyer.fullName, "item": `${SITE_URL}/lawyers/${slug}` },
        ],
      },
      // FAQ schema for rich snippets
      {
        "@type": "FAQPage",
        "mainEntity": seoContent.faqs.map((faq) => ({
          "@type": "Question",
          "name": faq.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.a,
          },
        })),
      },
      // Individual review schema for approved reviews
      ...(reviews.length > 0
        ? reviews.slice(0, 5).map((r) => ({
            "@type": "Review",
            "author": { "@type": "Person", "name": r.reviewerName },
            "reviewRating": { "@type": "Rating", "ratingValue": r.rating, "bestRating": 5 },
            "reviewBody": r.text,
            "datePublished": r.createdAt.toISOString().split('T')[0],
            "itemReviewed": { "@id": `${SITE_URL}/lawyers/${slug}#business` },
          }))
        : []),
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    <div dir="rtl" className="min-h-screen bg-legal-bg text-legal-text">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-3 sm:px-6">
          <nav className="text-sm text-gray-500">
            <Link href="/" className="hover:text-accent transition-colors">דף הבית</Link>
            <span className="mx-2">&gt;</span>
            <Link href="/lawyers" className="hover:text-accent transition-colors">פורטל עורכי דין</Link>
            <span className="mx-2">&gt;</span>
            <span className="text-legal-text font-medium">{lawyer.fullName}</span>
          </nav>
        </div>
      </div>

      {/* Cover / Hero Image */}
      <div className="relative w-full h-48 sm:h-64 overflow-hidden">
        {lawyer.coverImage ? (
          <img src={lawyer.coverImage} alt={lawyer.fullName} className="w-full h-full object-cover" />
        ) : lawyer.profileImage ? (
          <div className="w-full h-full bg-gradient-to-bl from-[#0B3C5D] via-[#072a42] to-[#0B3C5D] flex items-center justify-center">
            <img src={lawyer.profileImage} alt={lawyer.fullName} className="h-full max-w-md object-contain opacity-30 blur-sm" />
          </div>
        ) : (
          <div className="w-full h-full bg-gradient-to-bl from-[#0B3C5D] via-[#072a42] to-[#0B3C5D]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 -mt-16 relative z-10">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* ===== Main Profile Card ===== */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-start gap-4 mb-4">
                {lawyer.profileImage ? (
                  <img
                    src={lawyer.profileImage}
                    alt={lawyer.fullName}
                    className="w-24 h-24 rounded-full object-cover shrink-0 border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white text-3xl font-bold shrink-0 border-4 border-white shadow-lg">
                    {lawyer.fullName.charAt(0)}
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-2xl font-extrabold text-primary">{lawyer.fullName}</h1>
                    {lawyer.isVerified && (
                      <span className="rounded-full bg-legal-green/10 px-2.5 py-0.5 text-xs font-semibold text-legal-green">&#10003; מאומת</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <StarRating rating={lawyer.rating} />
                    <span className="text-sm text-gray-500">({lawyer.reviewCount} המלצות)</span>
                  </div>
                </div>
              </div>

              {/* Specializations */}
              <div className="flex flex-wrap gap-2 mb-4">
                {lawyer.specializations.map((s: string) => (
                  <span key={s} className="rounded-full bg-accent/10 px-3 py-1 text-sm font-medium text-accent">{s}</span>
                ))}
              </div>

              {/* Bio */}
              {lawyer.bio && (
                <div className="mb-4">
                  <h2 className="text-sm font-bold text-primary mb-2">אודות</h2>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{lawyer.bio}</p>
                </div>
              )}

              {/* Details */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                {lawyer.yearsExperience > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">&#128188;</span>
                    <span>{lawyer.yearsExperience} שנות ניסיון</span>
                  </div>
                )}
                {lawyer.education && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">&#127891;</span>
                    <span>{lawyer.education}</span>
                  </div>
                )}
                {lawyer.courtDistrict && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">&#9878;</span>
                    <span>מחוז {lawyer.courtDistrict}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">&#128205;</span>
                  <span>{lawyer.city}{lawyer.address ? `, ${lawyer.address}` : ''}</span>
                </div>
              </div>
            </div>

            {/* Gallery */}
            {lawyer.galleryImages && lawyer.galleryImages.length > 0 && (
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-primary mb-4">גלריה</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {lawyer.galleryImages.map((img: string, i: number) => (
                    <img key={i} src={img} alt={`${lawyer.fullName} - תמונה ${i + 1}`} className="rounded-lg object-cover w-full h-32" />
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            <ReviewSection
              lawyerId={lawyer.id}
              initialReviews={reviews.map((r) => ({
                id: r.id,
                reviewerName: r.reviewerName,
                rating: r.rating,
                text: r.text,
                createdAt: r.createdAt.toISOString(),
              }))}
            />
          </div>

          {/* ===== Contact Sidebar ===== */}
          <div className="space-y-4">
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sticky top-24">
              <h3 className="text-sm font-bold text-primary mb-4">יצירת קשר</h3>

              <div className="space-y-3">
                {lawyer.phone && (
                  <a
                    href={`tel:${lawyer.phone}`}
                    className="flex items-center gap-3 rounded-lg bg-primary p-3 text-white text-sm font-medium transition-colors hover:bg-primary-light"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {lawyer.phone}
                  </a>
                )}

                {lawyer.whatsapp && (
                  <a
                    href={`https://wa.me/972${lawyer.whatsapp.replace(/^0/, '').replace(/[-\s]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-lg bg-[#25D366] p-3 text-white text-sm font-medium transition-colors hover:bg-[#20bd5a]"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.146.562 4.158 1.547 5.898L.06 23.399a.5.5 0 00.611.617l5.584-1.44A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.932 0-3.778-.53-5.382-1.527l-.385-.234-3.335.86.894-3.264-.256-.404A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                    </svg>
                    WhatsApp
                  </a>
                )}

                {lawyer.email && (
                  <a
                    href={`mailto:${lawyer.email}`}
                    className="flex items-center gap-3 rounded-lg border border-gray-300 p-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {lawyer.email}
                  </a>
                )}

                {lawyer.website && (
                  <a
                    href={lawyer.website.startsWith('http') ? lawyer.website : `https://${lawyer.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-lg border border-gray-300 p-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    אתר אינטרנט
                  </a>
                )}
              </div>

              {/* Share on WhatsApp */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`עו"ד ${lawyer.fullName} - ${lawyer.specializations.join(', ')}\n${lawyer.city}\n\n${SITE_URL}/lawyers/${slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-lg bg-[#25D366]/10 p-3 text-sm font-medium text-[#25D366] transition-colors hover:bg-[#25D366]/20 w-full"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.146.562 4.158 1.547 5.898L.06 23.399a.5.5 0 00.611.617l5.584-1.44A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.932 0-3.778-.53-5.382-1.527l-.385-.234-3.335.86.894-3.264-.256-.404A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                  </svg>
                  שתפו את הכרטיס
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== SEO Content Section ===== */}
      <div className="max-w-5xl mx-auto px-4 pb-8 sm:px-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-primary mb-4">
            עו&quot;ד {lawyer.fullName} - {lawyer.specializations.join(', ') || 'עורך דין'} ב{lawyer.city}
          </h2>
          {seoContent.paragraphs.map((p, i) => (
            <p key={i} className="text-sm text-gray-700 leading-relaxed mb-3">{p}</p>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm mt-6">
          <h2 className="text-xl font-bold text-primary mb-4">שאלות נפוצות על עו&quot;ד {lawyer.fullName}</h2>
          <div className="space-y-4">
            {seoContent.faqs.map((faq, i) => (
              <details key={i} className="group border-b border-gray-100 pb-3 last:border-0">
                <summary className="cursor-pointer text-sm font-semibold text-primary hover:text-accent transition-colors list-none flex items-center justify-between">
                  <span>{faq.q}</span>
                  <span className="text-gray-400 group-open:rotate-180 transition-transform mr-2">&#9660;</span>
                </summary>
                <p className="text-sm text-gray-700 leading-relaxed mt-2 pr-1">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
