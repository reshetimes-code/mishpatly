import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { keywordPages } from '@/app/seo-keywords';
import { searchLawyers } from '@/lib/lawyer-store';

// ─── Static Params ───────────────────────────────────────────────────

export function generateStaticParams() {
  return keywordPages.map((page) => ({
    keyword: page.slug,
  }));
}

// Render on request rather than at build time: the lawyer-listing section
// below needs a live DB query, and the Docker build environment can't
// reach the production DB during `next build`. generateStaticParams above
// still declares the valid slugs; this just defers rendering to runtime.
export const dynamic = 'force-dynamic';

// ─── Metadata ────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ keyword: string }>;
}): Promise<Metadata> {
  const { keyword } = await params;
  const page = keywordPages.find((p) => p.slug === keyword);

  if (!page) {
    return { title: 'הדף לא נמצא | משפטלי' };
  }

  return {
    title: page.metaTitle,
    description: page.metaDescription,
    keywords: [
      page.hebrewTitle,
      'משפטלי',
      'פסקי דין',
      'מאגר משפטי',
      'חיפוש פסקי דין',
    ],
    alternates: {
      canonical: `https://mishpatly.co.il/search/${page.slug}`,
    },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      type: 'website',
      locale: 'he_IL',
      siteName: 'משפטלי',
      url: `https://mishpatly.co.il/search/${page.slug}`,
    },
  };
}

// ─── Sample Judgments per Topic ───────────────────────────────────────

interface SampleJudgment {
  title: string;
  slug: string;
  court: string;
  date: string;
  summary: string;
  tags: string[];
}

