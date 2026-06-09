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
      aiAnalysis: stored.aiAnalysis || '',
      legalTopics: stored.legalTopics || [],
      keyFindings: stored.keyFindings || '',
      partiesArgs: stored.partiesArgs || '',
      courtReasoning: stored.courtReasoning || '',
      verdict: stored.verdict || '',
      decisionType: stored.decisionType || '',
      relatedCases: stored.relatedCases || [],
      aiEnrichedAt: stored.aiEnrichedAt || '',
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
    aiAnalysis: '',
    legalTopics: [] as string[],
    keyFindings: '',
    partiesArgs: '',
    courtReasoning: '',
    verdict: '',
    decisionType: '',
    relatedCases: [] as string[],
    aiEnrichedAt: '',
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
  const hasDefendant = !!j.defendant;
  const hasPlaintiff = !!j.plaintiff;

  const title = personName
    ? hasDefendant && hasPlaintiff
      ? `${j.defendant} - פסקי דין נגד ${j.defendant} | ${j.plaintiff} נגד ${j.defendant} | משפטלי`
      : `${personName} - פסק דין ${j.caseNumber} | ${j.court} | משפטלי`
    : `פסק דין ${j.caseNumber} | ${j.court} | משפטלי`;

  const description = personName
    ? hasDefendant && hasPlaintiff
      ? `פסקי דין נגד ${j.defendant}. ${j.plaintiff} נגד ${j.defendant} - פסק דין ${j.caseNumber} ב${j.court}. צפו בפסקי דין של ${j.defendant}. ${(j.summary || '').slice(0, 100)}`
      : `כל פסקי הדין עבור ${personName}. פסק דין ${j.caseNumber} ב${j.court}. ${(j.summary || '').slice(0, 120)}`
    : `פסק דין ${j.caseNumber} - ${j.summary?.slice(0, 150)}`;

  const keywords = [
    personName,
    j.defendant,
    j.plaintiff,
    `פסק דין ${personName}`,
    `פסקי דין ${personName}`,
    `פסקי דין נגד ${j.defendant}`,
    `${personName} פסק דין`,
    `${personName} בית משפט`,
    `${j.defendant} נתבע`,
    `${j.plaintiff} נגד ${j.defendant}`,
    j.caseNumber,
    j.court,
    j.judge,
    'פסק דין',
    'פסקי דין',
    'משפטלי',
    'משפט לי',
    j.proceedingType,
    j.category,
    ...j.legalTopics,
    'חיפוש פסקי דין',
    'חיפוש פסקי דין לפי שם',
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
// Section Component
// ---------------------------------------------------------------------------
function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h3 className="flex items-center gap-2 text-lg font-bold text-[#0B3C5D] mb-3 pb-2 border-b border-gray-200">
        <span className="text-xl">{icon}</span>
        {title}
      </h3>
      <div className="text-gray-800 leading-8">{children}</div>
    </div>
  );
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
          ...judgment.legalTopics.map(t => ({ "@type": "Thing", "name": t })),
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

  // Check how rich the content is
  const hasAiContent = !!(judgment.aiAnalysis || judgment.keyFindings || judgment.courtReasoning);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div dir="rtl" className="min-h-screen bg-[#f5f5f0] text-[#1a1a2e]">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="bg-white border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3">
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

        {/* Document header */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">
          <h1 className="text-xl sm:text-2xl font-bold text-[#0B3C5D] mb-1">
            {judgment.caseNumber}{judgment.plaintiff || judgment.defendant ? ` - ${[judgment.plaintiff, judgment.defendant].filter(Boolean).join(' נ\' ')}` : ''}{judgment.proceedingType ? `, ${judgment.proceedingType}` : ''}
          </h1>
          <p className="text-sm text-gray-500 mb-4">
            {[judgment.caseNumber, judgment.court, judgment.decisionType].filter(Boolean).join(' | ')}
          </p>

          {/* Action buttons - top */}
          <div className="flex flex-wrap gap-3 mb-6">
            <button type="button" className="bg-gradient-to-l from-[#C9A84C] to-[#D4B85E] text-[#072a42] font-bold px-6 py-2.5 rounded-lg transition-all shadow hover:shadow-lg hover:-translate-y-0.5 text-sm">
              רכישת מסמך
            </button>
            <Link
              href={`/removal-request?judgment=${slug}`}
              className="bg-[#0B3C5D] hover:bg-[#072a42] text-white font-bold rounded-lg px-6 py-2.5 transition-all shadow-sm text-sm"
            >
              מחיקת אזכור
            </Link>
            {judgment.sourceUrl && (
              <a
                href={judgment.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg px-6 py-2.5 transition-all text-sm"
              >
                מקור המסמך &#x2197;
              </a>
            )}
          </div>
        </div>

        {/* Main content area */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left sidebar - case details card */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-5 sticky top-4">
                <h3 className="font-bold text-[#0B3C5D] mb-4 pb-2 border-b border-gray-200">פרטי התיק</h3>
                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className="text-gray-500 text-xs">מספר תיק</dt>
                    <dd className="font-semibold text-[#0B3C5D]">{judgment.caseNumber}</dd>
                  </div>
                  {judgment.court && (
                    <div>
                      <dt className="text-gray-500 text-xs">בית משפט</dt>
                      <dd className="font-medium">{judgment.court}</dd>
                    </div>
                  )}
                  {judgment.judge && (
                    <div>
                      <dt className="text-gray-500 text-xs">שופט/ת</dt>
                      <dd className="font-medium">{judgment.judge}</dd>
                    </div>
                  )}
                  {judgment.date && (
                    <div>
                      <dt className="text-gray-500 text-xs">תאריך</dt>
                      <dd className="font-medium">{formatDate(judgment.date)}</dd>
                    </div>
                  )}
                  {judgment.decisionType && (
                    <div>
                      <dt className="text-gray-500 text-xs">סוג החלטה</dt>
                      <dd className="font-medium">{judgment.decisionType}</dd>
                    </div>
                  )}
                  {judgment.proceedingType && (
                    <div>
                      <dt className="text-gray-500 text-xs">סוג הליך</dt>
                      <dd className="font-medium">{judgment.proceedingType}</dd>
                    </div>
                  )}
                  {judgment.category && (
                    <div>
                      <dt className="text-gray-500 text-xs">קטגוריה</dt>
                      <dd>
                        <Link href={`/search?category=${encodeURIComponent(judgment.category)}`} className="text-[#C9A84C] hover:underline font-medium">
                          {judgment.category}
                        </Link>
                      </dd>
                    </div>
                  )}
                  {judgment.plaintiff && (
                    <div>
                      <dt className="text-gray-500 text-xs">תובע / עותר</dt>
                      <dd className="font-medium">{judgment.plaintiff}</dd>
                    </div>
                  )}
                  {judgment.defendant && (
                    <div>
                      <dt className="text-gray-500 text-xs">נתבע / משיב</dt>
                      <dd className="font-medium">{judgment.defendant}</dd>
                    </div>
                  )}
                  {judgment.sourceName && (
                    <div>
                      <dt className="text-gray-500 text-xs">מקור</dt>
                      <dd className="font-medium">{judgment.sourceName}</dd>
                    </div>
                  )}
                </dl>

                {/* Legal topics */}
                {judgment.legalTopics.length > 0 && (
                  <div className="mt-5 pt-4 border-t border-gray-200">
                    <h4 className="text-xs text-gray-500 mb-2">נושאים משפטיים</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {judgment.legalTopics.map((topic, i) => (
                        <Link
                          key={i}
                          href={`/search?q=${encodeURIComponent(topic)}`}
                          className="inline-block bg-[#f0ebe0] text-[#0B3C5D] text-xs px-2.5 py-1 rounded-full hover:bg-[#e5ddd0] transition-colors"
                        >
                          {topic}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Related cases */}
                {judgment.relatedCases.length > 0 && (
                  <div className="mt-5 pt-4 border-t border-gray-200">
                    <h4 className="text-xs text-gray-500 mb-2">תיקים קשורים</h4>
                    <ul className="space-y-1">
                      {judgment.relatedCases.map((c, i) => (
                        <li key={i}>
                          <Link href={`/search?q=${encodeURIComponent(c)}`} className="text-sm text-[#0B3C5D] hover:text-[#C9A84C] hover:underline">
                            {c}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Purchase CTA in sidebar */}
                <div className="mt-5 pt-4 border-t border-gray-200">
                  <button type="button" className="w-full bg-gradient-to-l from-[#C9A84C] to-[#D4B85E] text-[#072a42] font-bold px-4 py-3 rounded-lg transition-all shadow hover:shadow-lg hover:-translate-y-0.5 text-sm">
                    רכישת מסמך מלא
                  </button>
                  <Link
                    href={`/removal-request?judgment=${slug}`}
                    className="block w-full text-center mt-2 bg-[#0B3C5D] hover:bg-[#072a42] text-white font-bold rounded-lg px-4 py-3 transition-all shadow-sm text-sm"
                  >
                    מחיקת אזכור
                  </Link>
                </div>
              </div>
            </div>

            {/* Main content - document */}
            <div className="lg:col-span-2 order-1 lg:order-2">
              <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                {/* Document header */}
                <div className="px-6 sm:px-10 py-8 sm:py-10">
                  {/* Parties */}
                  {(judgment.plaintiff || judgment.defendant) && (
                    <div className="text-center mb-8">
                      {judgment.plaintiff && <p className="text-lg font-bold text-[#0B3C5D] mb-2">{judgment.plaintiff}</p>}
                      {judgment.plaintiff && judgment.defendant && <p className="text-sm text-gray-500 font-semibold mb-2">נ ג ד</p>}
                      {judgment.defendant && <p className="text-lg font-bold text-[#0B3C5D]">{judgment.defendant}</p>}
                    </div>
                  )}

                  {/* Court */}
                  {judgment.court && <h2 className="text-xl font-bold text-[#0B3C5D] text-center mb-2">{judgment.court}</h2>}
                  {judgment.date && <p className="text-center text-gray-600 mb-2">[ {formatDate(judgment.date)} ]</p>}
                  {judgment.judge && (
                    <p className="text-center text-gray-700 mb-6">
                      כבוד השופט/ת <span className="font-semibold">{judgment.judge}</span>
                    </p>
                  )}

                  {/* Case info line */}
                  <div className="text-center text-sm text-gray-500 mb-8 border-b border-gray-200 pb-6">
                    <p>{[
                      `מספר תיק: ${judgment.caseNumber}`,
                      judgment.proceedingType ? `סוג הליך: ${judgment.proceedingType}` : '',
                      judgment.category || '',
                      judgment.decisionType || '',
                    ].filter(Boolean).join(' | ')}</p>
                  </div>

                  {/* Summary */}
                  {judgment.summary && (
                    <Section title="תקציר" icon="&#x1F4CB;">
                      <p className="text-justify">{judgment.summary}</p>
                    </Section>
                  )}

                  {/* Verdict / Decision */}
                  {judgment.verdict && (
                    <Section title="הכרעת הדין" icon="&#x2696;">
                      <div className="bg-[#f9f7f2] border-r-4 border-[#C9A84C] p-4 rounded-l-lg">
                        <p className="text-justify font-medium">{judgment.verdict}</p>
                      </div>
                    </Section>
                  )}

                  {/* Key Findings */}
                  {judgment.keyFindings && (
                    <Section title="ממצאי מפתח" icon="&#x1F50D;">
                      <div className="space-y-2">
                        {judgment.keyFindings.split('\n').filter(Boolean).map((finding, i) => (
                          <p key={i} className="text-justify">{finding}</p>
                        ))}
                      </div>
                    </Section>
                  )}

                  {/* Parties Arguments */}
                  {judgment.partiesArgs && (
                    <Section title="טענות הצדדים" icon="&#x1F4AC;">
                      <div className="space-y-3">
                        {judgment.partiesArgs.split('\n').filter(Boolean).map((arg, i) => (
                          <p key={i} className="text-justify">{arg}</p>
                        ))}
                      </div>
                    </Section>
                  )}

                  {/* Court Reasoning */}
                  {judgment.courtReasoning && (
                    <Section title="נימוקי בית המשפט" icon="&#x1F3DB;">
                      <div className="space-y-3">
                        {judgment.courtReasoning.split('\n').filter(Boolean).map((reason, i) => (
                          <p key={i} className="text-justify">{reason}</p>
                        ))}
                      </div>
                    </Section>
                  )}

                  {/* AI Analysis */}
                  {judgment.aiAnalysis && (
                    <Section title="ניתוח משפטי" icon="&#x1F4D6;">
                      <div className="space-y-3">
                        {judgment.aiAnalysis.split('\n').filter(Boolean).map((para, i) => (
                          <p key={i} className="text-justify">{para}</p>
                        ))}
                      </div>
                    </Section>
                  )}

                  {/* Full text - document style (blurred for purchase) */}
                  {judgment.fullText.length > 0 && (
                    <div className="mt-8">
                      <h3 className="flex items-center gap-2 text-lg font-bold text-[#0B3C5D] mb-3 pb-2 border-b border-gray-200">
                        <span className="text-xl">&#x1F4C4;</span>
                        נוסח מלא של ההחלטה
                      </h3>
                      <div className="leading-8 text-gray-800 text-justify">
                        <p className="mb-4">{judgment.fullText[0]}</p>

                        {judgment.fullText.length > 1 && (
                          <div className="relative">
                            <div className="select-none pointer-events-none" aria-hidden="true">
                              {judgment.fullText.slice(1).map((p, i) => (
                                <p key={i} className="mb-4 blur-[3px]">{p}</p>
                              ))}
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/70 to-white flex flex-col items-center justify-end pb-10">
                              <div className="bg-[#f9f6ee] border border-[#e8dfc0] rounded-xl p-6 text-center max-w-lg mx-4">
                                <p className="text-gray-700 mb-1 font-semibold">במסמך זה מוצג רק דף ראשון של פסק הדין/ההחלטה,</p>
                                <p className="text-gray-600 mb-4 text-sm">ולא ניתן בהכרח ללמוד ממנו על תוצאות ההליך. על מנת לצפות במסמך המלא, יש לרכוש אותו.</p>
                                <button type="button" className="bg-gradient-to-l from-[#C9A84C] to-[#D4B85E] text-[#072a42] font-bold px-8 py-3 rounded-lg transition-all shadow hover:shadow-lg hover:-translate-y-0.5">
                                  רכישת מסמך
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Source link */}
                  {judgment.sourceUrl && (
                    <div className="mt-8 pt-4 border-t border-gray-200 text-sm">
                      <a
                        href={judgment.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0B3C5D] hover:text-[#C9A84C] hover:underline"
                      >
                        &#x1F517; צפה במסמך המקורי באתר {judgment.sourceName || 'המקור'}
                      </a>
                    </div>
                  )}
                </div>

                {/* Action buttons - bottom */}
                <div className="bg-gray-50 border-t border-gray-200 px-6 sm:px-10 py-5 flex flex-wrap gap-3">
                  <button type="button" className="bg-gradient-to-l from-[#C9A84C] to-[#D4B85E] text-[#072a42] font-bold px-6 py-2.5 rounded-lg transition-all shadow hover:shadow-lg hover:-translate-y-0.5 text-sm">
                    רכישת מסמך
                  </button>
                  <Link
                    href={`/removal-request?judgment=${slug}`}
                    className="bg-[#0B3C5D] hover:bg-[#072a42] text-white font-bold rounded-lg px-6 py-2.5 transition-all shadow-sm text-sm"
                  >
                    מחיקת אזכור
                  </Link>
                </div>
              </div>

              {/* Related & Search below document */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                {relatedItems.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                    <h3 className="font-bold mb-3 text-sm text-[#0B3C5D]">פסקי דין קשורים</h3>
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
                  <div className="bg-[#0B3C5D] rounded-lg p-5 text-center flex flex-col justify-center">
                    <p className="text-white text-sm mb-3">חיפוש פסקי דין נוספים בעניין {personName}</p>
                    <Link
                      href={`/search?q=${encodeURIComponent(personName)}`}
                      className="inline-block bg-[#C9A84C] text-[#072a42] font-bold rounded-lg px-4 py-2.5 text-sm transition-all hover:bg-[#D4B85E]"
                    >
                      חפש &quot;{personName}&quot;
                    </Link>
                  </div>
                )}
              </div>

              {/* SEO content block */}
              {personName && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 mt-6">
                  <h2 className="text-base font-bold mb-2 text-[#0B3C5D]">מידע נוסף על פסק הדין</h2>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    פסק דין זה עוסק ב{personName} ונדון ב{judgment.court} תחת מספר תיק {judgment.caseNumber}.
                    {judgment.judge ? ` השופט/ת ${judgment.judge} דן/ה בתיק.` : ''}
                    {judgment.proceedingType ? ` סוג ההליך: ${judgment.proceedingType}.` : ''}
                    {judgment.category ? ` קטגוריה: ${judgment.category}.` : ''}
                    {judgment.legalTopics.length > 0 ? ` נושאים משפטיים: ${judgment.legalTopics.join(', ')}.` : ''}
                    {' '}לחיפוש פסקי דין נוספים בעניין {personName} או להגשת בקשת הסרת אזכור, השתמשו במנוע החיפוש של משפטלי.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
