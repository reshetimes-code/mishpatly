'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Scale } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        const Swal = (await import('sweetalert2')).default;
        await Swal.fire({
          icon: 'error',
          title: 'שגיאה',
          text: data.message || 'שם משתמש או סיסמה שגויים',
          confirmButtonColor: '#0B3C5D',
        });
        setLoading(false);
        return;
      }

      localStorage.setItem('token', data.token);
      router.push('/admin/dashboard');
    } catch {
      const Swal = (await import('sweetalert2')).default;
      await Swal.fire({
        icon: 'error',
        title: 'שגיאת חיבור',
        text: 'לא ניתן להתחבר לשרת. נסה שוב מאוחר יותר.',
        confirmButtonColor: '#0B3C5D',
      });
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-legal-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mb-4">
              <Scale className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-legal-text">משפטלי</h1>
            <p className="text-gray-500 mt-1">כניסת מנהל</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-legal-text mb-1.5">
                אימייל
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition text-legal-text"
                placeholder="admin@mishpatly.co.il"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-legal-text mb-1.5">
                סיסמה
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition text-legal-text"
                placeholder="הזן סיסמה"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-light transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'מתחבר...' : 'התחברות'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
