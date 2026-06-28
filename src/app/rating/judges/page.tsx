import Link from 'next/link';
import type { Metadata } from 'next';
import { prisma } from '@/lib/db';
import { Scale, Search, FileText, TrendingUp } from 'lucide-react';

const SITE_URL = 'https://mishpatly.co.il';

export const metadata: Metadata = {
  title: 'דירוג שופטים בישראל | פסקי דין לפי שופט - משפטלי',
  description: 'דירוג שופטים בישראל לפי כמות פסקי דין, בית משפט ותחום. מצאו מידע על שופטים, צפו בפסקי הדין שלהם ובנתונים סטטיסטיים.',
  keywords: ['דירוג שופטים', 'שופטים ישראל', 'פסקי דין לפי שופט', 'שופט דירוג', 'בית משפט שופטים'],
  alternates: { canonical: `${SITE_URL}/rating/judges` },
};

const courts = [
  'בית המשפט העליון', 'בית המשפט המחוזי', 'בית משפט השלום',
  'בית הדין האזורי לעבודה', 'בית הדין הארצי לעבודה',
  'בית המשפט לענייני משפחה', 'בית המשפט לעניינים מנהליים',
  'בית משפט לתעבורה', 'בית הדין הרבני',
];

interface PageProps {
  searchParams: Promise<{ court?: string; q?: string; sort?: string }>;
}

export default async function JudgeRatingPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const { court, q, sort } = params;

  // Get all judges with their judgment counts
  const whereClause: Record<string, unknown> = {
    status: 'PUBLISHED',
    judge: { not: null },
  };
  if (court) whereClause.courtName = { contains: court };

  const judgeData = await prisma.judgment.groupBy({
    by: ['judge'],
    where: whereClause,
    _count: true,
    orderBy: { _count: { judge: 'desc' } },
  });

  // Filter by search query
  let judges = judgeData
    .filter(j => j.judge && j.judge.length > 1)
    .map(j => ({ name: j.judge!, count: j._count }));

  if (q) {
    judges = judges.filter(j => j.name.includes(q));
  }

  // Sort
  if (sort === 'name') {
    judges.sort((a, b) => a.name.localeCompare(b.name, 'he'));
  }

  // Get court info for each judge
  const judgeDetails = await Promise.all(
    judges.slice(0, 60).map(async (j) => {
      const sample = await prisma.judgment.findFirst({
        where: { judge: j.name, status: 'PUBLISHED' },
        select: { courtName: true, category: true },
        orderBy: { judgmentDate: 'desc' },
      });
      return { ...j, court: sample?.courtName || '', category: sample?.category || '' };
    })
  );

  const totalJudges = judgeData.filter(j => j.judge && j.judge.length > 1).length;

  return (
    <div dir="rtl" className="min-h-screen bg-[#FAFBFC]">
      {/* Hero */}
      <section className="bg-gradient-to-bl from-[#0B3C5D] via-[#072a42] to-[#0B3C5D] text-white py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-[#C9A84C] font-medium mb-2">דירוג שופטים</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-4">דירוג שופטי ישראל</h1>
          <p className="text-blue-100/80 max-w-3xl mx-auto leading-relaxed">
            צפו בנתונים סטטיסטיים על שופטי ישראל - כמות פסקי דין, בית משפט, ותחום התמחות.
            לחצו על שם השופט/ת לצפייה בכל פסקי הדין.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8 -mt-10 relative z-10">
          <form className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Court */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">בית משפט</label>
              <select name="court" defaultValue={court || ''} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#C9A84C] outline-none">
                <option value="">כל בתי המשפט</option>
                {courts.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Name search */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">שם שופט/ת</label>
              <input name="q" defaultValue={q || ''} placeholder="חיפוש לפי שם" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#C9A84C] outline-none" />
            </div>

            {/* Sort */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">מיון</label>
              <select name="sort" defaultValue={sort || ''} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#C9A84C] outline-none">
                <option value="">הכי פעילים</option>
                <option value="name">לפי שם (א-ת)</option>
              </select>
            </div>

            {/* Submit */}
            <div className="flex items-end">
              <button type="submit" className="w-full bg-[#C9A84C] hover:bg-[#D4B85E] text-[#072a42] font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2">
                <Search className="h-4 w-4" />
                חיפוש
              </button>
            </div>
          </form>

          <p className="text-sm text-gray-400 mt-3">{totalJudges} שופטים במאגר</p>
        </div>

        {/* Results */}
        {judgeDetails.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-8 text-center">
            <p className="text-gray-500">לא נמצאו שופטים בקריטריונים שבחרת</p>
            <Link href="/rating/judges" className="text-[#0B3C5D] hover:underline mt-2 inline-block">הצג את כולם</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {judgeDetails.map((judge, idx) => (
              <Link
                key={judge.name}
                href={`/person/${encodeURIComponent(judge.name)}`}
                className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 hover:shadow-lg transition-shadow block"
              >
                {/* Rank badge */}
                {idx < 3 && !q && !court && (
                  <div className="flex justify-end mb-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${idx === 0 ? 'bg-yellow-100 text-yellow-700' : idx === 1 ? 'bg-gray-100 text-gray-600' : 'bg-orange-50 text-orange-600'}`}>
                      #{idx + 1}
                    </span>
                  </div>
                )}

                {/* Judge info */}
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-14 h-14 rounded-full bg-[#0B3C5D]/10 flex items-center justify-center shrink-0">
                    <Scale className="h-7 w-7 text-[#0B3C5D]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0B3C5D] text-lg">{judge.name}</h3>
                    {judge.court && (
                      <p className="text-sm text-gray-500">{judge.court}</p>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-1.5 text-sm">
                    <FileText className="h-4 w-4 text-[#C9A84C]" />
                    <span className="font-semibold text-[#0B3C5D]">{judge.count}</span>
                    <span className="text-gray-400">פסקי דין</span>
                  </div>
                  {judge.category && (
                    <div className="flex items-center gap-1.5 text-sm">
                      <TrendingUp className="h-4 w-4 text-[#C9A84C]" />
                      <span className="text-gray-500">{judge.category}</span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* SEO content */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 mt-10">
          <h2 className="text-xl font-bold text-[#0B3C5D] mb-4">דירוג שופטים בישראל - משפטלי</h2>
          <div className="text-sm text-gray-600 leading-relaxed space-y-3">
            <p>
              מדריך דירוג השופטים של משפטלי מציג נתונים סטטיסטיים על שופטי ישראל מכל בתי המשפט.
              הדירוג מבוסס על כמות פסקי הדין שניתנו על ידי כל שופט/ת, כפי שמופיעים במאגר פסקי הדין.
            </p>
            <p>
              ניתן לסנן שופטים לפי בית משפט (עליון, מחוזי, שלום, עבודה, משפחה ועוד) ולפי שם.
              לחיצה על שם השופט/ת תוביל לעמוד מפורט עם כל פסקי הדין שניתנו.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
