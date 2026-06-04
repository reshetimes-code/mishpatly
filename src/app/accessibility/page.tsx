import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "הצהרת נגישות | משפטלי",
  description: "הצהרת הנגישות של אתר משפטלי - מחויבותנו להנגשת האתר לכלל האוכלוסייה",
};

export default function AccessibilityPage() {
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
            <li className="text-[#0B3C5D] font-medium">הצהרת נגישות</li>
          </ol>
        </nav>

        {/* Page Content */}
        <article className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0B3C5D] mb-8 pb-4 border-b-2 border-[#328CC1]">
            הצהרת נגישות
          </h1>

          <div className="space-y-8 text-[#1D2731] leading-8 text-base">
            {/* מחויבות לנגישות */}
            <section>
              <h2 className="text-xl font-bold text-[#0B3C5D] mb-4">מחויבות לנגישות</h2>
              <p>
                אתר משפטלי מחויב להנגשת השירותים הדיגיטליים שלו לכלל האוכלוסייה, לרבות אנשים עם מוגבלויות.
                אנו פועלים באופן שוטף לשיפור חוויית הגלישה באתר ולהתאמתו לצרכים של כלל המשתמשים,
                בהתאם לחוק שוויון זכויות לאנשים עם מוגבלות, התשנ&quot;ח-1998, ותקנות שוויון זכויות לאנשים
                עם מוגבלות (התאמות נגישות לשירות), התשע&quot;ג-2013.
              </p>
              <p className="mt-3">
                אנו מאמינים כי לכל אדם הזכות לגישה שוויונית למידע משפטי, ולפיכך אנו משקיעים משאבים
                ניכרים בהנגשת האתר ותכניו.
              </p>
            </section>

            {/* תקני נגישות */}
            <section>
              <h2 className="text-xl font-bold text-[#0B3C5D] mb-4">תקני נגישות</h2>
              <p>
                האתר עומד בדרישות תקן הנגישות הבינלאומי WCAG 2.1 ברמה AA (Web Content Accessibility
                Guidelines), כפי שנקבע בתקן הישראלי ת&quot;י 5568. תקן זה מגדיר כיצד להנגיש תכני אינטרנט
                לאנשים עם מגוון מוגבלויות, כולל מוגבלויות ראייה, שמיעה, מוטוריקה וקוגניציה.
              </p>
              <div className="bg-[#F4F6F8] rounded-lg p-5 mt-4 border-r-4 border-[#328CC1]">
                <p className="text-sm font-medium text-[#0B3C5D]">
                  התאימות לתקן נבדקת באופן תקופתי על ידי מומחי נגישות מוסמכים, ואנו פועלים לתיקון כל
                  ליקוי שמתגלה בהקדם האפשרי.
                </p>
              </div>
            </section>

            {/* אמצעי נגישות שננקטו */}
            <section>
              <h2 className="text-xl font-bold text-[#0B3C5D] mb-4">אמצעי נגישות שננקטו</h2>
              <p className="mb-4">
                להלן פירוט אמצעי הנגישות העיקריים שיושמו באתר:
              </p>
              <ul className="space-y-3 list-none">
                {[
                  "התאמה מלאה לגלישה באמצעות מקלדת בלבד, כולל ניווט בתפריטים, טפסים ואלמנטים אינטראקטיביים",
                  "תמיכה מלאה בתוכנות קריאת מסך (Screen Readers) כגון NVDA, JAWS ו-VoiceOver",
                  "מבנה כותרות היררכי ותקני (H1-H6) המאפשר ניווט יעיל בתוכן הדף",
                  "טקסט חלופי (alt text) לכלל התמונות והאלמנטים הגרפיים באתר",
                  "ניגודיות צבעים מספקת בין טקסט לרקע בהתאם לדרישות התקן",
                  "אפשרות להגדלת טקסט עד 200% ללא אובדן תוכן או פונקציונליות",
                  "סימון שדות חובה בטפסים והצגת הודעות שגיאה ברורות ונגישות",
                  "דילוג לתוכן ראשי (Skip to Content) בתחילת כל דף",
                  "שימוש בתגיות ARIA להעשרת המידע עבור טכנולוגיות מסייעות",
                  "עיצוב רספונסיבי המותאם לגדלי מסך שונים ולמכשירים ניידים",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="inline-block w-2 h-2 mt-3 rounded-full bg-[#328CC1] shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* טכנולוגיות נגישות נתמכות */}
            <section>
              <h2 className="text-xl font-bold text-[#0B3C5D] mb-4">טכנולוגיות נגישות נתמכות</h2>
              <p>
                האתר תוכנן ונבנה לתמיכה מיטבית בטכנולוגיות המסייעות הנפוצות, ביניהן:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {[
                  { title: "קוראי מסך", desc: "NVDA, JAWS, VoiceOver, TalkBack" },
                  { title: "דפדפנים נתמכים", desc: "Chrome, Firefox, Safari, Edge (גרסאות עדכניות)" },
                  { title: "מערכות הפעלה", desc: "Windows, macOS, iOS, Android" },
                  { title: "כלי הגדלה", desc: "ZoomText, מגדיל מסך מובנה במערכת ההפעלה" },
                ].map((tech, index) => (
                  <div key={index} className="bg-[#F4F6F8] rounded-lg p-4">
                    <h3 className="font-bold text-[#0B3C5D] text-sm mb-1">{tech.title}</h3>
                    <p className="text-sm text-[#1D2731]/70">{tech.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* דרכי פנייה בנושא נגישות */}
            <section>
              <h2 className="text-xl font-bold text-[#0B3C5D] mb-4">דרכי פנייה בנושא נגישות</h2>
              <p>
                אם נתקלתם בבעיית נגישות באתר, או שיש לכם הצעות לשיפור הנגישות, אנא פנו אלינו
                ואנו נטפל בפנייתכם בהקדם:
              </p>
              <div className="bg-[#F4F6F8] rounded-lg p-6 mt-4 border-r-4 border-[#0B3C5D]">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-[#0B3C5D] min-w-[120px]">רכז/ת נגישות:</span>
                    <span>צוות הנגישות של משפטלי</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-[#0B3C5D] min-w-[120px]">דוא&quot;ל:</span>
                    <a href="mailto:accessibility@mishpatly.co.il" className="text-[#328CC1] hover:underline">
                      accessibility@mishpatly.co.il
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-[#0B3C5D] min-w-[120px]">טלפון:</span>
                    <a href="tel:+972-3-000-0000" className="text-[#328CC1] hover:underline" dir="ltr">
                      050-722-9966
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-[#0B3C5D] min-w-[120px]">כתובת:</span>
                    <span>דרך חיפה 19, קרית אתא</span>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-sm text-[#1D2731]/60">
                אנו מתחייבים לטפל בכל פניה בנושא נגישות תוך 5 ימי עסקים.
              </p>
            </section>

            {/* תאריך עדכון אחרון */}
            <section className="pt-6 border-t border-gray-200">
              <p className="text-sm text-[#1D2731]/60">
                <span className="font-bold">תאריך עדכון אחרון:</span> מאי 2026
              </p>
              <p className="text-sm text-[#1D2731]/60 mt-1">
                הצהרת נגישות זו נבדקת ומתעדכנת באופן תקופתי.
              </p>
            </section>
          </div>
        </article>
      </div>
    </div>
  );
}
