import Link from 'next/link';
import type { Metadata } from 'next';
import { searchLawyers, getAllLawyers, SPECIALIZATIONS, CITIES } from '@/lib/lawyer-store';

const SITE_URL = 'https://mishpatly.co.il';

export const metadata: Metadata = {
  title: 'פורטל עורכי דין - חיפוש עורך דין לפי תחום ועיר | משפטלי',
  description: 'פורטל עורכי הדין המוביל בישראל - מצאו עורך דין מומלץ לפי תחום התמחות ועיר. עורכי דין פלילי, משפחה, נזיקין, עבודה, מקרקעין, הוצאה לפועל. תל אביב, ירושלים, חיפה, באר שבע. דירוג, חוות דעת, טלפון וWhatsApp.',
  keywords: [
    'עורכי דין', 'עורך דין', 'פורטל עורכי דין', 'חיפוש עורך דין',
    'עורך דין מומלץ', 'אינדקס עורכי דין', 'מדריך עורכי דין',
    // תחומים
    'עורך דין פלילי', 'עורך דין משפחה', 'עורך דין נזיקין', 'עורך דין עבודה',
    'עורך דין מקרקעין', 'עורך דין הוצאה לפועל', 'עורך דין ביטוח לאומי',
    'עורך דין תעבורה', 'עורך דין מסחרי', 'עורך דין חוזים', 'עורך דין ירושות',
    'עורך דין גירושין', 'עורך דין חדלות פירעון', 'עורך דין צוואות',
    'עורך דין נדלן', 'עורך דין ביטוח', 'עורך דין אזרחי', 'עורך דין מנהלי',
    // ערים
    'עורך דין תל אביב', 'עורך דין ירושלים', 'עורך דין חיפה', 'עורך דין באר שבע',
    'עורך דין נתניה', 'עורך דין ראשון לציון', 'עורך דין פתח תקווה', 'עורך דין הרצליה',
    'עורך דין רמת גן', 'עורך דין אשדוד', 'עורך דין כפר סבא', 'עורך דין רחובות',
    'עורך דין נצרת', 'עורך דין עכו', 'עורך דין קריות',
    // שילובים חמים
    'עורך דין פלילי תל אביב', 'עורך דין משפחה חיפה', 'עורך דין נזיקין ירושלים',
    'עורך דין עבודה באר שבע', 'עורך דין גירושין תל אביב', 'עורך דין מקרקעין חיפה',
    // מתחרים
    'משפטלי', 'משפט לי', 'פורטל עורכי דין ישראל',
  ],
  alternates: { canonical: `${SITE_URL}/lawyers` },
  openGraph: {
    title: 'פורטל עורכי דין | משפטלי',
    description: 'מצאו את עורך הדין המתאים לכם לפי תחום התמחות, אזור ודירוג לקוחות.',
    type: 'website',
    locale: 'he_IL',
    siteName: 'משפטלי',
    url: `${SITE_URL}/lawyers`,
  },
};

function StarRating({ rating }: { rating: number }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} className={i <= Math.round(rating) ? 'text-accent' : 'text-gray-300'}>
        &#9733;
      </span>
    );
  }
  return <span className="text-lg">{stars}</span>;
}

