import Link from 'next/link';
import type { Metadata } from 'next';
import { Scale, Shield, Search, Users, Globe, Clock, Award, BookOpen, Mail, Mic, Languages, Eye, FileText, Briefcase } from 'lucide-react';
import { prisma } from '@/lib/db';

const SITE_URL = 'https://mishpatly.co.il';

export const metadata: Metadata = {
  title: 'אודות משפטלי | המאגר המשפטי המוביל בישראל - פסקי דין, חקיקה ופסיקה',
  description:
    'משפטלי - המאגר המשפטי המוביל בישראל. מאגר פסקי דין והחלטות מכל בתי המשפט, פורטל אנשי מקצוע משפטיים, עדכוני חקיקה ופסיקה. הצטרפו למאגר המשפטי המתקדם ביותר.',
  keywords: ['משפטלי', 'אודות', 'מאגר פסקי דין', 'פורטל משפטי', 'אנשי מקצוע משפטיים', 'עורכי דין', 'מומחים משפטיים', 'חקיקה', 'פסיקה'],
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: {
    title: 'אודות משפטלי | המאגר המשפטי המוביל בישראל',
    description: 'הכירו את משפטלי - מאגר פסקי דין, פורטל אנשי מקצוע, ועדכוני חקיקה ופסיקה.',
    type: 'website',
    locale: 'he_IL',
    url: `${SITE_URL}/about`,
  },
};

const services = [
  { icon: FileText, title: 'מאגר פסקי דין', desc: 'גישה למאות אלפי פסקי דין והחלטות מכל בתי המשפט בישראל, כולל בית המשפט העליון, מחוזי, שלום ובתי דין מיוחדים.', href: '/search' },
  { icon: Search, title: 'חיפוש מתקדם', desc: 'מנוע חיפוש חכם המאפשר חיפוש לפי שם, מספר תיק, שופט, בית משפט, קטגוריה ועוד.', href: '/search?advanced=true' },
  { icon: Shield, title: 'הסרת אזכורים', desc: 'שירות מקצועי להסרת אזכורים משפטיים ממנועי חיפוש. הגנה על הפרטיות שלכם.', href: '/removal' },
  { icon: Users, title: 'פורטל אנשי מקצוע', desc: 'מדריך מקיף של עורכי דין, מומחים, עדים, מתרגמים ואנשי מקצוע בתחום המשפט.', href: '/lawyers' },
  { icon: BookOpen, title: 'מאמרים משפטיים', desc: 'מאמרים מקצועיים, ניתוחי פסיקה ועדכוני חקיקה הנכתבים על ידי מומחים בתחום.', href: '/articles' },
  { icon: Mail, title: 'עדכוני פסיקה', desc: 'הרשמו לניוזלטר וקבלו עדכונים יומיים על פסקי דין חדשים, חקיקה ושינויי פסיקה.', href: '/articles' },
];

const professionals = [
  { icon: Briefcase, title: 'עורכי דין', desc: 'פרסמו את המשרד שלכם במדריך עורכי הדין המקיף ביותר. הגיעו ללקוחות חדשים.' },
  { icon: Eye, title: 'עדים מומחים', desc: 'רישום עדים מומחים בתחומים שונים - רפואה, הנדסה, חשבונאות, פסיכולוגיה ועוד.' },
  { icon: Languages, title: 'שירותי תרגום', desc: 'מתרגמים משפטיים מוסמכים לכל השפות. תרגום מסמכים משפטיים, חוות דעת ופסקי דין.' },
  { icon: Mic, title: 'גישור ובוררות', desc: 'מגשרים ובוררים מוסמכים. פתרון סכסוכים מחוץ לכותלי בית המשפט.' },
  { icon: Scale, title: 'יועצים משפטיים', desc: 'יועצים משפטיים לחברות, ארגונים ומוסדות. ייעוץ בתחומי רגולציה, ציות ומשפט מסחרי.' },
  { icon: FileText, title: 'שמאים ומעריכים', desc: 'שמאי מקרקעין, מעריכי שווי, אקטוארים ומומחים פיננסיים לצורכי הליכים משפטיים.' },
];