const sampleJudgmentsByTopic: Record<string, SampleJudgment[]> = {
  'piskei-din': [
    {
      title: 'ת"א 1521-08-25 - ישראלי נגד חברה בע"מ',
      slug: '1521-08-25-israel-israeli',
      court: 'בית משפט השלום חיפה',
      date: '04/12/2025',
      summary: 'תביעה אזרחית בנושא הפרת חוזה מסחרי. התובע טען כי הנתבעת הפרה את התחייבויותיה החוזיות.',
      tags: ['חוזים', 'אזרחי', 'פיצויים'],
    },
    {
      title: 'ע"א 3345-03-25 - לוי נגד משרד הבריאות',
      slug: '3345-03-25-david-levi',
      court: 'בית המשפט המחוזי תל אביב',
      date: '18/11/2025',
      summary: 'ערעור על החלטת משרד הבריאות לשלול רישיון עסק. המערער טען כי ההחלטה התקבלה ללא שימוע.',
      tags: ['מנהלי', 'רישוי', 'ערעור'],
    },
    {
      title: 'ת"פ 7782-06-25 - מדינת ישראל נגד אברהם',
      slug: '7782-06-25-state-vs-avraham',
      court: 'בית משפט השלום ירושלים',
      date: '22/10/2025',
      summary: 'כתב אישום בעבירות מרמה והונאה. הנאשם הואשם בביצוע מעשי מרמה כלפי לקוחות.',
      tags: ['פלילי', 'מרמה', 'הונאה'],
    },
  ],
  'hasarat-azkurim': [
    {
      title: 'רע"א 8954-21 - פלוני נגד מאגר נבו',
      slug: 'raa-8954-21-ploni',
      court: 'בית המשפט העליון',
      date: '15/06/2025',
      summary: 'בקשה להסרת אזכור מפסק דין שפורסם במאגר משפטי. בית המשפט דן בזכות להישכח אל מול אינטרס הציבור.',
      tags: ['הסרה', 'פרטיות', 'זכות להישכח'],
    },
    {
      title: 'ת"א 4532-07-24 - אלמונית נגד Google Israel',
      slug: 'ta-4532-07-24-almoni',
      court: 'בית המשפט המחוזי תל אביב',
      date: '03/09/2025',
      summary: 'תביעה להסרת תוצאות חיפוש הכוללות מידע על הליך משפטי ישן. נדונה סוגיית הזכות להישכח.',
      tags: ['הסרה', 'גוגל', 'פרטיות'],
    },
  ],
  'piskei-din-bet-mishpat-hashalom': [
    {
      title: 'ת"א 1521-08-25 - ישראלי נגד חברה בע"מ',
      slug: '1521-08-25-israel-israeli',
      court: 'בית משפט השלום חיפה',
      date: '04/12/2025',
      summary: 'תביעה אזרחית בנושא הפרת חוזה מסחרי בבית משפט השלום.',
      tags: ['חוזים', 'אזרחי', 'השלום'],
    },
    {
      title: 'ת"פ 7782-06-25 - מדינת ישראל נגד אברהם',
      slug: '7782-06-25-state-vs-avraham',
      court: 'בית משפט השלום ירושלים',
      date: '22/10/2025',
      summary: 'תיק פלילי בבית משפט השלום בנושא עבירות מרמה.',
      tags: ['פלילי', 'מרמה', 'השלום'],
    },
  ],
  'piskei-din-bet-mishpat-hamehozi': [
    {
      title: 'ע"א 3345-03-25 - לוי נגד משרד הבריאות',
      slug: '3345-03-25-david-levi',
      court: 'בית המשפט המחוזי תל אביב',
      date: '18/11/2025',
      summary: 'ערעור מנהלי בבית המשפט המחוזי על החלטת רשות ממשלתית.',
      tags: ['מנהלי', 'מחוזי', 'ערעור'],
    },
    {
      title: 'עת"מ 5523-09-25 - עמותת הסביבה נגד הוועדה לתכנון',
      slug: '5523-09-25-environment-assoc',
      court: 'בית המשפט המחוזי חיפה',
      date: '30/08/2025',
      summary: 'עתירה מנהלית בבית המשפט המחוזי כנגד היתר בנייה למפעל בסמוך לשכונת מגורים.',
      tags: ['מנהלי', 'תכנון ובנייה', 'מחוזי'],
    },
  ],
  'piskei-din-dinei-avoda': [
    {
      title: 'עב"ל 8801-04-25 - חסן נגד ביטוח לאומי',
      slug: '8801-04-25-hassan-vs-bituach',
      court: 'בית הדין הארצי לעבודה',
      date: '20/06/2025',
      summary: 'ערעור על דחיית תביעה לדמי פגיעה בעבודה. נדונה שאלת ההכרה בפגיעה כתאונת עבודה.',
      tags: ['עבודה', 'ביטוח לאומי', 'פגיעה בעבודה'],
    },
    {
      title: 'סע"ש 12340-03-25 - כהן נגד חברת הייטק בע"מ',
      slug: 'saash-12340-03-25-cohen',
      court: 'בית הדין האזורי לעבודה תל אביב',
      date: '14/05/2025',
      summary: 'תביעה לפיצויי פיטורין ושכר עבודה. העובד טען לפיטורין שלא כדין ואי-תשלום זכויות סוציאליות.',
      tags: ['עבודה', 'פיטורין', 'שכר'],
    },
  ],
  'piskei-din-nezikin': [
    {
      title: 'ת"א 7890-01-25 - פלוני נגד עיריית חיפה',
      slug: 'ta-7890-01-25-ploni-haifa',
      court: 'בית משפט השלום חיפה',
      date: '11/04/2025',
      summary: 'תביעת נזיקין בגין נפילה במדרכה משובשת. התובע תבע פיצויים בגין נזקי גוף ועגמת נפש.',
      tags: ['נזיקין', 'רשלנות', 'נזקי גוף'],
    },
    {
      title: 'ת"א 5678-09-24 - ישראלי נגד חברת ביטוח',
      slug: 'ta-5678-09-24-yisraeli',
      court: 'בית משפט השלום תל אביב',
      date: '28/02/2025',
      summary: 'תביעת נזיקין בגין תאונת דרכים. נדונו שאלות של אשם תורם ושיעור הפיצוי.',
      tags: ['נזיקין', 'תאונת דרכים', 'פיצויים'],
    },
  ],
  'piskei-din-hozim': [
    {
      title: 'ת"א 1521-08-25 - ישראלי נגד חברה בע"מ',
      slug: '1521-08-25-israel-israeli',
      court: 'בית משפט השלום חיפה',
      date: '04/12/2025',
      summary: 'תביעה בגין הפרת חוזה מסחרי. נדונה סוגיית הפיצויים בגין הפרת התחייבות חוזית.',
      tags: ['חוזים', 'הפרת חוזה', 'פיצויים'],
    },
    {
      title: 'ה"פ 6690-05-25 - גולדברג נגד בנק הפועלים',
      slug: '6690-05-25-goldberg-vs-bank',
      court: 'בית המשפט המחוזי תל אביב',
      date: '12/07/2025',
      summary: 'בקשה לסעד הצהרתי בנוגע לתנאי הלוואת משכנתא. נדונה פרשנות חוזה בין לקוח לבנק.',
      tags: ['חוזים', 'בנקאות', 'משכנתא'],
    },
  ],
};

