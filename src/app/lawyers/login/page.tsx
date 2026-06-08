'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LawyerLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/lawyer-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem('lawyerToken', data.token);
        localStorage.setItem('lawyerSlug', data.lawyer.slug);
        localStorage.setItem('lawyerName', data.lawyer.fullName);
        router.push(`/lawyers/${data.lawyer.slug}/edit`);
      } else {
        setError(data.error || 'שגיאה בהתחברות');
      }
    } catch {
      setError('שגיאה בהתחברות');
    }
    setLoading(false);
  }

  return (
    <div dir="rtl" className="min-h-screen bg-legal-bg flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-primary">כניסה לעורכי דין</h1>
            <p className="text-sm text-gray-400 mt-1">התחברו לחשבון שלכם לניהול כרטיס הביקור</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">אימייל</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2.5 px-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
                placeholder="lawyer@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">סיסמה</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2.5 px-3 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
                placeholder="הזינו את הסיסמה"
              />
            </div>

            {error && (
              <div className="rounded-lg bg-legal-danger/10 p-3 text-sm text-legal-danger">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-accent py-3 text-sm font-bold text-[#072a42] transition-all hover:bg-accent-light hover:shadow-lg disabled:opacity-50"
            >
              {loading ? 'מתחבר...' : 'כניסה'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              אין לכם חשבון?{' '}
              <Link href="/lawyers/register" className="text-accent font-medium hover:underline">
                הרשמו עכשיו
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
