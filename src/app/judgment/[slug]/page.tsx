import type { Metadata } from "next";
import Link from "next/link";
import { getJudgmentBySlugFromDB, searchJudgmentsFromDB } from "@/lib/judgment-store";

const SITE_URL = "https://mishpatly.co.il";

// ---------------------------------------------------------------------------
// Get judgment from DB
// ---------------------------------------------------------------------------
async function getJudgment(slug: string) {
  const decoded = decodeURIComponent(slug);
  const stored = await getJudgmentBySlugFromDB(decoded) || await getJudgmentBySlugFromDB(slug);
  if (stored) {
    return {
      slug: stored.slug,
      caseNumber: stored.caseNumber,
      court: stored.courtName,
      proceedingType: stored.procedureType || 'אזרחי',
      date: stored.judgmentDate,
      judge: stored.judge || '',
      plaintiff: stored.plaintiff || '',
      defendant: stored.defendant || '',
      status: 'סופי',
      summary: stored.summary || '',
      fullText: stored.fullText ? stored.fullText.split('\n\n').filter(Boolean) : [],
      sourceUrl: stored.sourceUrl || '',
      sourceName: stored.sourceName || '',
      category: stored.category || '',
      found: true,
    };
  }

  return {
    slug,
    caseNumber: decoded,
    court: "",
    proceedingType: "",
    date: "",
    judge: "",
    plaintiff: "",
    defendant: "",
    status: "לא נמצא",
    summary: "פסק הדין לא נמצא במאגר. ייתכן שהוסר או שהכתובת שגויה.",
    fullText: [] as string[],
    sourceUrl: '',
    sourceName: '',
    category: '',
    found: false,
  };
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split("-");
  if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
  return dateStr;
}

