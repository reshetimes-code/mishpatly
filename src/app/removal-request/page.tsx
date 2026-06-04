'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FileText, Send, Shield, Clock, CheckCircle } from 'lucide-react';

function RemovalForm() {
  const searchParams = useSearchParams();
  const judgmentSlug = searchParams.get('judgment') || '';

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    judgmentLink: judgmentSlug ? `/judgment/${judgmentSlug}` : '',
    caseNumber: '',
    reason: '',
    agree: false,
  });
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.agree) {
      const Swal = (await import('sweetalert2')).default;
      Swal.fire({ icon: 'warning', title: 'שגיאה', text: 'יש לאשר את הצהרת הנכונות', confirmButtonColor: '#0B3C5D' });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/removal-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: form.fullName,
          phone: form.phone,
          email: form.email,
          reason: form.reason,
          documentUrl: form.judgmentLink,
        }),
      });

      const Swal = (await import('sweetalert2')).default;
      if (res.ok) {
        Swal.fire({
          icon: 'success',
          title: 'הבקשה נשלחה בהצלחה!',
          text: 'נחזור אליך תוך 3-5 ימי עסקים',
          confirmButtonColor: '#0B3C5D',
        });
        setForm({ fullName: '', phone: '', email: '', judgmentLink: '', caseNumber: '', reason: '', agree: false });
        setFile(null);
      } else {
        Swal.fire({ icon: 'error', title: 'שגיאה', text: 'אירעה שגיאה, נסה שנית', confirmButtonColor: '#B83232' });
      }
    } catch {
      const Swal = (await import('sweetalert2')).default;
      Swal.fire({ icon: 'error', title: 'שגיאה', text: 'אירעה שגיאה בשליחה, נסה שנית', confirmButtonColor: '#B83232' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-legal-bg">
      {/* Breadcrumbs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 text-sm text-gray-500">
          <Link href="/" className="hover:text-primary">דף הבית</Link>
          <span className="mx-2">/</span>
          <span className="text-primary font-medium">בקשת הסרת אזכור</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-3">בקשת הסרת אזכור משפטי</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            באפשרותך להגיש בקשה להסרת אזכור שלך מפסקי דין המופיעים במאגר שלנו.
            מלא/י את הטופס הבא ונחזור אליך בהקדם.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 sm:p-8 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">שם מלא *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition"
                    placeholder="הכנס שם מלא"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">טלפון</label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition"
                    placeholder="050-000-0000"
                    dir="ltr"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">אימייל *</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition"
                  placeholder="your@email.com"
                  dir="ltr"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">קישור לפסק הדין</label>
                  <input
                    type="text"
                    name="judgmentLink"
                    value={form.judgmentLink}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition"
                    placeholder="הכנס קישור לפסק הדין"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">מספר תיק</label>
                  <input
                    type="text"
                    name="caseNumber"
                    value={form.caseNumber}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition"
                    placeholder='לדוגמה: ת"א 1521-08-25'
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">סיבת הבקשה *</label>
                <textarea
                  name="reason"
                  value={form.reason}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition resize-none"
                  placeholder="פרט/י את הסיבה לבקשת ההסרה..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">העלאת מסמך (אופציונלי)</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm file:ml-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-primary file:text-white file:cursor-pointer file:text-sm"
                />
                <p className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX, JPG, PNG - עד 10MB</p>
              </div>

              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="agree"
                  checked={form.agree}
                  onChange={(e) => setForm((prev) => ({ ...prev, agree: e.target.checked }))}
                  className="mt-1 accent-primary"
                />
                <label htmlFor="agree" className="text-sm text-gray-600">
                  אני מאשר/ת כי המידע שמסרתי נכון ומדויק, ואני מבין/ה שבקשה זו תיבדק על ידי צוות האתר.
                </label>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto bg-legal-danger hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Send size={18} />
                {submitting ? 'שולח...' : 'שליחת בקשה'}
              </button>
            </form>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Process Steps */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                <Shield size={20} />
                תהליך הסרת אזכור
              </h2>
              <ol className="space-y-4">
                {[
                  { icon: <FileText size={16} />, text: 'מילוי טופס הבקשה עם כל הפרטים הנדרשים' },
                  { icon: <Clock size={16} />, text: 'קבלת הבקשה ובדיקה ראשונית תוך 24 שעות' },
                  { icon: <Shield size={16} />, text: 'בדיקה משפטית מקיפה של הבקשה' },
                  { icon: <CheckCircle size={16} />, text: 'קבלת תשובה והסרת האזכור במידת הצורך' },
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="bg-accent text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      {step.icon}
                      {step.text}
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* FAQ */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-bold text-primary mb-4">שאלות נפוצות</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold text-gray-700">כמה זמן לוקח הטיפול?</p>
                  <p className="text-gray-500">הטיפול בבקשה אורך 3-5 ימי עסקים.</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700">האם יש עלות?</p>
                  <p className="text-gray-500">הגשת הבקשה היא ללא עלות. שירותים נוספים בתשלום.</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-700">מה קורה אחרי אישור?</p>
                  <p className="text-gray-500">האזכור יוסר מהאתר ומאינדקס גוגל תוך מספר ימים.</p>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-primary text-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-bold mb-3">צריך עזרה?</h2>
              <p className="text-blue-200 text-sm mb-3">צוות המשפטנים שלנו זמין לסייע לך בכל שאלה.</p>
              <p className="text-sm">📧 telaviv2u@gmail.com</p>
              <p className="text-sm">📞 050-722-9966</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RemovalRequestPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-legal-bg flex items-center justify-center"><div className="text-primary text-lg">טוען...</div></div>}>
      <RemovalForm />
    </Suspense>
  );
}
