import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "תנאי שימוש | משפטלי",
  description: "תנאי השימוש של אתר משפטלי - תנאים והגבלות לשימוש באתר ובשירותיו",
};

export default function TermsPage() {
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
            <li className="text-[#0B3C5D] font-medium">תנאי שימוש</li>
          </ol>
        </nav>

        {/* Page Content */}
        <article className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0B3C5D] mb-8 pb-4 border-b-2 border-[#328CC1]">
            תנאי שימוש
          </h1>

          <div className="space-y-8 text-[#1D2731] leading-8 text-base">
            {/* הגדרות */}
            <section>
              <h2 className="text-xl font-bold text-[#0B3C5D] mb-4">1. הגדרות</h2>
              <p className="mb-4">
                בתנאי שימוש אלה, למונחים הבאים תהיה המשמעות המפורטת לצידם:
              </p>
              <div className="bg-[#F4F6F8] rounded-lg p-6 space-y-3">
                {[
                  { term: "\"האתר\"", def: "אתר האינטרנט משפטלי (mishpatly.co.il), על כל דפיו, תכניו ושירותיו." },
                  { term: "\"החברה\"", def: "משפטלי בע\"מ, המפעילה את האתר." },
                  { term: "\"משתמש\"", def: "כל אדם הגולש באתר ו/או עושה שימוש בשירותיו, לרבות משתמש רשום ומשתמש מזדמן." },
                  { term: "\"תוכן\"", def: "כל מידע, טקסט, תמונה, גרפיקה, קובץ, קישור או כל חומר אחר המופיע באתר." },
                  { term: "\"שירותים\"", def: "כלל השירותים המוצעים באתר, לרבות חיפוש מידע משפטי, עיון בפסקי דין, מאמרים משפטיים וכל שירות נלווה." },
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="font-bold text-[#0B3C5D] shrink-0">{item.term}</span>
                    <span className="text-sm">– {item.def}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* תנאים כלליים */}
            <section>
              <h2 className="text-xl font-bold text-[#0B3C5D] mb-4">2. תנאים כלליים</h2>
              <p>
                ברוכים הבאים לאתר משפטלי. תנאי שימוש אלה (&quot;התנאים&quot;) מהווים הסכם מחייב בינך
                (&quot;המשתמש&quot;) לבין משפטלי (&quot;החברה&quot;). השימוש באתר ובשירותיו מותנה בהסכמתך
                לכל התנאים המפורטים להלן. אם אינך מסכים/ה לתנאים אלה, כולם או חלקם,
                הנך מתבקש/ת שלא לעשות שימוש באתר.
              </p>
              <p className="mt-3">
                החברה שומרת לעצמה את הזכות לשנות תנאים אלה בכל עת, לפי שיקול דעתה הבלעדי.
                שינויים יכנסו לתוקף עם פרסומם באתר. המשך שימושך באתר לאחר פרסום שינויים
                כאמור מהווה הסכמתך לתנאים המעודכנים.
              </p>
              <div className="bg-[#F4F6F8] rounded-lg p-5 mt-4 border-r-4 border-[#328CC1]">
                <p className="text-sm font-medium text-[#0B3C5D]">
                  שים לב: המידע באתר אינו מהווה ייעוץ משפטי ואינו מחליף התייעצות עם עורך דין מוסמך.
                  האתר מספק מידע כללי בלבד, ואין להסתמך עליו כתחליף לייעוץ משפטי פרטני.
                </p>
              </div>
            </section>

            {/* שימוש באתר */}
            <section>
              <h2 className="text-xl font-bold text-[#0B3C5D] mb-4">3. שימוש באתר</h2>
              <p className="mb-4">
                השימוש באתר מותר למטרות חוקיות בלבד. המשתמש מתחייב שלא לבצע את הפעולות הבאות:
              </p>
              <ul className="space-y-2 list-none">
                {[
                  "שימוש באתר באופן שעלול לפגוע בתפקודו התקין, לשבש את פעילותו או להגביל את השימוש של משתמשים אחרים",
                  "העתקה, שכפול, הפצה, פרסום או שידור של תכנים מהאתר ללא אישור מראש ובכתב מהחברה",
                  "שימוש בכלים אוטומטיים (בוטים, סקרייפרים, רובוטים) לאיסוף מידע מהאתר ללא אישור מפורש",
                  "העלאת תכנים המכילים וירוסים, תוכנות זדוניות או כל קוד מחשב שנועד לפגוע במערכות מחשב",
                  "התחזות לאדם אחר או מסירת מידע כוזב",
                  "שימוש באתר למטרות בלתי חוקיות או בניגוד לכל דין חל",
                  "ניסיון לגשת לאזורים מוגבלים באתר או לחדור למערכות המחשב של האתר",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="inline-block w-2 h-2 mt-3 rounded-full bg-[#328CC1] shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4">
                החברה רשאית להגביל או לחסום את גישת כל משתמש לאתר, על פי שיקול דעתה הבלעדי,
                ובפרט במקרה של הפרת תנאי שימוש אלה.
              </p>
            </section>

            {/* קניין רוחני */}
            <section>
              <h2 className="text-xl font-bold text-[#0B3C5D] mb-4">4. קניין רוחני</h2>
              <p>
                כל זכויות הקניין הרוחני באתר ובתכניו, לרבות אך לא רק, זכויות יוצרים, סימני מסחר,
                עיצובים, לוגואים, טקסטים, גרפיקה, תמונות, קוד מקור, מאגרי נתונים ותוכנות,
                הינן רכושה הבלעדי של החברה או של צדדים שלישיים שהעניקו לחברה רישיון שימוש בהם.
              </p>
              <p className="mt-3">
                אין להעתיק, לשכפל, להפיץ, למכור, לשווק, לתרגם, לעבד, ליצור יצירות נגזרות
                או לעשות כל שימוש מסחרי או שאינו מסחרי בתכני האתר, כולם או חלקם, ללא
                הסכמת החברה מראש ובכתב.
              </p>
              <p className="mt-3">
                שם האתר &quot;משפטלי&quot;, הלוגו וסימני המסחר הנלווים הם קניינה הבלעדי של החברה,
                ואין לעשות בהם שימוש ללא אישור.
              </p>
            </section>

            {/* הגבלת אחריות */}
            <section>
              <h2 className="text-xl font-bold text-[#0B3C5D] mb-4">5. הגבלת אחריות</h2>
              <div className="bg-[#F4F6F8] rounded-lg p-6 border-r-4 border-[#0B3C5D]">
                <p className="font-medium text-sm">
                  האתר והתכנים המופיעים בו מסופקים &quot;כמות שהם&quot; (AS IS) וללא כל מצג או התחייבות,
                  מפורשת או משתמעת. החברה אינה מתחייבת לדיוק, שלמות, עדכניות או מהימנות
                  של התכנים באתר.
                </p>
              </div>
              <p className="mt-4">
                החברה לא תישא באחריות לכל נזק, ישיר או עקיף, שייגרם למשתמש או לצד שלישי
                כתוצאה מהשימוש באתר או מההסתמכות על תכניו, לרבות אך לא רק:
              </p>
              <ul className="space-y-2 list-none mt-3">
                {[
                  "נזקים הנובעים מהסתמכות על מידע משפטי המופיע באתר ללא קבלת ייעוץ משפטי מקצועי",
                  "הפסדים כספיים, אובדן רווחים או אובדן הזדמנויות עסקיות",
                  "נזקים הנובעים מתקלות טכניות, הפסקות שירות או חדירה למערכות האתר",
                  "נזקים הנובעים מתכנים של צדדים שלישיים או מקישורים לאתרים חיצוניים",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="inline-block w-2 h-2 mt-3 rounded-full bg-[#328CC1] shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* הסרת אזכורים */}
            <section>
              <h2 className="text-xl font-bold text-[#0B3C5D] mb-4">6. הסרת אזכורים</h2>
              <p>
                משתמש המעוניין בהסרת אזכור שלו מהאתר רשאי להגיש בקשה מנומקת לחברה.
                הבקשה תיבחן בהתאם להוראות הדין, לרבות עקרון חופש המידע והאינטרס הציבורי
                בפרסום מידע משפטי.
              </p>
              <p className="mt-3">
                החברה תשתדל לטפל בכל בקשה תוך 30 ימי עסקים. יובהר כי החברה אינה מחויבת
                לאשר כל בקשת הסרה, והחלטתה תתקבל בהתחשב בנסיבות כל מקרה לגופו,
                בהתאם לאיזון בין זכות הפרטיות לבין זכות הציבור לדעת ועקרון פומביות הדיון.
              </p>
              <p className="mt-3">
                להגשת בקשת הסרה, ניתן לפנות אלינו דרך{" "}
                <Link href="/removal-request" className="text-[#328CC1] hover:underline font-medium">
                  טופס בקשת הסרה
                </Link>{" "}
                או באמצעות פרטי הקשר המפורטים בסעיף 9 להלן.
              </p>
            </section>

            {/* שינויים בתנאי השימוש */}
            <section>
              <h2 className="text-xl font-bold text-[#0B3C5D] mb-4">7. שינויים בתנאי השימוש</h2>
              <p>
                החברה רשאית לשנות, לעדכן או לתקן תנאי שימוש אלה בכל עת, על פי שיקול דעתה
                הבלעדי וללא הודעה מוקדמת. הנוסח המחייב של תנאי השימוש הוא הנוסח המפורסם
                באתר במועד השימוש בו. על המשתמש חלה האחריות לעיין בתנאי השימוש מעת לעת.
              </p>
              <p className="mt-3">
                במקרה של שינוי מהותי בתנאי השימוש, תפורסם הודעה בולטת באתר. המשך השימוש
                באתר לאחר ביצוע שינויים כאמור מהווה את הסכמת המשתמש לתנאים המעודכנים.
              </p>
            </section>

            {/* דין חל וסמכות שיפוט */}
            <section>
              <h2 className="text-xl font-bold text-[#0B3C5D] mb-4">8. דין חל וסמכות שיפוט</h2>
              <p>
                על תנאי שימוש אלה, על השימוש באתר ועל כל סכסוך או מחלוקת הנובעים מהם
                או הקשורים אליהם, יחולו אך ורק דיני מדינת ישראל, ללא התייחסות לכללי ברירת הדין.
              </p>
              <p className="mt-3">
                סמכות השיפוט הבלעדית לדון בכל מחלוקת הנוגעת לתנאי שימוש אלה או לשימוש באתר
                תהיה נתונה לבתי המשפט המוסמכים במחוז תל אביב-יפו בלבד.
              </p>
              <div className="bg-[#F4F6F8] rounded-lg p-5 mt-4 border-r-4 border-[#328CC1]">
                <p className="text-sm">
                  במקרה שייקבע כי הוראה כלשהי מתנאי שימוש אלה אינה תקפה או אינה ניתנת לאכיפה,
                  לא יהיה בכך כדי לפגוע בתוקפן של יתר ההוראות, אשר ימשיכו לעמוד בתוקפן המלא.
                </p>
              </div>
            </section>

            {/* יצירת קשר */}
            <section>
              <h2 className="text-xl font-bold text-[#0B3C5D] mb-4">9. יצירת קשר</h2>
              <p>
                לכל שאלה, הבהרה או בירור בנוגע לתנאי שימוש אלה, ניתן לפנות אלינו:
              </p>
              <div className="bg-[#F4F6F8] rounded-lg p-6 mt-4 border-r-4 border-[#0B3C5D]">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-[#0B3C5D] min-w-[100px]">דוא&quot;ל:</span>
                    <a href="mailto:info@mishpatly.co.il" className="text-[#328CC1] hover:underline">
                      info@mishpatly.co.il
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
