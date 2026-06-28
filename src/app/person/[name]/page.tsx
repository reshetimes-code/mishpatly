import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/db';

const SITE_URL = 'https://mishpatly.co.il';

// ---------------------------------------------------------------------------
// Data fetching
// ---------------------------------------------------------------------------
async function getPersonJudgments(name: string) {
  const decoded = decodeURIComponent(name);

  const judgments = await prisma.judgment.findMany({
    where: {
      status: 'PUBLISHED',
      OR: [
        { plaintiff: { contains: decoded } },
        { defendant: { contains: decoded } },
        { judge: { contains: decoded } },
      ],
    },
    select: {
      id: true,
      slug: true,
      caseNumber: true,
      courtName: true,
      judgmentDate: true,
      judge: true,
      plaintiff: true,
      defendant: true,
      category: true,
      summary: true,
      procedureType: true,
    },
    orderBy: { judgmentDate: 'desc' },
    take: 500,
  });

  // Determine the person's role(s)
  let asPlaintiff = 0;
  let asDefendant = 0;
  let asJudge = 0;
  const courts = new Set<string>();

  for (const j of judgments) {
    if (j.plaintiff?.includes(decoded)) asPlaintiff++;
    if (j.defendant?.includes(decoded)) asDefendant++;
    if (j.judge?.includes(decoded)) asJudge++;
    if (j.courtName) courts.add(j.courtName);
  }

  return {
    name: decoded,
    judgments,
    asPlaintiff,
    asDefendant,
    asJudge,
    courts: Array.from(courts),
    total: judgments.length,
  };
}

