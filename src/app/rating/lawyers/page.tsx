import Link from 'next/link';
import type { Metadata } from 'next';
import { prisma } from '@/lib/db';
import { Star, Search, MapPin, Briefcase, Award } from 'lucide-react';

const SITE_URL = 'https://mishpatly.co.il';

export const metadata: Metadata = {
  title: 'דירוג עורכי דין בישראל | מדריך עורכי דין מומלצים - משפטלי',
  description: 'דירוג עורכי דין בישראל - מערכת דירוג ביקורות ומשובים. מצאו עורך דין מומלץ לפי תחום עיסוק, עיר ומחוז. דירוגים אמינים מלקוחות אמיתיים.',
  keywords: ['דירוג עורכי דין', 'עורכי דין מומלצים', 'עורך דין דירוג', 'ביקורות עורכי דין', 'מדריך עורכי דין ישראל'],
  alternates: { canonical: `${SITE_URL}/rating/lawyers` },
};

const specializations = [
  'משפט פלילי', 'דיני משפחה', 'דיני עבודה', 'משפט אזרחי', 'מקרקעין ונדל"ן',
  'נזיקין ותאונות', 'דיני חוזים', 'משפט מסחרי', 'דיני ביטוח', 'מיסוי',
  'חדלות פירעון', 'דיני תעבורה', 'קניין רוחני', 'הגירה ואזרחות', 'גישור ובוררות',
  'דיני צרכנות', 'דיני ספורט', 'דיני היי טק', 'דיני ירושה וצוואות', 'משפט מנהלי',
  'דיני בנקאות', 'דיני חברות', 'רשלנות רפואית', 'דיני תכנון ובנייה', 'משפט צבאי',
  'דיני אינטרנט וסייבר', 'דיני הגנת הפרטיות', 'דיני זכויות אדם', 'דיני חינוך',
  'דיני הגנת הסביבה', 'דיני שוק ההון', 'דיני רשויות מקומיות', 'דיני מכרזים',
  'ליטיגציה', 'נוטריון', 'ראיית חשבון', 'פישור', 'בוררות מסחרית',
  'דיני הוצאה לפועל', 'דיני פטנטים', 'דיני סימני מסחר', 'דיני זכויות יוצרים',
  'משפט בינלאומי', 'דיני הגבלים עסקיים', 'דיני רגולציה', 'דיני ניירות ערך',
];

const districts = ['תל אביב', 'ירושלים', 'חיפה', 'מרכז', 'דרום', 'צפון', 'ללא מחוז'];

const cities = [
  'אבו גוש', 'אבטלין', 'אביאל', 'אביגדור', 'אביחיל', 'אביעזר', 'אבירים',
  'אבן יהודה', 'אבן מנחם', 'אבן ספיר', 'אבן שמואל', 'אופקים', 'אור יהודה',
  'אור עקיבא', 'אזור', 'אילת', 'אלעד', 'אריאל', 'אשדוד', 'אשקלון',
  'באר יעקב', 'באר שבע', 'בית שאן', 'בית שמש', 'בני ברק', 'בנימינה',
  'בת ים', 'גבעת זאב', 'גבעת שמואל', 'גבעתיים', 'גדרה', 'גני תקווה',
  'דימונה', 'הוד השרון', 'הרצליה', 'זכרון יעקב', 'חדרה', 'חולון', 'חיפה',
  'טבריה', 'טירת כרמל', 'יבנה', 'יהוד', 'יוקנעם', 'ירוחם', 'ירושלים',
  'כפר יונה', 'כפר סבא', 'כפר קאסם', 'כרמיאל', 'לוד', 'לקיה',
  'מבשרת ציון', 'מגדל העמק', 'מודיעין', 'מודיעין עילית', 'מעלה אדומים',
  'מעלות תרשיחא', 'מצפה רמון', 'נהריה', 'נוף הגליל', 'נס ציונה', 'נצרת',
  'נתיבות', 'נתניה', 'עכו', 'עפולה', 'עראבה', 'ערד', 'פתח תקווה',
  'צפת', 'קדימה צורן', 'קלנסווה', 'קריית אונו', 'קריית אתא', 'קריית ביאליק',
  'קריית גת', 'קריית מוצקין', 'קריית מלאכי', 'קריית שמונה', 'קריית ים',
  'ראש העין', 'ראשון לציון', 'רהט', 'רחובות', 'רמלה', 'רמת גן', 'רמת השרון',
  'רעננה', 'שדרות', 'שוהם', 'תל אביב', 'תל מונד',
];

interface PageProps {
  searchParams: Promise<{ spec?: string; city?: string; district?: string; q?: string }>;
}

