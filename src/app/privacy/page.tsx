import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "מדיניות פרטיות | משפטלי",
  description: "מדיניות הפרטיות של אתר משפטלי - כיצד אנו אוספים, משתמשים ומגנים על המידע האישי שלך",
};

export default function PrivacyPage() {
  return (
    <div dir="rtl" className="min-h-screen bg-[#F4F6F8]">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-[#1D2731]/60">
            <li>
              <Link href="/" className="hover:text-[#328CC1] transition-colors">
                דף הבית
              </Link>
            </li>
            <li aria-hidden="true">&gt;</li>
            <li className="text-[#0B3C5D] font-medium">מדיניות פרטיות</li>
          </ol>
        </nav>

        {/* Page Content */}
        <article className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0B3C5D] mb-8 pb-4 border-b-2 border-[#328CC1]">
            מדיניות פרטיות
          </h1>

          <div className="space-y-8 text-[#1D2731] leading-8 text-base">
            {/* כללי */}
            <section>
              <h2 className="text-xl font-bold text-[#0B3C5D] mb-4">1. כללי</h2>
              <p>
                משפטלי (&quot;האתר&quot;, &quot;אנחנו&quot;, &quot;שלנו&quot;) מכבדת את פרטיותם של המשתמשים באתר.
                מדיניות פרטיות זו מתארת את האופן שבו אנו אוספים, משתמשים, מאחסנים ומגנים על מידע אישי
                של המשתמשים באתר, בהתאם להוראות חוק הגנת הפרטיות, התשמ&quot;א-1981, והתקנות שהותקנו מכוחו.
              </p>
              <p className="mt-3">
                השימוש באתר מהווה הסכמה למדיניות פרטיות זו. אם אינך מסכים/ה לתנאי מדיניות זו,
                אנא הימנע/י משימוש באתר. אנו ממליצים לקרוא מדיניות זו בעיון לפני השימוש בשירותינו.
              </p>
            </section>

            {/* המידע שאנו אוספים */}
            <section>
              <h2 className="text-xl font-bold text-[#0B3C5D] mb-4">2. המידע שאנו אוספים</h2>
              <p className="mb-4">אנו אוספים את סוגי המידע הבאים:</p>

              <div className="space-y-4">
                <div className="bg-[#F4F6F8] rounded-lg p-5 border-r-4 border-[#328CC1]">
                  <h3 className="font-bold text-[#0B3C5D] mb-2">מידע שנמסר על ידי המשתמש</h3>
                  <p className="text-sm">
                    שם מלא, כתובת דוא&quot;ל, מספר טלפון, ופרטים נוספים הנמסרים בעת מילוי טפסים באתר,
                    יצירת קשר עם צוות האתר, או הרשמה לשירותים. כמו כן, מידע הנמסר במסגרת
                    פניות בנושאים משפטיים, לרבות פרטי המקרה ותיאור הנסיבות.
                  </p>
                </div>

                <div className="bg-[#F4F6F8] rounded-lg p-5 border-r-4 border-[#328CC1]">
                  <h3 className="font-bold text-[#0B3C5D] mb-2">מידע הנאסף באופן אוטומטי</h3>
                  <p className="text-sm">
                    כתובת IP, סוג הדפדפן, מערכת ההפעלה, דפי הכניסה והיציאה, תאריך ושעת הביקור,
                    משך השהייה בדפים, מיקום גיאוגרפי משוער, מזהה מכשיר, ומידע אודות אופן
                    השימוש באתר. מידע זה נאסף באמצעות עוגיות וטכנולוגיות מעקב דומות.
                  </p>
                </div>

                <div className="bg-[#F4F6F8] rounded-lg p-5 border-r-4 border-[#328CC1]">
                  <h3 className="font-bold text-[#0B3C5D] mb-2">מידע מצדדים שלישיים</h3>
                  <p className="text-sm">
                    בנסיבות מסוימות, אנו עשויים לקבל מידע אודותיך ממקורות חיצוניים, כגון רשתות
                    חברתיות (במקרה של התחברות באמצעותן) או מספקי שירות אחרים הקשורים לפעילות האתר.
                  </p>
                </div>
              </div>
            </section>

            {/* כיצד אנו משתמשים במידע */}
            <section>
              <h2 className="text-xl font-bold text-[#0B3C5D] mb-4">3. כיצד אנו משתמשים במידע</h2>
              <p className="mb-4">המידע שנאסף משמש אותנו למטרות הבאות:</p>
              <ul className="space-y-2 list-none">
                {[
                  "אספקת השירותים המשפטיים המוצעים באתר ותפעולם השוטף",
                  "טיפול בפניות, שאלות ובקשות של משתמשים",
                  "שיפור ופיתוח האתר, השירותים והתכנים המוצעים בו",
                  "ניתוח סטטיסטי של דפוסי שימוש לצורך שיפור חוויית המשתמש",
                  "שליחת עדכונים, חדשות משפטיות והתראות רלוונטיות (בכפוף להסכמת המשתמש)",
                  "עמידה בדרישות החוק, לרבות צווי בית משפט ודרישות רגולטוריות",
                  "מניעת הונאות, שימוש לרעה ופעילות בלתי חוקית באתר",
                  "אכיפת תנאי השימוש של האתר",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="inline-block w-2 h-2 mt-3 rounded-full bg-[#328CC1] shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* שיתוף מידע עם צדדים שלישיים */}
            <section>
              <h2 className="text-xl font-bold text-[#0B3C5D] mb-4">4. שיתוף מידע עם צדדים שלישיים</h2>
              <p>
                אנו לא מוכרים, סוחרים או מעבירים את המידע האישי שלך לצדדים שלישיים, למעט במקרים הבאים:
              </p>
              <ul className="space-y-2 list-none mt-4">
                {[
                  "ספקי שירות הפועלים מטעמנו (כגון שירותי אחסון, ניתוח נתונים ותמיכה טכנית), הכפופים להתחייבויות סודיות",
                  "כאשר הדבר נדרש על פי דין, צו בית משפט, או דרישה מחייבת של רשות מוסמכת",
                  "לצורך הגנה על זכויותינו, רכושנו או ביטחוננו, או של משתמשים אחרים",
                  "במקרה של מיזוג, רכישה או מכירה של נכסי החברה, בכפוף להודעה מוקדמת למשתמשים",
                  "בהסכמתך המפורשת לשיתוף המידע",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="inline-block w-2 h-2 mt-3 rounded-full bg-[#328CC1] shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* אבטחת מידע */}
            <section>
              <h2 className="text-xl font-bold text-[#0B3C5D] mb-4">5. אבטחת מידע</h2>
              <p>
                אנו נוקטים באמצעי אבטחה טכנולוגיים וארגוניים מתקדמים כדי להגן על המידע האישי שלך
                מפני גישה בלתי מורשית, אובדן, שימוש לרעה או שינוי. אמצעים אלו כוללים, בין היתר:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {[
                  { title: "הצפנת SSL/TLS", desc: "כלל התקשורת באתר מוצפנת בפרוטוקול מאובטח" },
                  { title: "בקרת גישה", desc: "הרשאות גישה מוגבלות לעובדים המורשים בלבד" },
                  { title: "ניטור אבטחה", desc: "מעקב שוטף אחר פעילות חשודה ואיומי סייבר" },
                  { title: "גיבוי נתונים", desc: "גיבוי תקופתי של המידע למניעת אובדן" },
                ].map((item, index) => (
                  <div key={index} className="bg-[#F4F6F8] rounded-lg p-4">
                    <h3 className="font-bold text-[#0B3C5D] text-sm mb-1">{item.title}</h3>
                    <p className="text-sm text-[#1D2731]/70">{item.desc}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm text-[#1D2731]/70">
                חשוב לציין כי למרות מאמצינו, אין שיטת אבטחה שהיא חסינה לחלוטין. אנו פועלים כמיטב
                יכולתנו לצמצום הסיכונים, אך איננו יכולים להבטיח אבטחה מוחלטת של המידע.
              </p>
            </section>

            {/* עוגיות */}
            <section>
              <h2 className="text-xl font-bold text-[#0B3C5D] mb-4">6. עוגיות (Cookies)</h2>
              <p>
                האתר משתמש בעוגיות (קבצי טקסט קטנים הנשמרים במכשירך) לצורך תפעול תקין של האתר,
                שיפור חוויית המשתמש וניתוח דפוסי שימוש. סוגי העוגיות בהם אנו משתמשים:
              </p>
              <ul className="space-y-2 list-none mt-4">
                {[
                  "עוגיות הכרחיות - נדרשות לתפקוד בסיסי של האתר, כגון ניהול הפעלה ואבטחה",
                  "עוגיות ביצועים - אוספות מידע אנונימי על אופן השימוש באתר לצורך שיפורו",
                  "עוגיות פונקציונליות - מאפשרות לאתר לזכור העדפות המשתמש (כגון שפה וגודל גופן)",
                  "עוגיות שיווקיות - משמשות להצגת תוכן ופרסום רלוונטי (בכפוף להסכמה)",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="inline-block w-2 h-2 mt-3 rounded-full bg-[#328CC1] shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4">
                באפשרותך לנהל את העדפות העוגיות שלך דרך הגדרות הדפדפן. שים לב כי חסימת
                עוגיות מסוימות עלולה לפגוע בתפקוד האתר.
              </p>
            </section>

            {/* זכויות המשתמש */}
            <section>
              <h2 className="text-xl font-bold text-[#0B3C5D] mb-4">7. זכויות המשתמש</h2>
              <p className="mb-4">
                בהתאם לחוק הגנת הפרטיות, התשמ&quot;א-1981, עומדות לך הזכויות הבאות בנוגע למידע
                האישי שלך:
              </p>
              <div className="bg-[#F4F6F8] rounded-lg p-6 border-r-4 border-[#0B3C5D]">
                <ul className="space-y-3 list-none">
                  {[
                    "הזכות לעיין במידע האישי שנאסף אודותיך",
                    "הזכות לבקש תיקון מידע שגוי או לא מעודכן",
                    "הזכות לבקש מחיקת המידע האישי שלך (בכפוף למגבלות חוקיות)",
                    "הזכות להתנגד לעיבוד המידע שלך למטרות שיווקיות",
                    "הזכות לבטל הסכמה שניתנה לקבלת דיוור ישיר בכל עת",
                    "הזכות להגיש תלונה לרשות להגנת הפרטיות",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="inline-block w-2 h-2 mt-3 rounded-full bg-[#0B3C5D] shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="mt-4">
                לצורך מימוש זכויותיך, ניתן לפנות אלינו באמצעות פרטי הקשר המפורטים בסעיף
                &quot;יצירת קשר&quot; להלן.
              </p>
            </section>

            {/* שינויים במדיניות הפרטיות */}
            <section>
              <h2 className="text-xl font-bold text-[#0B3C5D] mb-4">8. שינויים במדיניות הפרטיות</h2>
              <p>
                אנו שומרים לעצמנו את הזכות לעדכן מדיניות פרטיות זו מעת לעת. שינויים מהותיים
                יפורסמו באתר ויכנסו לתוקף עם פרסומם, אלא אם צוין אחרת. אנו ממליצים לעיין
                במדיניות זו באופן תקופתי כדי להישאר מעודכנים. המשך השימוש באתר לאחר עדכון
                המדיניות מהווה הסכמה לשינויים שבוצעו.
              </p>
            </section>

            {/* יצירת קשר */}
            <section>
              <h2 className="text-xl font-bold text-[#0B3C5D] mb-4">9. יצירת קשר</h2>
              <p>
                לכל שאלה, בירור או בקשה בנוגע למדיניות פרטיות זו או לאופן הטיפול במידע האישי שלך,
                ניתן לפנות אלינו:
              </p>
              <div className="bg-[#F4F6F8] rounded-lg p-6 mt-4 border-r-4 border-[#0B3C5D]">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-[#0B3C5D] min-w-[100px]">דוא&quot;ל:</span>
                    <a href="mailto:privacy@mishpatly.co.il" className="text-[#328CC1] hover:underline">
                      privacy@mishpatly.co.il
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-[#0B3C5D] min-w-[100px]">טלפון:</span>
                    <a href="tel:+972-3-000-0000" className="text-[#328CC1] hover:underline" dir="ltr">
                      050-722-9966
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-[#0B3C5D] min-w-[100px]">כתובת:</span>
                    <span>דרך חיפה 19, קרית אתא</span>
                  </div>
                </div>
              </div>
            </section>

            {/* תאריך עדכון */}
            <section className="pt-6 border-t border-gray-200">
              <p className="text-sm text-[#1D2731]/60">
                <span className="font-bold">תאריך עדכון אחרון:</span> מאי 2026
              </p>
            </section>
          </div>
        </article>
      </div>
    </div>
  );
}