// ---------------------------------------------------------------------------
// SEO Metadata
// ---------------------------------------------------------------------------
interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const j = await getJudgment(slug);

  const personName = j.defendant || j.plaintiff || '';
  const title = personName
    ? `${personName} - פסק דין ${j.caseNumber} | ${j.court} | משפטלי`
    : `פסק דין ${j.caseNumber} | ${j.court} | משפטלי`;

  const description = personName
    ? `כל פסקי הדין עבור ${personName}. פסק דין ${j.caseNumber} ב${j.court}. ${j.plaintiff} נגד ${j.defendant}. ${(j.summary || '').slice(0, 120)}`
    : `פסק דין ${j.caseNumber} - ${j.summary?.slice(0, 150)}`;

  const keywords = [
    personName,
    j.plaintiff,
    `פסק דין ${personName}`,
    `פסקי דין ${personName}`,
    `${personName} פסק דין`,
    `${personName} בית משפט`,
    j.caseNumber,
    j.court,
    j.judge,
    'פסק דין',
    'פסקי דין',
    'משפטלי',
    j.proceedingType,
    j.category,
    'חיפוש פסקי דין',
    'מאגר פסקי דין',
    `הסרת אזכור ${personName}`,
  ].filter(Boolean);

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `${SITE_URL}/judgment/${slug}`,
    },
    openGraph: {
      title: personName ? `${personName} - פסק דין ${j.caseNumber}` : `פסק דין ${j.caseNumber}`,
      description,
      type: "article",
      locale: "he_IL",
      siteName: "משפטלי",
      url: `${SITE_URL}/judgment/${slug}`,
      images: [{ url: `${SITE_URL}/logo.png`, width: 200, height: 200, alt: `פסק דין ${personName}` }],
    },
    twitter: {
      card: "summary",
      title: `${personName} - פסק דין | משפטלי`,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
      },
    },
  };
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default async function JudgmentPage({ params }: PageProps) {
  const { slug } = await params;
  const judgment = await getJudgment(slug);

  // Get related judgments from same court
  const related = await searchJudgmentsFromDB({ court: judgment.court, limit: 4, status: 'PUBLISHED' });
  const relatedItems = related.judgments
    .filter(r => r.slug !== slug)
    .slice(0, 3)
    .map(r => ({ slug: r.slug, title: `${r.caseNumber} ${r.plaintiff || ''} נ' ${r.defendant || ''}` }));

  const personName = judgment.defendant || judgment.plaintiff || '';
  const caseTitle = `${judgment.plaintiff || 'התובע'} נ׳ ${judgment.defendant || 'הנתבע'}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LegalDocument",
        "@id": `${SITE_URL}/judgment/${slug}#document`,
        "name": `פסק דין ${judgment.caseNumber} - ${personName}`,
        "headline": `כל פסקי הדין עבור ${personName}`,
        "description": `פסק דין נגד ${personName} - ${judgment.caseNumber}. ${judgment.summary}`,
        "text": judgment.summary,
        "datePublished": judgment.date,
        "dateModified": judgment.date,
        "inLanguage": "he",
        "author": judgment.judge ? { "@type": "Person", "name": judgment.judge } : undefined,
        "about": [
          { "@type": "Thing", "name": judgment.proceedingType },
          { "@type": "Thing", "name": judgment.category },
        ].filter(a => a.name),
        "isPartOf": {
          "@type": "WebSite",
          "name": "משפטלי",
          "url": SITE_URL,
        },
        "publisher": {
          "@type": "Organization",
          "name": "משפטלי",
          "url": SITE_URL,
          "logo": { "@type": "ImageObject", "url": `${SITE_URL}/logo.png` },
        },
        "mentions": [
          judgment.defendant ? { "@type": "Person", "name": judgment.defendant } : null,
          judgment.plaintiff ? { "@type": "Person", "name": judgment.plaintiff } : null,
        ].filter(Boolean),
      },
      {
        "@type": "Article",
        "headline": `${personName} - פסק דין ${judgment.caseNumber}`,
        "description": `פסק דין בעניין ${personName}. ${judgment.summary}`,
        "datePublished": judgment.date,
        "author": { "@type": "Organization", "name": "משפטלי" },
        "publisher": {
          "@type": "Organization",
          "name": "משפטלי",
          "logo": { "@type": "ImageObject", "url": `${SITE_URL}/logo.png` },
        },
        "mainEntityOfPage": `${SITE_URL}/judgment/${slug}`,
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "דף הבית", "item": SITE_URL },
          { "@type": "ListItem", "position": 2, "name": "פסקי דין", "item": `${SITE_URL}/search` },
          { "@type": "ListItem", "position": 3, "name": judgment.court, "item": `${SITE_URL}/search?court=${encodeURIComponent(judgment.court)}` },
          { "@type": "ListItem", "position": 4, "name": `${personName} - ${judgment.caseNumber}`, "item": `${SITE_URL}/judgment/${slug}` },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div dir="rtl" className="min-h-screen bg-[#FAFBFC] text-[#1a1a2e]">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <ol className="flex flex-wrap items-center gap-1 text-sm text-gray-500">
              <li><Link href="/" className="hover:text-[#C9A84C] transition-colors">דף הבית</Link></li>
              <li aria-hidden="true" className="mx-1">&gt;</li>
              <li><Link href="/search" className="hover:text-[#C9A84C] transition-colors">פסקי דין</Link></li>
              <li aria-hidden="true" className="mx-1">&gt;</li>
              <li><Link href={`/search?court=${encodeURIComponent(judgment.court)}`} className="hover:text-[#C9A84C] transition-colors">{judgment.court}</Link></li>
              <li aria-hidden="true" className="mx-1">&gt;</li>
              <li className="text-[#0B3C5D] font-medium truncate max-w-[200px] sm:max-w-none" aria-current="page">
                {personName || judgment.caseNumber}
              </li>
            </ol>
          </div>
        </nav>

        {/* Main layout */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Content */}
            <main className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold leading-snug mb-2">
                {personName ? (
                  <>
                    כל פסקי הדין עבור{' '}
                    <span className="text-[#0B3C5D] text-3xl sm:text-4xl block mt-1">{personName}</span>
                  </>
                ) : (
                  <>פסק דין {judgment.caseNumber}</>
                )}
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                {judgment.caseNumber} | {caseTitle}
              </p>

              {/* Info grid */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 mb-6">
                <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 text-sm">
                  {[
                    { label: 'מספר תיק', value: judgment.caseNumber },
                    { label: 'בית משפט', value: judgment.court },
                    { label: 'סוג הליך', value: judgment.proceedingType },
                    { label: 'תאריך', value: formatDate(judgment.date) },
                    { label: 'שופט/ת', value: judgment.judge },
                    { label: 'סטטוס', value: judgment.status, badge: true },
                  ].map((item) => (
                    <div key={item.label}>
                      <dt className="text-gray-500 mb-1">{item.label}</dt>
                      <dd className="font-semibold">
                        {item.badge ? (
                          <span className="inline-block px-3 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                            {item.value}
                          </span>
                        ) : item.value || '-'}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Parties */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 mb-6">
                <h2 className="text-lg font-bold mb-4">צדדים</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="bg-[#FAFBFC] rounded-xl p-4">
                    <span className="block text-gray-500 mb-1">תובע/ת (עותר)</span>
                    <span className="font-bold text-base text-[#0B3C5D]">{judgment.plaintiff || '-'}</span>
                  </div>
                  <div className="bg-[#FAFBFC] rounded-xl p-4">
                    <span className="block text-gray-500 mb-1">נתבע/ת (משיב)</span>
                    <span className="font-bold text-base text-[#0B3C5D]">{judgment.defendant || '-'}</span>
                  </div>
                </div>
              </div>

              {/* Summary */}
              {judgment.summary && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 mb-6">
                  <h2 className="text-lg font-bold mb-3">
                    תקציר פסק הדין {personName ? `נגד ${personName}` : ''}
                  </h2>
                  <p className="leading-7 text-gray-700">{judgment.summary}</p>
                </div>
              )}

              {/* Full text */}
              {judgment.fullText.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
                  <h2 className="text-lg font-bold mb-4">נוסח פסק הדין</h2>
                  <p className="leading-7 text-gray-700 mb-4">{judgment.fullText[0]}</p>

                  {judgment.fullText.length > 1 && (
                    <div className="relative">
                      <div className="select-none pointer-events-none" aria-hidden="true">
                        {judgment.fullText.slice(1).map((p, i) => (
                          <p key={i} className="leading-7 text-gray-700 mb-4 blur-sm">{p}</p>
                        ))}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-white flex flex-col items-center justify-end pb-8">
                        <p className="text-gray-600 mb-4 text-center text-sm sm:text-base">
                          לצפייה בנוסח המלא של פסק הדין יש לרכוש את המסמך
                        </p>
                        <button type="button" className="bg-gradient-to-l from-[#C9A84C] to-[#D4B85E] text-[#072a42] font-bold px-8 py-3 rounded-xl transition-all shadow hover:shadow-lg hover:-translate-y-0.5">
                          לרכישת המסמך המלא
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* SEO content block */}
              {personName && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 mt-6">
                  <h2 className="text-lg font-bold mb-3">מידע נוסף על פסק הדין</h2>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    פסק דין זה עוסק ב{personName} ונדון ב{judgment.court} תחת מספר תיק {judgment.caseNumber}.
                    {judgment.judge ? ` השופט/ת ${judgment.judge} דן/ה בתיק.` : ''}
                    {judgment.proceedingType ? ` סוג ההליך: ${judgment.proceedingType}.` : ''}
                    {judgment.category ? ` קטגוריה: ${judgment.category}.` : ''}
                    {' '}לחיפוש פסקי דין נוספים בעניין {personName} או להגשת בקשת הסרת אזכור, השתמשו במנוע החיפוש של משפטלי.
                  </p>
                </div>
              )}
            </main>

            {/* Sidebar */}
            <aside className="w-full lg:w-80 shrink-0 flex flex-col gap-5">
              <Link
                href={`/removal-request?judgment=${slug}`}
                className="flex items-center justify-center gap-2 bg-[#B83232] hover:bg-red-700 text-white font-bold rounded-xl px-5 py-3.5 transition-all shadow-sm text-center hover:shadow-md"
              >
                בקשת הסרת אזכור {personName ? `של ${personName}` : ''}
              </Link>

              <button type="button" disabled className="flex items-center justify-center gap-2 bg-gray-200 text-gray-400 font-semibold rounded-xl px-5 py-3 cursor-not-allowed">
                הורדת PDF (בקרוב)
              </button>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h3 className="font-bold mb-3 text-sm">שיתוף</h3>
                <div className="flex gap-3">
                  <a href={`https://wa.me/?text=${encodeURIComponent(`${judgment.caseNumber} ${caseTitle} - ${SITE_URL}/judgment/${slug}`)}`} target="_blank" rel="noopener noreferrer" title="שיתוף בוואטסאפ" className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-50 hover:bg-green-100 transition-colors text-green-600">
                    <span className="text-lg">W</span>
                  </a>
                  <a href={`mailto:?subject=${encodeURIComponent(`${judgment.caseNumber} ${caseTitle}`)}&body=${encodeURIComponent(`${SITE_URL}/judgment/${slug}`)}`} title="שיתוף במייל" className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors text-blue-600">
                    <span className="text-lg">@</span>
                  </a>
                </div>
              </div>

              {relatedItems.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                  <h3 className="font-bold mb-3 text-sm">פסקי דין קשורים</h3>
                  <ul className="space-y-2">
                    {relatedItems.map((rel) => (
                      <li key={rel.slug}>
                        <Link href={`/judgment/${rel.slug}`} className="block text-sm text-[#0B3C5D] hover:text-[#C9A84C] hover:underline transition-colors py-1">
                          {rel.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {personName && (
                <div className="bg-[#0B3C5D] rounded-2xl p-5 text-center">
                  <p className="text-white text-sm mb-3">חיפוש פסקי דין נוספים</p>
                  <Link
                    href={`/search?q=${encodeURIComponent(personName)}`}
                    className="inline-block w-full bg-[#C9A84C] text-[#072a42] font-bold rounded-xl px-4 py-2.5 text-sm transition-all hover:bg-[#D4B85E]"
                  >
                    חפש &quot;{personName}&quot;
                  </Link>
                </div>
              )}
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