// ---------------------------------------------------------------------------
// SEO Metadata
// ---------------------------------------------------------------------------
interface PageProps {
  params: Promise<{ name: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { name } = await params;
  const decoded = decodeURIComponent(name);
  const data = await getPersonJudgments(name);

  const roleDesc = data.asJudge > 0
    ? `שופט/ת עם ${data.total} פסקי דין`
    : data.asDefendant > 0 && data.asPlaintiff > 0
      ? `${data.asPlaintiff} תביעות כתובע/ת ו-${data.asDefendant} כנתבע/ת`
      : data.asDefendant > 0
        ? `${data.asDefendant} פסקי דין כנתבע/ת`
        : `${data.asPlaintiff} פסקי דין כתובע/ת`;

  const title = `${decoded} - פסקי דין | כל פסקי הדין בעניין ${decoded} | משפטלי`;

  const description = `צפו בכל ${data.total} פסקי הדין הקשורים ל${decoded}. ${roleDesc}. חיפוש פסקי דין לפי שם - ${decoded} בית משפט. מאגר פסקי דין משפטלי - כל ההחלטות והפסיקות בעניין ${decoded}.`;

  const keywords = [
    `פסקי דין ${decoded}`,
    `${decoded} בית משפט`,
    `${decoded} נתבע`,
    `${decoded} תובע`,
    `${decoded} פסק דין`,
    `פסקי דין נגד ${decoded}`,
    `${decoded} שופט`,
    `${decoded} החלטות`,
    `חיפוש פסקי דין ${decoded}`,
    `${decoded} משפט`,
    'פסקי דין',
    'מאגר פסקי דין',
    'משפטלי',
    'חיפוש פסקי דין לפי שם',
  ];

  return {
    title,
    description,
    keywords,
    alternates: { canonical: `${SITE_URL}/person/${encodeURIComponent(decoded)}` },
    openGraph: {
      title: `${decoded} - כל פסקי הדין | משפטלי`,
      description,
      type: 'profile',
      locale: 'he_IL',
      siteName: 'משפטלי',
      url: `${SITE_URL}/person/${encodeURIComponent(decoded)}`,
      images: [{ url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630, alt: `פסקי דין ${decoded}` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${decoded} - פסקי דין | משפטלי`,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' as const },
    },
  };
}

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------
function formatDate(dateStr: string | Date): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return String(dateStr);
  return d.toLocaleDateString('he-IL');
}

function decode(str: string): string {
  try { return decodeURIComponent(str); } catch { return str; }
}

// ---------------------------------------------------------------------------
// Page Component
// ---------------------------------------------------------------------------
export default async function PersonPage({ params }: PageProps) {
  const { name } = await params;
  const data = await getPersonJudgments(name);

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${data.name} - פסקי דין`,
    description: `כל פסקי הדין הקשורים ל${data.name}`,
    url: `${SITE_URL}/person/${encodeURIComponent(data.name)}`,
    mainEntity: {
      '@type': 'Person',
      name: data.name,
      description: data.asJudge > 0
        ? `שופט/ת - ${data.total} פסקי דין`
        : `מעורב/ת ב-${data.total} פסקי דין`,
    },
    hasPart: data.judgments.slice(0, 20).map((j) => ({
      '@type': 'LegalCase',
      name: j.caseNumber,
      url: `${SITE_URL}/judgment/${encodeURIComponent(j.slug)}`,
      datePublished: j.judgmentDate ? new Date(j.judgmentDate).toISOString().split('T')[0] : undefined,
      court: j.courtName ? { '@type': 'Organization', name: j.courtName } : undefined,
    })),
    numberOfItems: data.total,
    isPartOf: {
      '@type': 'WebSite',
      name: 'משפטלי',
      url: SITE_URL,
    },
  };

  const roleLabel = data.asJudge > 0 ? 'שופט/ת' : data.asDefendant > data.asPlaintiff ? 'נתבע/ת' : 'תובע/ת';

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <div className="bg-gradient-to-l from-[#0B3C5D] to-[#1a5276] text-white py-10">
        <div className="max-w-5xl mx-auto px-4">
          <nav className="text-sm mb-4 text-blue-200">
            <Link href="/" className="hover:text-white">דף הבית</Link>
            <span className="mx-2">/</span>
            <span>פסקי דין לפי שם</span>
            <span className="mx-2">/</span>
            <span>{data.name}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            {data.name}
          </h1>
          <p className="text-lg text-blue-100 mb-4">
            כל פסקי הדין בעניין {data.name} - {data.total} פסקי דין במאגר
          </p>

          {/* Stats */}
          <div className="flex flex-wrap gap-4 mt-4">
            {data.asPlaintiff > 0 && (
              <div className="bg-white/10 rounded-lg px-4 py-2">
                <span className="text-2xl font-bold">{data.asPlaintiff}</span>
                <span className="text-sm text-blue-200 mr-2">כתובע/ת</span>
              </div>
            )}
            {data.asDefendant > 0 && (
              <div className="bg-white/10 rounded-lg px-4 py-2">
                <span className="text-2xl font-bold">{data.asDefendant}</span>
                <span className="text-sm text-blue-200 mr-2">כנתבע/ת</span>
              </div>
            )}
            {data.asJudge > 0 && (
              <div className="bg-white/10 rounded-lg px-4 py-2">
                <span className="text-2xl font-bold">{data.asJudge}</span>
                <span className="text-sm text-blue-200 mr-2">כשופט/ת</span>
              </div>
            )}
            <div className="bg-white/10 rounded-lg px-4 py-2">
              <span className="text-2xl font-bold">{data.courts.length}</span>
              <span className="text-sm text-blue-200 mr-2">בתי משפט</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {data.total === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">לא נמצאו פסקי דין</h2>
            <p className="text-gray-500">לא נמצאו פסקי דין הקשורים ל{data.name} במאגר.</p>
            <Link href="/" className="inline-block mt-4 text-[#0B3C5D] hover:underline font-medium">
              חזרה לדף הבית
            </Link>
          </div>
        ) : (
          <>
            {/* SEO content paragraph */}
            <div className="bg-white rounded-xl shadow p-6 mb-6">
              <h2 className="text-xl font-bold text-[#0B3C5D] mb-3">
                פסקי דין בעניין {data.name}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {data.asJudge > 0
                  ? `${data.name} הוא/היא שופט/ת אשר נתן/ה ${data.total} פסקי דין המופיעים במאגר משפטלי. פסקי הדין של ${data.name} ניתנו בבתי המשפט: ${data.courts.join(', ')}. להלן רשימת כל פסקי הדין של השופט/ת ${data.name}.`
                  : `${data.name} מופיע/ה ב-${data.total} פסקי דין במאגר משפטלי${data.asPlaintiff > 0 ? `, מתוכם ${data.asPlaintiff} כתובע/ת` : ''}${data.asDefendant > 0 ? ` ו-${data.asDefendant} כנתבע/ת` : ''}. פסקי הדין הקשורים ל${data.name} ניתנו בבתי המשפט: ${data.courts.join(', ')}.`
                }
              </p>
            </div>

            {/* Judgment list */}
            <div className="space-y-4">
              {data.judgments.map((j) => (
                <Link
                  key={j.id}
                  href={`/judgment/${encodeURIComponent(j.slug)}`}
                  className="block bg-white rounded-xl shadow hover:shadow-md transition-shadow p-5 border border-gray-100"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[#0B3C5D] mb-1">
                        {decode(j.caseNumber)}
                      </h3>
                      <div className="text-sm text-gray-600 space-y-1">
                        {j.courtName && (
                          <p>
                            <span className="text-gray-400">בית משפט:</span>{' '}
                            {decode(j.courtName)}
                          </p>
                        )}
                        {j.judge && (
                          <p>
                            <span className="text-gray-400">שופט/ת:</span>{' '}
                            <span className="text-[#0B3C5D]">
                              {decode(j.judge)}
                            </span>
                          </p>
                        )}
                        <div className="flex flex-wrap gap-x-4">
                          {j.plaintiff && (
                            <p>
                              <span className="text-gray-400">תובע:</span>{' '}
                              {decode(j.plaintiff)}
                            </p>
                          )}
                          {j.defendant && (
                            <p>
                              <span className="text-gray-400">נתבע:</span>{' '}
                              {decode(j.defendant)}
                            </p>
                          )}
                        </div>
                      </div>
                      {j.summary && (
                        <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                          {decode(j.summary).slice(0, 200)}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-row md:flex-col items-center md:items-end gap-2 text-sm">
                      {j.judgmentDate && (
                        <span className="text-gray-400">
                          {formatDate(j.judgmentDate)}
                        </span>
                      )}
                      {j.category && (
                        <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs">
                          {decode(j.category)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Internal links section for SEO */}
            {data.courts.length > 0 && (
              <div className="bg-white rounded-xl shadow p-6 mt-8">
                <h2 className="text-lg font-bold text-[#0B3C5D] mb-3">
                  בתי משפט קשורים
                </h2>
                <div className="flex flex-wrap gap-2">
                  {data.courts.map((court) => (
                    <Link
                      key={court}
                      href={`/search?court=${encodeURIComponent(court)}`}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-sm transition-colors"
                    >
                      {decode(court)}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Related persons for SEO interlinking */}
            <div className="bg-white rounded-xl shadow p-6 mt-4">
              <h2 className="text-lg font-bold text-[#0B3C5D] mb-3">
                צדדים קשורים
              </h2>
              <div className="flex flex-wrap gap-2">
                {data.judgments.slice(0, 30).flatMap((j) => {
                  const people: { name: string; role: string }[] = [];
                  if (j.plaintiff && j.plaintiff !== data.name && j.plaintiff.length > 1) {
                    people.push({ name: j.plaintiff, role: 'תובע' });
                  }
                  if (j.defendant && j.defendant !== data.name && j.defendant.length > 1) {
                    people.push({ name: j.defendant, role: 'נתבע' });
                  }
                  if (j.judge && j.judge !== data.name && j.judge.length > 1) {
                    people.push({ name: j.judge, role: 'שופט' });
                  }
                  return people;
                }).filter((p, i, arr) => arr.findIndex((x) => x.name === p.name) === i).slice(0, 20).map((p) => (
                  <Link
                    key={p.name}
                    href={`/person/${encodeURIComponent(p.name)}`}
                    className="bg-blue-50 hover:bg-blue-100 text-[#0B3C5D] px-3 py-1.5 rounded-lg text-sm transition-colors"
                  >
                    {decode(p.name)}
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