export default async function AboutPage() {
  let totalJudgments = 0;
  try { totalJudgments = await prisma.judgment.count(); } catch { /* */ }

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "name": "אודות משפטלי",
        "description": "מידע על משפטלי - המאגר המשפטי המוביל בישראל",
        "url": `${SITE_URL}/about`,
        "mainEntity": { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        "name": "משפטלי",
        "url": SITE_URL,
        "description": "המאגר המשפטי המוביל בישראל - פסקי דין, חקיקה ופסיקה",
        "logo": `${SITE_URL}/logo.png`,
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "דף הבית", "item": SITE_URL },
          { "@type": "ListItem", "position": 2, "name": "אודות", "item": `${SITE_URL}/about` },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div dir="rtl" className="min-h-screen bg-[#FAFBFC] text-[#1a1a2e]">
        {/* Breadcrumbs */}
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3">
            <ol className="flex items-center gap-2 text-sm text-gray-500">
              <li><Link href="/" className="hover:text-[#C9A84C]">דף הבית</Link></li>
              <li>&gt;</li>
              <li className="text-[#0B3C5D] font-medium">אודות</li>
            </ol>
          </div>
        </nav>

        {/* Hero */}
        <section className="bg-gradient-to-bl from-[#0B3C5D] via-[#072a42] to-[#0B3C5D] text-white py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-4">
              אודות <span className="text-[#C9A84C]">משפטלי</span>
            </h1>
            <p className="text-blue-100/80 text-lg max-w-3xl mx-auto leading-relaxed">
              המאגר המשפטי המוביל בישראל - פסקי דין והחלטות מכל בתי המשפט,
              פורטל אנשי מקצוע, ועדכוני חקיקה ופסיקה
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="relative -mt-10 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { value: totalJudgments > 0 ? totalJudgments.toLocaleString() : '1,000+', label: 'פסקי דין במאגר', icon: BookOpen },
              { value: '24/7', label: 'גישה חופשית', icon: Clock },
              { value: '250+', label: 'בתי משפט', icon: Scale },
              { value: 'AI', label: 'ניתוח חכם', icon: Globe },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl p-5 text-center shadow-lg border border-gray-100">
                <stat.icon className="h-8 w-8 text-[#C9A84C] mx-auto mb-2" strokeWidth={1.5} />
                <span className="block text-2xl font-extrabold text-[#0B3C5D]">{stat.value}</span>
                <span className="text-sm text-gray-500">{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Our Story */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 sm:p-12">
            <h2 className="text-2xl font-extrabold text-[#0B3C5D] mb-6">הסיפור שלנו</h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                משפטלי נוסד מתוך הבנה שמידע משפטי ציבורי צריך להיות נגיש לכל אזרח בישראל.
                בעוד שפסקי דין הם מידע ציבורי על פי חוק, הגישה אליהם הייתה מורכבת ויקרה.
                משפטלי שינה את זה.
              </p>
              <p>
                הפלטפורמה שלנו מאגדת פסקי דין מהרשות השופטת (decisions.court.gov.il)
                ומנגישה אותם באמצעות מנוע חיפוש מתקדם המאפשר חיפוש לפי שם, מספר תיק, שופט, בית משפט ועוד.
              </p>
              <p>
                המאגר מתעדכן באופן יומי אוטומטי ומכיל פסקי דין מכל סוגי ההליכים המשפטיים -
                פלילי, אזרחי, עבודה, משפחה, מנהלי, נזיקין, ביטוח, מקרקעין ועוד.
              </p>
            </div>
          </div>
        </section>

        {/* What We Offer */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
          <h2 className="text-2xl font-extrabold text-[#0B3C5D] mb-2 text-center">מה משפטלי מציע</h2>
          <p className="text-gray-500 text-center mb-8">כל מה שצריך בעולם המשפט - במקום אחד</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((s) => (
              <Link href={s.href} key={s.title} className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow cursor-pointer group">
                <div className="w-12 h-12 rounded-xl bg-[#0B3C5D]/10 flex items-center justify-center mb-4">
                  <s.icon className="h-6 w-6 text-[#C9A84C]" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-bold text-[#0B3C5D] mb-2 group-hover:text-[#C9A84C] transition-colors">{s.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{s.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Newsletter */}
        <section className="bg-gradient-to-l from-[#0B3C5D] to-[#1a5276] text-white py-14">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <Mail className="h-12 w-12 text-[#C9A84C] mx-auto mb-4" strokeWidth={1.5} />
            <h2 className="text-2xl font-extrabold mb-3">הרשמו לעדכוני חדשות, פסיקה וחקיקה</h2>
            <p className="text-blue-200 mb-6">
              קבלו עדכונים יומיים על פסקי דין חדשים, שינויי חקיקה ופסיקה ישירות לתיבת המייל שלכם
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto" action="/api/newsletter" method="POST">
              <input
                type="email"
                name="email"
                placeholder="הזינו כתובת דוא&quot;ל"
                required
                className="flex-1 px-4 py-3 rounded-lg text-gray-800 outline-none focus:ring-2 focus:ring-[#C9A84C]"
                dir="ltr"
              />
              <button
                type="submit"
                className="bg-[#C9A84C] hover:bg-[#D4B85E] text-[#072a42] font-bold px-8 py-3 rounded-lg transition-colors whitespace-nowrap"
              >
                הרשם עכשיו
              </button>
            </form>
            <p className="text-xs text-blue-300 mt-3">
              אני מאשר/ת קבלת עדכונים משפטיים שוטפים. ניתן לבטל בכל עת.
            </p>
          </div>
        </section>

        {/* Professional Directory */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
          <h2 className="text-2xl font-extrabold text-[#0B3C5D] mb-2 text-center">מדריך אנשי מקצוע</h2>
          <p className="text-gray-500 text-center mb-8 max-w-2xl mx-auto">
            משפטלי מציע פורטל מקיף לכל אנשי המקצוע בתחום המשפט.
            פרסמו את השירותים שלכם והגיעו לקהל יעד ממוקד.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {professionals.map((p) => (
              <div key={p.title} className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-[#C9A84C]/10 flex items-center justify-center mb-4">
                  <p.icon className="h-6 w-6 text-[#0B3C5D]" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-bold text-[#0B3C5D] mb-2">{p.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/lawyers/register"
              className="inline-block bg-gradient-to-l from-[#C9A84C] to-[#D4B85E] text-[#072a42] font-bold px-8 py-3.5 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-lg"
            >
              הצטרפו למדריך אנשי המקצוע
            </Link>
          </div>
        </section>

        {/* Values */}
        <section className="bg-white border-t border-gray-200 py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-extrabold text-[#0B3C5D] mb-8 text-center">הערכים שלנו</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { icon: Search, title: 'נגישות למידע משפטי', description: 'אנו מאמינים שכל אזרח זכאי לגישה חופשית ונוחה למידע משפטי ציבורי. משפטלי מנגיש אלפי פסקי דין לכל אחד.' },
                { icon: Shield, title: 'הגנה על פרטיות', description: 'אנו מכבדים את הזכות להישכח ומטפלים בבקשות הסרת אזכורים בצורה מקצועית ורגישה.' },
                { icon: Award, title: 'דיוק ואמינות', description: 'המאגר מתעדכן באופן יומי מהרשות השופטת. כל פסק דין עובר חילוץ ואימות נתונים באמצעות AI.' },
                { icon: Users, title: 'שירות מקצועי', description: 'צוות משפטלי כולל מומחים בטכנולוגיה משפטית (Legal Tech) עם ניסיון רב בתחום.' },
              ].map((v) => (
                <div key={v.title} className="bg-[#FAFBFC] rounded-2xl border border-gray-100 p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#0B3C5D]/10 flex items-center justify-center shrink-0">
                      <v.icon className="h-6 w-6 text-[#C9A84C]" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#0B3C5D] mb-2">{v.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{v.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16 text-center">
          <h2 className="text-2xl font-extrabold text-[#0B3C5D] mb-4">מוכנים להתחיל?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            חיפוש פסקי דין, פרסום שירותים מקצועיים, והעלאת מסמכים - הכל במקום אחד.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/search" className="px-8 py-3 bg-gradient-to-l from-[#0B3C5D] to-[#1E5B8C] text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
              חיפוש פסקי דין
            </Link>
            <Link href="/my-judgments" className="px-8 py-3 bg-gradient-to-l from-[#C9A84C] to-[#D4B85E] text-[#072a42] font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
              העלאת פסק דין
            </Link>
            <Link href="/lawyers/register" className="px-8 py-3 bg-white border-2 border-[#0B3C5D] text-[#0B3C5D] font-bold rounded-xl hover:bg-[#0B3C5D] hover:text-white transition-all">
              הצטרפות כאיש מקצוע
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
