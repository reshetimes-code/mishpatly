'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Swal from 'sweetalert2';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PaymentPage({ params }: PageProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [judgmentId, setJudgmentId] = useState<string | null>(null);

  useEffect(() => {
    params.then(p => setJudgmentId(p.id));
  }, [params]);

  async function handlePurchase() {
    if (!email || !judgmentId) return;

    setLoading(true);

    // Show SweetAlert - free download during site construction
    const result = await Swal.fire({
      icon: 'success',
      title: 'הורדה חינם!',
      html: `
        <p style="font-size: 16px; color: #555; line-height: 1.8;">
          מסמך זה באופן זמני בגלל בניית האתר<br>
          <strong>יורד חינם ללא תשלום</strong><br><br>
          תודה על פנייתך!
        </p>
      `,
      confirmButtonText: 'הורד מסמך',
      confirmButtonColor: '#C9A84C',
      showCancelButton: false,
      allowOutsideClick: false,
      customClass: {
        popup: 'swal-rtl',
      },
    });

    if (result.isConfirmed) {
      // Redirect to download
      window.location.href = `/api/judgments/${judgmentId}/download?email=${encodeURIComponent(email)}`;
    }

    setLoading(false);
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[#f5f5f0] flex items-center justify-center px-4">
      <style jsx global>{`
        .swal-rtl { direction: rtl; }
      `}</style>
      <div className="max-w-md w-full">
        {/* Back link */}
        <Link href="javascript:history.back()" className="text-[#0B3C5D] hover:text-[#C9A84C] text-sm mb-4 inline-block">
          &rarr; חזרה לפסק הדין
        </Link>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-l from-[#0B3C5D] to-[#1a4f7a] text-white p-6 text-center">
            <h1 className="text-xl font-bold mb-1">רכישת מסמך מלא</h1>
            <p className="text-blue-200 text-sm">הורדת פסק הדין המלא בפורמט PDF</p>
          </div>

          <div className="p-6">
            {/* Price */}
            <div className="text-center mb-6">
              <div className="inline-flex items-baseline gap-1">
                <span className="text-4xl font-bold text-[#0B3C5D]">89</span>
                <span className="text-lg text-gray-500">₪</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">הורדת המסמך המלא כולל כל העמודים</p>
            </div>

            {/* Features */}
            <div className="bg-[#f9f6ee] rounded-lg p-4 mb-6">
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="text-green-500 font-bold">&#10003;</span>
                  הורדת המסמך המלא בפורמט PDF
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500 font-bold">&#10003;</span>
                  כל העמודים של פסק הדין
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-500 font-bold">&#10003;</span>
                  קישור הורדה נשלח למייל
                </li>
              </ul>
            </div>

            {/* Email input */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                כתובת אימייל
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A84C] focus:border-[#C9A84C] outline-none text-left"
                dir="ltr"
              />
            </div>

            {/* Purchase button */}
            <button
              onClick={handlePurchase}
              disabled={loading || !email}
              className="w-full bg-gradient-to-l from-[#C9A84C] to-[#D4B85E] text-[#072a42] font-bold py-3 rounded-lg transition-all shadow hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? 'מעבד...' : 'רכישה - 89 ₪'}
            </button>

            <p className="text-xs text-gray-400 text-center mt-3">
              * כרגע במצב בדיקות - התשלום מדומה
            </p>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 border-t border-gray-200 px-6 py-3 text-center">
            <p className="text-xs text-gray-400">
              שירות תשלום מאובטח | משפטלי
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
