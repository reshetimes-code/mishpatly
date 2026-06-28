import type { Metadata } from 'next';
import Link from 'next/link';
import { Shield, CheckCircle, Clock, FileText, Phone, Mail, ChevronLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'הסרת אזכורים משפטיים | משפטלי',
  description: 'שירות מקצועי להסרת אזכורים משפטיים ממנועי חיפוש ומאגרי מידע. הגנה על פרטיותך וזכויותיך.',
};

const steps = [
  { icon: FileText, title: 'שליחת בקשה', desc: 'מלאו את טופס הבקשה עם פרטי פסק הדין או האזכור שברצונכם להסיר.' },
  { icon: Clock, title: 'בדיקה ואימות', desc: 'הצוות שלנו בודק את הבקשה ומוודא שהיא עומדת בתנאים המשפטיים הנדרשים.' },
  { icon: CheckCircle, title: 'ביצוע ההסרה', desc: 'לאחר אישור הבקשה, האזכור מוסר מהמאגר שלנו וממנועי החיפוש.' },
];

const reasons = [
  'הזכות להישכח - הגנה על פרטיותכם בהתאם לחוק הגנת הפרטיות',
  'מניעת פגיעה תעסוקתית כתוצאה מאזכורים משפטיים ישנים',
  'הסרת מידע שאינו רלוונטי עוד לאחר שחלף זמן רב',
  'מקרים בהם ניתן צו איסור פרסום על ידי בית המשפט',
  'הסרת פרטים מזהים של קטינים או נפגעי עבירה',
];

export default function RemovalPage() {
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Hero */}
      <section className="bg-gradient-to-l from-[#0B3C5D] to-[#1a5276] text-white py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mx-auto mb-6 border border-white/20">
            <Shield className="h-10 w-10 text-[#C9A84C]" strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">הסרת אזכורים משפטיים</h1>
          <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            שירות מקצועי להסרת אזכורים משפטיים ממנועי חיפוש ומאגרי מידע, תוך שמירה מלאה על פרטיותכם וזכויותיכם.
          </p>
        </div>
      </section>

      {/* What is removal */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-[#0B3C5D] text-center mb-4">מהי הסרת אזכורים?</h2>
          <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed text-lg">
            הסרת אזכורים היא תהליך משפטי המאפשר לאדם לבקש הסרה של מידע משפטי הנוגע אליו ממאגרי מידע ומנועי חיפוש.
            הזכות להישכח מעוגנת בחוק הגנת הפרטיות ומאפשרת לכל אדם לשלוט במידע האישי שלו ברשת.
          </p>

          {/* Steps */}
          <h3 className="text-2xl font-bold text-[#0B3C5D] text-center mb-8">איך זה עובד?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {steps.map((step, i) => (
              <div key={step.title} className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 text-center relative">
                <div className="absolute -top-4 right-1/2 translate-x-1/2 w-8 h-8 rounded-full bg-[#C9A84C] text-white flex items-center justify-center font-bold text-sm">
                  {i + 1}
                </div>
                <div className="w-14 h-14 rounded-xl bg-[#0B3C5D]/10 flex items-center justify-center mx-auto mb-4 mt-2">
                  <step.icon className="h-7 w-7 text-[#C9A84C]" strokeWidth={1.5} />
                </div>
                <h4 className="text-lg font-bold text-[#0B3C5D] mb-2">{step.title}</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* Reasons */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 sm:p-10">
            <h3 className="text-2xl font-bold text-[#0B3C5D] mb-6">מתי ניתן לבקש הסרת אזכורים?</h3>
            <ul className="space-y-4">
              {reasons.map((reason) => (
                <li key={reason} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 leading-relaxed">{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Contact / CTA */}
      <section className="py-16 bg-gradient-to-l from-[#0B3C5D] to-[#1a5276]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">רוצים להגיש בקשת הסרה?</h2>
          <p className="text-white/80 mb-8 text-lg">
            צרו איתנו קשר ונטפל בבקשתכם במקצועיות ובדיסקרטיות מלאה.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#C9A84C] hover:bg-[#b8963e] text-white font-bold rounded-xl transition-colors text-lg"
            >
              <Mail className="w-5 h-5" />
              צור קשר
            </Link>
            <a
              href="tel:+972000000000"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-colors text-lg border border-white/20"
            >
              <Phone className="w-5 h-5" />
              חייגו אלינו
            </a>
          </div>
        </div>
      </section>

      {/* Back to home */}
      <section className="py-10 text-center">
        <Link href="/" className="inline-flex items-center gap-1 text-[#0B3C5D] hover:text-[#C9A84C] font-medium transition-colors">
          <ChevronLeft className="w-4 h-4" />
          חזרה לדף הבית
        </Link>
      </section>
    </div>
  );
}
