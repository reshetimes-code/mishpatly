'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Shield, Clock, Lock, CheckCircle } from 'lucide-react';

export default function LegalHelpPage() {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!fullName || !phone) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/legal-help', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, phone, email, topic }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.error || 'שגיאה בשליחה');
      }
    } catch {
      setError('שגיאה בחיבור לשרת');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-b from-[#f5f5f0] to-white">
      {/* Hero */}
      <section className="bg-gradient-to-bl from-[#0B3C5D] via-[#072a42] to-[#0B3C5D] text-white py-14">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-[#C9A84C] font-medium mb-2">ייעוץ משפטי ראשוני ללא עלות</p>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-4">
            זקוקים לליווי משפטי בנושא זה?
          </h1>
          <p className="text-blue-100/80 text-lg max-w-2xl mx-auto">
            השאירו פרטים - עורך דין מומחה בתחום ייצור קשר, יבחן את המקרה ויציע את הצעדים הנכונים.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 -mt-10 relative z-10">

          {/* Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              {!success ? (
                <form onSubmit={handleSubmit} className="p-8 space-y-5">
                  <div>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="שם מלא"
                      required
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl text-lg focus:ring-2 focus:ring-[#C9A84C] focus:bg-white outline-none transition-all"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="טלפון"
                      required
                      dir="ltr"
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl text-lg focus:ring-2 focus:ring-[#C9A84C] focus:bg-white outline-none transition-all"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="כתובת אימייל (לא חובה)"
                      dir="ltr"
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl text-lg focus:ring-2 focus:ring-[#C9A84C] focus:bg-white outline-none transition-all"
                    />
                  </div>
                  <div>
                    <textarea
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="נושא הפנייה - תארו בקצרה את הסיטואציה המשפטית"
                      rows={3}
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl text-lg focus:ring-2 focus:ring-[#C9A84C] focus:bg-white outline-none transition-all resize-none"
                    />
                  </div>

                  {error && (
                    <p className="text-red-500 text-sm">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={loading || !fullName || !phone}
                    className="w-full bg-gradient-to-l from-[#C9A84C] to-[#D4B85E] text-[#072a42] font-extrabold py-4 rounded-xl text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'שולח...' : 'צרו עימי קשר'}
                  </button>
                </form>
              ) : (
                <div className="p-8 text-center">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-green-600 mb-3">הפנייה נשלחה בהצלחה!</h2>
                  <p className="text-gray-600 mb-2">עורך דין מומחה בתחום ייצור איתכם קשר תוך 24 שעות.</p>
                  <p className="text-gray-400 text-sm mb-6">הייעוץ הראשוני ללא עלות וללא התחייבות.</p>
                  <Link href="/search" className="text-[#0B3C5D] hover:underline font-medium">
                    חזרה למאגר פסקי הדין
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Benefits */}
          <div className="lg:col-span-2 space-y-4">
            {[
              { icon: Shield, title: 'ייעוץ ראשוני ללא עלות', desc: 'השיחה הראשונה עם עורך הדין היא ללא עלות וללא התחייבות מצידכם.' },
              { icon: Clock, title: 'תגובה תוך 24 שעות', desc: 'עורך דין מומחה בתחום הרלוונטי ייצור עימכם קשר תוך יום עסקים.' },
              { icon: Lock, title: 'סודיות מלאה', desc: 'כל הפרטים שתמסרו נשמרים בסודיות מוחלטת ומוגנים בהתאם לחוק.' },
            ].map((b) => (
              <div key={b.title} className="bg-white rounded-xl shadow-md border border-gray-100 p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#C9A84C]/10 flex items-center justify-center shrink-0">
                  <b.icon className="h-5 w-5 text-[#C9A84C]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#0B3C5D] mb-1">{b.title}</h3>
                  <p className="text-sm text-gray-500">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SEO content */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 mt-12">
          <h2 className="text-xl font-bold text-[#0B3C5D] mb-4">ליווי משפטי מקצועי - משפטלי</h2>
          <div className="text-sm text-gray-600 leading-relaxed space-y-3">
            <p>
              שירות הליווי המשפטי של משפטלי מחבר בין אנשים הזקוקים לסיוע משפטי
              לבין עורכי דין מומחים בתחום הרלוונטי. השירות כולל ייעוץ ראשוני ללא עלות,
              התאמה אישית לפי סוג התיק, ומענה מהיר תוך 24 שעות.
            </p>
            <p>
              בין אם מדובר בתביעה אזרחית, הליך פלילי, סכסוך משפחתי, תביעת עבודה,
              עסקת מקרקעין או כל נושא משפטי אחר - נמצא עבורכם את עורך הדין המתאים ביותר.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