// Default sample judgments for pages without specific data
const defaultSampleJudgments: SampleJudgment[] = [
  {
    title: 'ת"א 1521-08-25 - ישראלי נגד חברה בע"מ',
    slug: '1521-08-25-israel-israeli',
    court: 'בית משפט השלום חיפה',
    date: '04/12/2025',
    summary: 'תביעה אזרחית בנושא הפרת חוזה מסחרי.',
    tags: ['חוזים', 'אזרחי'],
  },
  {
    title: 'ע"א 3345-03-25 - לוי נגד משרד הבריאות',
    slug: '3345-03-25-david-levi',
    court: 'בית המשפט המחוזי תל אביב',
    date: '18/11/2025',
    summary: 'ערעור מנהלי על החלטת רשות ממשלתית.',
    tags: ['מנהלי', 'ערעור'],
  },
];

// ─── Page Component ──────────────────────────────────────────────────

export default async function KeywordPage({
  params,
}: {
  params: Promise<{ keyword: string }>;
}) {
  const { keyword } = await params;
  const page = keywordPages.find((p) => p.slug === keyword);

  if (!page) {
    notFound();
  }

  const sampleJudgments =
    sampleJudgmentsByTopic[keyword] || defaultSampleJudgments;

  const relatedPages = page.relatedSlugs
    .map((slug) => keywordPages.find((p) => p.slug === slug))
    .filter(Boolean) as typeof keywordPages;

  // Lawyer portal landing pages promise a lawyer listing in their copy -
  // actually fetch and render matching lawyers instead of leaving it dead.
  const matchedLawyers = page.lawyerFilter
    ? (await searchLawyers({
        city: page.lawyerFilter.city || '',
        specialization: page.lawyerFilter.specialization || '',
        limit: 9,
        sortBy: 'rating',
      })).lawyers
    : [];

  // Build FAQ entries from page content
  const faqEntries = [
    {
      '@type': 'Question' as const,
      name: `מה זה ${page.hebrewTitle}?`,
      acceptedAnswer: {
        '@type': 'Answer' as const,
        text: page.paragraphs[0] || page.metaDescription,
      },
    },
    {
      '@type': 'Question' as const,
      name: `איך מחפשים ${page.hebrewTitle} במשפטלי?`,
      acceptedAnswer: {
        '@type': 'Answer' as const,
        text: `ניתן לחפש ${page.hebrewTitle} באתר משפטלי באמצעות הזנת מילות מפתח בשדה החיפוש. המערכת מציגה תוצאות רלוונטיות מכל בתי המשפט בישראל עם אפשרויות סינון מתקדמות.`,
      },
    },
    ...(page.paragraphs.length > 1
      ? [{
          '@type': 'Question' as const,
          name: `למה חשוב לחפש ${page.hebrewTitle}?`,
          acceptedAnswer: {
            '@type': 'Answer' as const,
            text: page.paragraphs[page.paragraphs.length - 1],
          },
        }]
      : []),
  ];

  // Schema.org structured data with @graph
  const schemaData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: page.h1,
        name: page.metaTitle,
        description: page.metaDescription,
        url: `https://mishpatly.co.il/search/${page.slug}`,
        inLanguage: 'he',
        datePublished: '2025-01-01',
        dateModified: new Date().toISOString().split('T')[0],
        author: {
          '@type': 'Organization',
          name: 'משפטלי',
          url: 'https://mishpatly.co.il',
        },
        publisher: {
          '@type': 'Organization',
          name: 'משפטלי',
          url: 'https://mishpatly.co.il',
          logo: {
            '@type': 'ImageObject',
            url: 'https://mishpatly.co.il/logo.png',
          },
        },
        mainEntityOfPage: `https://mishpatly.co.il/search/${page.slug}`,
        about: {
          '@type': 'Thing',
          name: page.hebrewTitle,
        },
        isPartOf: {
          '@type': 'WebSite',
          name: 'משפטלי',
          url: 'https://mishpatly.co.il',
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'דף הבית', item: 'https://mishpatly.co.il' },
          { '@type': 'ListItem', position: 2, name: 'חיפוש', item: 'https://mishpatly.co.il/search' },
          { '@type': 'ListItem', position: 3, name: page.hebrewTitle, item: `https://mishpatly.co.il/search/${page.slug}` },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqEntries,
      },
    ],
  };

  return (
    <>
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <div dir="rtl" className="min-h-screen bg-legal-bg text-legal-text">
        {/* ===== Hero Section ===== */}
        <section className="bg-primary text-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            {/* Breadcrumbs */}
            <nav className="mb-6 text-sm text-white/70">
              <Link href="/" className="hover:text-white transition-colors">
                דף הבית
              </Link>
              <span className="mx-2">/</span>
              <Link
                href="/search"
                className="hover:text-white transition-colors"
              >
                חיפוש
              </Link>
              <span className="mx-2">/</span>
              <span className="text-white">{page.hebrewTitle}</span>
            </nav>

            <h1 className="mb-4 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
              {page.h1}
            </h1>
            <p className="mb-8 max-w-2xl text-lg leading-relaxed text-white/80">
              {page.metaDescription}
            </p>

            {/* Search Form */}
            <form
              action="/search"
              method="GET"
              className="flex max-w-2xl flex-col gap-3 sm:flex-row"
            >
              <div className="relative flex-1">
                <input
                  type="text"
                  name="q"
                  defaultValue={page.searchQuery}
                  placeholder={`חיפוש ${page.hebrewTitle}...`}
                  className="w-full rounded-lg border-0 bg-white/10 py-3.5 pr-4 pl-12 text-sm text-white placeholder-white/50 backdrop-blur-sm focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/40"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103.5 10.5a7.5 7.5 0 0013.15 6.15z"
                    />
                  </svg>
                </span>
              </div>
              <button
                type="submit"
                className="rounded-lg bg-accent px-8 py-3.5 text-sm font-bold text-white transition-colors hover:bg-accent/90"
              >
                חיפוש
              </button>
            </form>
          </div>
        </section>

        {/* ===== Content Section ===== */}
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* SEO Content */}
              <article className="mb-10 rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="mb-6 text-2xl font-bold text-primary">
                  {page.hebrewTitle} - מידע מקיף
                </h2>
                {page.paragraphs.map((paragraph, index) => (
                  <p
                    key={index}
                    className="mb-4 text-sm leading-relaxed text-gray-700 last:mb-0 sm:text-base"
                  >
                    {paragraph}
                  </p>
                ))}
              </article>

              {/* Matching Lawyers - only on lawyer-portal landing pages */}
              {page.lawyerFilter && matchedLawyers.length > 0 && (
                <div className="mb-10">
                  <h2 className="mb-4 text-xl font-bold text-primary">
                    עורכי דין - {page.hebrewTitle}
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {matchedLawyers.map((l) => (
                      <Link
                        key={l.id}
                        href={`/lawyers/${l.slug}`}
                        className="flex gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                      >
                        {l.profileImage ? (
                          <img
                            src={l.profileImage}
                            alt={l.fullName}
                            loading="lazy"
                            className="h-16 w-16 shrink-0 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-[#D4B85E] text-xl font-bold text-[#072a42]">
                            {l.fullName.charAt(0)}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="truncate font-bold text-primary">עו&quot;ד {l.fullName}</p>
                          <p className="truncate text-sm text-gray-500">{l.city}</p>
                          <p className="mt-1 truncate text-xs text-gray-600">
                            {l.specializations.slice(0, 3).join(' · ')}
                          </p>
                          {l.rating > 0 && (
                            <p className="mt-1 text-xs font-semibold text-accent">
                              &#x2605; {l.rating.toFixed(1)} ({l.reviewCount})
                            </p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-4 text-center">
                    <Link
                      href={`/lawyers${page.lawyerFilter.city ? `?city=${encodeURIComponent(page.lawyerFilter.city)}` : ''}${page.lawyerFilter.specialization ? `${page.lawyerFilter.city ? '&' : '?'}specialization=${encodeURIComponent(page.lawyerFilter.specialization)}` : ''}`}
                      className="inline-block rounded-lg border border-primary px-6 py-2.5 text-sm font-bold text-primary transition-colors hover:bg-primary hover:text-white"
                    >
                      לכל עורכי הדין - {page.hebrewTitle}
                    </Link>
                  </div>
                </div>
              )}

              {/* Sample Judgments */}
              <div className="mb-6">
                <h2 className="mb-4 text-xl font-bold text-primary">
                  פסקי דין לדוגמה - {page.hebrewTitle}
                </h2>
              </div>

              <div className="space-y-4">
                {sampleJudgments.map((j, index) => (
                  <article
                    key={index}
                    className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="mb-2 flex flex-wrap items-start gap-2">
                      <Link
                        href={`/judgment/${j.slug}`}
                        className="text-base font-bold leading-relaxed text-primary hover:text-accent transition-colors sm:text-lg"
                      >
                        {j.title}
                      </Link>
                    </div>

                    <p className="mb-2 text-sm text-gray-500">
                      {j.court}
                      <span className="mx-2">|</span>
                      {j.date}
                    </p>

                    <p className="mb-3 text-sm leading-relaxed text-gray-700">
                      {j.summary}
                    </p>

                    <div className="mb-4 flex flex-wrap gap-1.5">
                      {j.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/judgment/${j.slug}`}
                        className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent/90"
                      >
                        לצפייה במסמך
                      </Link>
                      <Link
                        href={`/removal-request?doc=${j.slug}`}
                        className="rounded-md border border-legal-danger px-4 py-2 text-sm font-medium text-legal-danger transition-colors hover:bg-legal-danger hover:text-white"
                      >
                        בקשת הסרה
                      </Link>
                    </div>
                  </article>
                ))}
              </div>

              {/* CTA to full search */}
              <div className="mt-8 text-center">
                <Link
                  href={`/search${page.searchQuery ? `?q=${encodeURIComponent(page.searchQuery)}` : ''}`}
                  className="inline-block rounded-lg bg-primary px-8 py-3 text-sm font-bold text-white transition-colors hover:bg-primary/90"
                >
                  צפייה בכל התוצאות עבור &quot;{page.hebrewTitle}&quot;
                </Link>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              {/* Related Topics */}
              <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <h3 className="mb-4 text-lg font-bold text-primary">
                  נושאים קשורים
                </h3>
                <ul className="space-y-2">
                  {relatedPages.map((related) => (
                    <li key={related.slug}>
                      <Link
                        href={`/search/${related.slug}`}
                        className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-gray-700 transition-colors hover:bg-accent/5 hover:text-accent"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 shrink-0 text-accent"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                        {related.hebrewTitle}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* All Topics */}
              <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <h3 className="mb-4 text-lg font-bold text-primary">
                  כל הנושאים
                </h3>
                <ul className="space-y-1">
                  {keywordPages
                    .filter((p) => p.slug !== keyword)
                    .map((p) => (
                      <li key={p.slug}>
                        <Link
                          href={`/search/${p.slug}`}
                          className={`block rounded px-3 py-1.5 text-sm transition-colors hover:bg-accent/5 hover:text-accent ${
                            page.relatedSlugs.includes(p.slug)
                              ? 'font-medium text-accent'
                              : 'text-gray-600'
                          }`}
                        >
                          {p.hebrewTitle}
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>

              {/* Removal CTA */}
              <div className="rounded-xl border border-legal-danger/20 bg-red-50 p-5 shadow-sm">
                <h3 className="mb-2 text-lg font-bold text-legal-danger">
                  הסרת אזכור משפטי
                </h3>
                <p className="mb-4 text-sm leading-relaxed text-gray-700">
                  מצאתם את שמכם בפסק דין? ניתן להגיש בקשה להסרת האזכור המשפטי
                  ולהגן על פרטיותכם.
                </p>
                <Link
                  href="/removal-request"
                  className="block rounded-lg bg-legal-danger px-4 py-2.5 text-center text-sm font-bold text-white transition-colors hover:bg-legal-danger/90"
                >
                  הגשת בקשת הסרה
                </Link>
              </div>
            </aside>
          </div>
        </section>

        {/* ===== Internal Links Footer ===== */}
        <section className="border-t border-gray-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <h2 className="mb-6 text-xl font-bold text-primary">
              חיפושים נפוצים במשפטלי
            </h2>
            <div className="flex flex-wrap gap-2">
              {keywordPages.map((p) => (
                <Link
                  key={p.slug}
                  href={`/search/${p.slug}`}
                  className={`rounded-full px-4 py-2 text-sm transition-colors ${
                    p.slug === keyword
                      ? 'bg-primary text-white'
                      : 'border border-gray-200 bg-gray-50 text-gray-700 hover:border-accent hover:text-accent'
                  }`}
                >
                  {p.hebrewTitle}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
