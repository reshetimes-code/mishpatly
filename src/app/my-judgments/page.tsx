'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';

export default function MyJudgmentsPage() {
  const [email, setEmail] = useState('');
  const [caseNumber, setCaseNumber] = useState('');
  const [courtName, setCourtName] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !file || !agreedTerms) return;

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('caseNumber', caseNumber);
      formData.append('courtName', courtName);
      formData.append('description', description);
      formData.append('file', file);
      formData.append('agreedTerms', 'true');

      const res = await fetch('/api/submissions', {
        method: 'POST',
        body: formData,
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
    <div dir="rtl" className="min-h-screen bg-[#f5f5f0]">
      {/* Header */}
      <div className="bg-gradient-to-l from-[#0B3C5D] to-[#1a5276] text-white py-10">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-3">פסקי דין שלי</h1>
          <p className="text-blue-200 text-lg">העלו פסק דין לפרסום במאגר משפטלי</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-[#C9A84C]">דף הבית</Link>
          <span className="mx-2">&gt;</span>
          <span className="text-[#0B3C5D]">פסקי דין שלי</span>
        </nav>

        {!success ? (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Info box */}
            <div className="bg-blue-50 border-b border-blue-200 p-5">
              <h2 className="font-semibold text-[#0B3C5D] mb-2">איך זה עובד?</h2>
              <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                <li>מזינים כתובת דוא&quot;ל</li>
                <li>מעלים את קובץ פסק הדין (PDF)</li>
                <li>מסמנים את תיבת האישור ושולחים</li>
                <li>המסמך יועבר לבדיקה ויפורסם לאחר אישור</li>
              </ol>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  כתובת דוא&quot;ל <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A84C] focus:border-[#C9A84C] outline-none"
                  dir="ltr"
                />
              </div>

              {/* Case number */}
              <div>
                <label htmlFor="caseNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  מספר תיק (אופציונלי)
                </label>
                <input
                  id="caseNumber"
                  type="text"
                  value={caseNumber}
                  onChange={(e) => setCaseNumber(e.target.value)}
                  placeholder='לדוגמה: ת"א 12345-01-24'
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A84C] focus:border-[#C9A84C] outline-none"
                />
              </div>

              {/* Court */}
              <div>
                <label htmlFor="courtName" className="block text-sm font-medium text-gray-700 mb-1">
                  בית משפט (אופציונלי)
                </label>
                <input
                  id="courtName"
                  type="text"
                  value={courtName}
                  onChange={(e) => setCourtName(e.target.value)}
                  placeholder="לדוגמה: בית משפט השלום תל אביב"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A84C] focus:border-[#C9A84C] outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  תיאור קצר (אופציונלי)
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="תיאור קצר של פסק הדין..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A84C] focus:border-[#C9A84C] outline-none resize-none"
                />
              </div>

              {/* File upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  קובץ פסק הדין (PDF) <span className="text-red-500">*</span>
                </label>
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-[#C9A84C] transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                  {!file ? (
                    <>
                      <div className="text-3xl mb-2">&#128196;</div>
                      <p className="text-gray-600">לחצו כאן לבחירת קובץ PDF</p>
                      <p className="text-xs text-gray-400 mt-1">גודל מקסימלי: 20MB</p>
                    </>
                  ) : (
                    <>
                      <div className="text-3xl mb-2">&#9989;</div>
                      <p className="text-gray-700 font-medium">{file.name}</p>
                      <p className="text-xs text-gray-400 mt-1">{(file.size / 1024).toFixed(0)} KB</p>
                    </>
                  )}
                </div>
              </div>

              {/* Terms */}
              <div className="bg-[#f9f6ee] border border-[#e8dfc0] rounded-lg p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedTerms}
                    onChange={(e) => setAgreedTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-gray-300 text-[#C9A84C] focus:ring-[#C9A84C]"
                  />
                  <span className="text-sm text-gray-700">
                    אני מאשר/ת כי פסק הדין שאני מעלה אינו חסוי, ניתן לפרסום,
                    ואני נושא/ת באחריות על תוכנו. ידוע לי שהמסמך יפורסם באתר משפטלי
                    לאחר בדיקה ואישור. <span className="text-red-500">*</span>
                  </span>
                </label>
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || !email || !file || !agreedTerms}
                className="w-full bg-gradient-to-l from-[#C9A84C] to-[#D4B85E] text-[#072a42] font-bold py-3.5 rounded-lg transition-all shadow hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                {loading ? 'שולח...' : 'שליחת פסק דין'}
              </button>
            </form>
          </div>
        ) : (
          /* Success */
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
            <div className="text-5xl mb-4">&#10004;&#65039;</div>
            <h2 className="text-2xl font-bold text-green-600 mb-3">המסמך נשלח בהצלחה!</h2>
            <p className="text-gray-600 mb-2">פסק הדין יועבר לבדיקה ויפורסם לאחר אישור.</p>
            <p className="text-gray-500 text-sm mb-6">תקבלו עדכון לכתובת {email}</p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => { setSuccess(false); setFile(null); setEmail(''); setCaseNumber(''); setCourtName(''); setDescription(''); setAgreedTerms(false); }}
                className="bg-[#0B3C5D] hover:bg-[#072a42] text-white font-bold px-6 py-3 rounded-lg transition-all"
              >
                שליחת מסמך נוסף
              </button>
              <Link
                href="/search"
                className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium px-6 py-3 rounded-lg transition-all"
              >
                חזרה למאגר
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