export default async function LawyerRatingPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const { spec, city, district, q } = params;

  // Fetch lawyers with filters
  const where: Record<string, unknown> = { isActive: true };
  if (spec) where.specializations = { has: spec };
  if (city) where.city = city;
  if (district) where.courtDistrict = district;
  if (q) {
    where.OR = [
      { fullName: { contains: q } },
      { city: { contains: q } },
    ];
  }

  const lawyers = await prisma.lawyer.findMany({
    where,
    orderBy: [{ rating: 'desc' }, { reviewCount: 'desc' }],
    take: 50,
    include: { reviews: { where: { isApproved: true }, take: 1 } },
  });

  const totalLawyers = await prisma.lawyer.count({ where: { isActive: true } });

  return (
    <div dir="rtl" className="min-h-screen bg-[#FAFBFC]">
      {/* Hero */}
      <section className="bg-gradient-to-bl from-[#0B3C5D] via-[#072a42] to-[#0B3C5D] text-white py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-[#C9A84C] font-medium mb-2">דירוג עורכי דין</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-4">דירוג עורכי הדין בישראל</h1>
          <p className="text-blue-100/80 max-w-3xl mx-auto leading-relaxed">
            מערכת דירוג וביקורות עורכי דין המבוססת על חוויות לקוחות ומתדיינים.
            מצאו עורך דין מומלץ לפי תחום עיסוק, עיר ומחוז.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Search & Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8 -mt-10 relative z-10">
          <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Specialization */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">תחום עיסוק</label>
              <select name="spec" defaultValue={spec || ''} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#C9A84C] outline-none">
                <option value="">כל התחומים</option>
                {specializations.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* District */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">מחוז</label>
              <select name="district" defaultValue={district || ''} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#C9A84C] outline-none">
                <option value="">כל המחוזות</option>
                {districts.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            {/* City */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">עיר</label>
              <select name="city" defaultValue={city || ''} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#C9A84C] outline-none">
                <option value="">כל הערים</option>
                {cities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Name search */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">שם עורך/ת הדין</label>
              <input name="q" defaultValue={q || ''} placeholder="חיפוש לפי שם" className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#C9A84C] outline-none" />
            </div>

            {/* Submit */}
            <div className="flex items-end">
              <button type="submit" className="w-full bg-[#C9A84C] hover:bg-[#D4B85E] text-[#072a42] font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2">
                <Search className="h-4 w-4" />
                חיפוש
              </button>
            </div>
          </form>

          <p className="text-sm text-gray-400 mt-3">{totalLawyers.toLocaleString()} עורכי דין רשומים</p>
        </div>

        {/* Results */}
        {lawyers.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-8 text-center">
            <p className="text-gray-500">לא נמצאו עורכי דין בקריטריונים שבחרת</p>
            <Link href="/rating/lawyers" className="text-[#0B3C5D] hover:underline mt-2 inline-block">הצג את כולם</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {lawyers.map((lawyer, idx) => (
              <Link
                key={lawyer.id}
                href={`/lawyers/${lawyer.slug}`}
                className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 hover:shadow-lg transition-shadow block"
              >
                {/* Rank badge */}
                {idx < 3 && (
                  <div className="flex justify-end mb-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${idx === 0 ? 'bg-yellow-100 text-yellow-700' : idx === 1 ? 'bg-gray-100 text-gray-600' : 'bg-orange-50 text-orange-600'}`}>
                      #{idx + 1}
                    </span>
                  </div>
                )}

                {/* Avatar */}
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-14 h-14 rounded-full bg-[#0B3C5D]/10 flex items-center justify-center shrink-0 text-xl font-bold text-[#0B3C5D]">
                    {lawyer.fullName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0B3C5D] text-lg">עו&quot;ד {lawyer.fullName}</h3>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <MapPin className="h-3 w-3" />
                      {lawyer.city}
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} className={`h-4 w-4 ${s <= Math.round(lawyer.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-gray-700">{lawyer.rating.toFixed(1)}</span>
                  <span className="text-xs text-gray-400">({lawyer.reviewCount} ביקורות)</span>
                </div>

                {/* Specializations */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {lawyer.specializations.slice(0, 3).map(s => (
                    <span key={s} className="bg-blue-50 text-[#0B3C5D] text-xs px-2 py-0.5 rounded-full">{s}</span>
                  ))}
                </div>

                {/* Experience */}
                {lawyer.yearsExperience > 0 && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Award className="h-3 w-3" />
                    <span>{lawyer.yearsExperience} שנות ניסיון</span>
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}

        {/* SEO content */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 mt-10">
          <h2 className="text-xl font-bold text-[#0B3C5D] mb-4">דירוג עורכי דין בישראל - משפטלי</h2>
          <div className="text-sm text-gray-600 leading-relaxed space-y-3">
            <p>
              מדריך דירוג עורכי הדין של משפטלי מאפשר למתדיינים ולקוחות למצוא עורך דין מומלץ בכל תחום משפטי.
              הדירוג מבוסס על ביקורות ומשובים אמיתיים מלקוחות, ומתעדכן באופן שוטף.
            </p>
            <p>
              ניתן לסנן עורכי דין לפי תחום עיסוק (משפט פלילי, דיני משפחה, דיני עבודה, מקרקעין ועוד),
              לפי עיר מגורים ולפי מחוז. כל עורך דין מוצג עם דירוג כוכבים, מספר ביקורות ותחומי התמחות.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