export default async function LawyersPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    specialization?: string;
    city?: string;
    page?: string;
    sort?: string;
  }>;
}) {
  const params = await searchParams;
  const query = params.q ?? '';
  const specFilter = params.specialization ?? '';
  const cityFilter = params.city ?? '';
  const currentPage = Math.max(1, parseInt(params.page ?? '1', 10) || 1);
  const sortBy = (params.sort as 'rating' | 'name' | 'experience') || 'rating';

  const { lawyers, total, totalPages } = await searchLawyers({
    query,
    specialization: specFilter,
    city: cityFilter,
    page: currentPage,
    limit: 12,
    sortBy,
  });

  // Only fetch distinct cities and specializations - NOT all lawyer data (was 4.8MB!)
  const { prisma } = await import('@/lib/db');
  const [cityRows, specRows] = await Promise.all([
    prisma.lawyer.findMany({ where: { isActive: true, city: { not: '' } }, select: { city: true }, distinct: ['city'] }),
    prisma.lawyer.findMany({ where: { isActive: true }, select: { specializations: true } }),
  ]);
  const usedCities = cityRows.map(r => r.city!).filter(Boolean).sort();
  const usedSpecs = Array.from(new Set(specRows.flatMap(r => r.specializations).filter(Boolean))).sort();
  const allLawyersCount = await prisma.lawyer.count({ where: { isActive: true } });

  const safePage = Math.min(currentPage, Math.max(1, totalPages));

  function buildUrl(overrides: Record<string, string>) {
    const base: Record<string, string> = {};
    if (query) base.q = query;
    if (specFilter) base.specialization = specFilter;
    if (cityFilter) base.city = cityFilter;
    if (sortBy !== 'rating') base.sort = sortBy;
    const merged = { ...base, ...overrides };
    Object.keys(merged).forEach((k) => { if (!merged[k]) delete merged[k]; });
    const qs = new URLSearchParams(merged).toString();
    return `/lawyers${qs ? `?${qs}` : ''}`;
  }

  return (
    <div dir="rtl" className="min-h-screen bg-legal-bg text-legal-text">
      {/* Hero */}
      <section className="bg-gradient-to-bl from-[#0B3C5D] via-[#072a42] to-[#0B3C5D] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">
            פורטל <span className="text-gradient-gold">עורכי הדין</span> של ישראל
          </h1>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto mb-6">
            מצאו את עורך הדין המתאים לכם - לפי תחום התמחות, אזור ודירוג לקוחות
          </p>

          {/* Search */}
          <form action="/lawyers" method="GET" className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="חיפוש לפי שם, תחום או עיר..."
                className="flex-1 rounded-lg bg-white/10 border border-white/20 text-white placeholder-blue-200 py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 backdrop-blur-sm"
              />
              <button
                type="submit"
                className="rounded-lg bg-accent px-8 py-3 text-sm font-bold text-[#072a42] transition-colors hover:bg-accent-light"
              >
                חיפוש
              </button>
            </div>
          </form>

          {/* CTA */}
          <div className="mt-6">
            <Link
              href="/lawyers/register"
              className="inline-flex items-center gap-2 rounded-lg border-2 border-accent px-6 py-2.5 text-sm font-bold text-accent transition-all hover:bg-accent hover:text-[#072a42]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              הרשמה לפורטל - צרו כרטיס ביקור
            </Link>
          </div>
        </div>
      </section>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Sidebar filters */}
          <aside className="w-full shrink-0 lg:w-56 order-last lg:order-first">
            <details className="group rounded-lg border border-gray-200 bg-white lg:open" open>
              <summary className="cursor-pointer select-none px-4 py-3 text-sm font-bold text-primary lg:pointer-events-none lg:list-none">
                <span className="inline lg:hidden">סינון &#x25BE;</span>
                <span className="hidden lg:inline">סינון</span>
              </summary>
              <div className="space-y-5 px-4 pb-4">
                {/* Specialization */}
                {(usedSpecs.length > 0 ? usedSpecs : SPECIALIZATIONS.slice(0, 10)).length > 0 && (
                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-legal-text">תחום התמחות</h3>
                    <ul className="space-y-1 max-h-52 overflow-y-auto">
                      {(usedSpecs.length > 0 ? usedSpecs : SPECIALIZATIONS).map((s) => (
                        <li key={s}>
                          <Link
                            href={buildUrl({ specialization: specFilter === s ? '' : s, page: '1' })}
                            className={`block rounded px-2 py-1 text-sm transition-colors ${specFilter === s ? 'bg-accent/10 font-semibold text-accent' : 'text-gray-700 hover:bg-gray-100'}`}
                          >
                            {s}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* City */}
                {(usedCities.length > 0 ? usedCities : CITIES.slice(0, 10)).length > 0 && (
                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-legal-text">עיר</h3>
                    <ul className="space-y-1 max-h-52 overflow-y-auto">
                      {(usedCities.length > 0 ? usedCities : CITIES).map((c) => (
                        <li key={c}>
                          <Link
                            href={buildUrl({ city: cityFilter === c ? '' : c, page: '1' })}
                            className={`block rounded px-2 py-1 text-sm transition-colors ${cityFilter === c ? 'bg-accent/10 font-semibold text-accent' : 'text-gray-700 hover:bg-gray-100'}`}
                          >
                            {c}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Sort */}
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-legal-text">מיון</h3>
                  <div className="space-y-1">
                    {[
                      { key: 'rating', label: 'דירוג' },
                      { key: 'name', label: 'שם' },
                      { key: 'experience', label: 'ותק' },
                    ].map((s) => (
                      <Link
                        key={s.key}
                        href={buildUrl({ sort: s.key === 'rating' ? '' : s.key, page: '1' })}
                        className={`block rounded px-2 py-1 text-sm transition-colors ${sortBy === s.key ? 'bg-accent/10 font-semibold text-accent' : 'text-gray-700 hover:bg-gray-100'}`}
                      >
                        {s.label}
                      </Link>
                    ))}
                  </div>
                </div>

                {(specFilter || cityFilter) && (
                  <Link href="/lawyers" className="block text-center text-sm font-medium text-legal-danger hover:underline">
                    נקה סינון
                  </Link>
                )}
              </div>
            </details>
          </aside>

          {/* Results */}
          <section className="flex-1">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                נמצאו <span className="font-bold text-legal-text">{total}</span> עורכי דין
              </p>
            </div>

            {lawyers.length === 0 ? (
              <div className="rounded-lg border border-gray-200 bg-white px-6 py-16 text-center">
                <p className="text-lg font-semibold text-gray-500">
                  {allLawyersCount === 0 ? 'עדיין אין עורכי דין רשומים' : 'לא נמצאו תוצאות'}
                </p>
                <p className="mt-2 text-sm text-gray-400">
                  {allLawyersCount === 0 ? (
                    <Link href="/lawyers/register" className="text-accent hover:underline">
                      היו הראשונים להירשם לפורטל
                    </Link>
                  ) : (
                    'נסו לשנות את מילות החיפוש'
                  )}
                </p>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {lawyers.map((l) => (
                  <Link
                    key={l.id}
                    href={`/lawyers/${l.slug}`}
                    className="group rounded-2xl border border-gray-200 bg-white overflow-hidden block shadow-sm hover:shadow-lg transition-shadow"
                  >
                    {/* Top image area */}
                    <div className="relative">
                      <div className="h-40 bg-gradient-to-bl from-[#0B3C5D] via-[#072a42] to-[#0B3C5D] overflow-hidden">
                        {l.coverImage ? (
                          <img src={l.coverImage} alt={`עורך דין ${l.fullName}`} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
                        ) : (
                          <div className="absolute inset-0 opacity-20 bg-[url('/court-bg.jpg')] bg-cover bg-center" />
                        )}
                        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#072a42]/80 to-transparent" />
                        {l.isVerified && (
                          <span className="absolute top-3 left-3 rounded-full bg-white/20 backdrop-blur-sm px-2.5 py-0.5 text-xs font-semibold text-white">
                            {'\u2713'} מאומת
                          </span>
                        )}
                      </div>
                      {/* Avatar - positioned to overlap both sections */}
                      {l.profileImage ? (
                        <img
                          src={l.profileImage}
                          alt={`עורך דין ${l.fullName} - ${l.city || ''} - ${l.specializations?.slice(0,2).join(', ') || ''}`}
                          loading="lazy"
                          className="absolute -bottom-8 right-5 w-16 h-16 rounded-full object-cover border-4 border-white shadow-md z-10"
                        />
                      ) : (
                        <div className="absolute -bottom-8 right-5 w-16 h-16 rounded-full bg-gradient-to-br from-accent to-[#D4B85E] flex items-center justify-center text-[#072a42] text-2xl font-bold border-4 border-white shadow-md z-10">
                          {l.fullName.charAt(0)}
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="pt-10 px-5 pb-5">
                      <h3 className="font-bold text-lg text-primary">{l.fullName}</h3>
                      <p className="text-sm text-gray-500 mb-2">{l.city}</p>
                      <div className="flex items-center gap-1 mb-3">
                        <StarRating rating={l.rating} />
                        <span className="text-xs text-gray-500">({l.reviewCount})</span>
                      </div>

                      {/* Specializations */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {l.specializations.slice(0, 3).map((s: string) => (
                          <span key={s} className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">
                            {s}
                          </span>
                        ))}
                        {l.specializations.length > 3 && (
                          <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-500">
                            +{l.specializations.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Bio */}
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4">{l.bio || 'עורך דין מוסמך'}</p>

                      {/* Footer */}
                      <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-3">
                        <span>{l.yearsExperience > 0 ? `${l.yearsExperience} שנות ניסיון` : ''}</span>
                        <span className="text-accent font-semibold group-hover:translate-x-[-4px] transition-transform">לפרופיל המלא &larr;</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <nav className="flex items-center justify-center gap-1 pt-6">
                {safePage > 1 && (
                  <Link href={buildUrl({ page: String(safePage - 1) })} className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    הקודם
                  </Link>
                )}
                {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                  const start = Math.max(1, safePage - 3);
                  return start + i;
                })
                  .filter((p) => p <= totalPages)
                  .map((p) => (
                    <Link
                      key={p}
                      href={buildUrl({ page: String(p) })}
                      className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${p === safePage ? 'bg-primary text-white' : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'}`}
                    >
                      {p}
                    </Link>
                  ))}
                {safePage < totalPages && (
                  <Link href={buildUrl({ page: String(safePage + 1) })} className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    הבא
                  </Link>
                )}
              </nav>
            )}
          </section>
        </div>
      </div>

      {/* SEO Content Section - beats din.co.il, psakdin, ilaw, mishpati */}
      <section className="bg-white border-t border-gray-200 px-4 py-12 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-[#0B3C5D] mb-4">חיפוש עורך דין מומלץ בישראל</h2>
          <div className="text-gray-600 leading-relaxed space-y-3 text-sm">
            <p>
              <strong>פורטל עורכי הדין של משפטלי</strong> מאפשר לכם למצוא עורך דין מומלץ בכל תחום ובכל עיר בישראל.
              בין אם אתם מחפשים <Link href="/lawyers?specialization=פלילי" className="text-[#0B3C5D] underline hover:text-[#C9A84C]">עורך דין פלילי</Link>,
              <Link href="/lawyers?specialization=דיני משפחה" className="text-[#0B3C5D] underline hover:text-[#C9A84C]"> עורך דין משפחה</Link>,
              <Link href="/lawyers?specialization=נזיקין" className="text-[#0B3C5D] underline hover:text-[#C9A84C]"> עורך דין נזיקין</Link>,
              <Link href="/lawyers?specialization=דיני עבודה" className="text-[#0B3C5D] underline hover:text-[#C9A84C]"> עורך דין עבודה</Link> או
              <Link href="/lawyers?specialization=מקרקעין" className="text-[#0B3C5D] underline hover:text-[#C9A84C]"> עורך דין מקרקעין</Link> -
              הפורטל שלנו מציג עורכי דין מאומתים עם דירוג לקוחות, חוות דעת ופרטי התקשרות ישירים.
            </p>
            <p>
              כל עורך דין בפורטל מציג את תחומי ההתמחות, שנות הניסיון, השכלה, ואזור הפעילות.
              ניתן לסנן לפי עיר - <Link href="/lawyers?city=תל אביב" className="text-[#0B3C5D] underline hover:text-[#C9A84C]">עורכי דין בתל אביב</Link>,
              <Link href="/lawyers?city=ירושלים" className="text-[#0B3C5D] underline hover:text-[#C9A84C]"> עורכי דין בירושלים</Link>,
              <Link href="/lawyers?city=חיפה" className="text-[#0B3C5D] underline hover:text-[#C9A84C]"> עורכי דין בחיפה</Link>,
              <Link href="/lawyers?city=באר שבע" className="text-[#0B3C5D] underline hover:text-[#C9A84C]"> עורכי דין בבאר שבע</Link> ועוד.
            </p>
            <p>
              משפטלי שונה מפורטלים אחרים - אצלנו תמצאו גם את <Link href="/search" className="text-[#0B3C5D] underline hover:text-[#C9A84C]">מאגר פסקי הדין</Link> המקיף ביותר בישראל,
              כך שתוכלו לבדוק את הרקע המשפטי של עורך הדין, לראות באילו תיקים הוא ייצג ומהם התוצאות.
              שילוב ייחודי של פורטל עורכי דין עם מאגר פסיקה - רק במשפטלי.
            </p>
          </div>

          <h3 className="text-lg font-bold text-[#0B3C5D] mt-8 mb-3">חיפוש עורך דין לפי תחום</h3>
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              'פלילי', 'דיני משפחה', 'נזיקין', 'דיני עבודה', 'מקרקעין',
              'הוצאה לפועל', 'ביטוח לאומי', 'תעבורה', 'מסחרי', 'חוזים',
              'צוואות וירושות', 'גירושין', 'חדלות פירעון', 'ביטוח', 'אזרחי',
              'מנהלי', 'נדל"ן', 'קניין רוחני', 'מיסוי', 'צרכנות',
            ].map((spec) => (
              <Link key={spec} href={`/lawyers?specialization=${encodeURIComponent(spec)}`}
                className="bg-gray-100 hover:bg-[#0B3C5D] hover:text-white text-gray-700 px-3 py-1.5 rounded-lg text-xs transition-colors">
                עורך דין {spec}
              </Link>
            ))}
          </div>

          <h3 className="text-lg font-bold text-[#0B3C5D] mt-6 mb-3">חיפוש עורך דין לפי עיר</h3>
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              'תל אביב', 'ירושלים', 'חיפה', 'באר שבע', 'נתניה', 'ראשון לציון',
              'פתח תקווה', 'הרצליה', 'רמת גן', 'אשדוד', 'כפר סבא', 'רחובות',
              'נצרת', 'עכו', 'קריית אתא', 'אשקלון', 'רמלה', 'לוד',
            ].map((city) => (
              <Link key={city} href={`/lawyers?city=${encodeURIComponent(city)}`}
                className="bg-gray-100 hover:bg-[#0B3C5D] hover:text-white text-gray-700 px-3 py-1.5 rounded-lg text-xs transition-colors">
                עורך דין {city}
              </Link>
            ))}
          </div>

          <h3 className="text-lg font-bold text-[#0B3C5D] mt-6 mb-3">קישורים שימושיים</h3>
          <div className="flex flex-wrap gap-2">
            {[
              { href: '/search', label: 'מאגר פסקי דין' },
              { href: '/search/bdikat-reka-mishpati', label: 'בדיקת רקע משפטי' },
              { href: '/search/hipus-tik-lefi-shem', label: 'חיפוש תיק לפי שם' },
              { href: '/lawyers/register', label: 'הרשמה לפורטל עורכי דין' },
              { href: '/search/hasarat-azkurim', label: 'הסרת אזכורים משפטיים' },
              { href: '/articles', label: 'מאמרים משפטיים' },
              { href: '/legal-help', label: 'ייעוץ משפטי חינם' },
              { href: '/rating/lawyers', label: 'דירוג עורכי דין' },
              { href: '/rating/judges', label: 'דירוג שופטים' },
            ].map((link) => (
              <Link key={link.href} href={link.href}
                className="bg-blue-50 hover:bg-[#0B3C5D] hover:text-white text-[#0B3C5D] px-3 py-1.5 rounded-lg text-xs transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
