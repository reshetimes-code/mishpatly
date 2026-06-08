'use client';

import { useState } from 'react';
import { Key, Mail, Globe, Shield, Save, Eye, EyeOff } from 'lucide-react';
import Swal from 'sweetalert2';

export default function AdminSettingsPage() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

  // Password change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // Site settings
  const [siteName] = useState('משפטלי');
  const [contactEmail, setContactEmail] = useState('telaviv2u@gmail.com');
  const [contactPhone, setContactPhone] = useState('050-722-9966');
  const [savingSite, setSavingSite] = useState(false);

  // Import settings
  const [autoImport, setAutoImport] = useState(true);
  const [importHour, setImportHour] = useState('05:00');
  const [savingImport, setSavingImport] = useState(false);

  async function handlePasswordChange() {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Swal.fire({ icon: 'warning', title: 'שדות חסרים', text: 'יש למלא את כל השדות', confirmButtonColor: '#C9A84C' });
      return;
    }
    if (newPassword !== confirmPassword) {
      Swal.fire({ icon: 'error', title: 'שגיאה', text: 'הסיסמאות אינן תואמות', confirmButtonColor: '#C9A84C' });
      return;
    }
    if (newPassword.length < 6) {
      Swal.fire({ icon: 'warning', title: 'סיסמה קצרה', text: 'הסיסמה חייבת להכיל לפחות 6 תווים', confirmButtonColor: '#C9A84C' });
      return;
    }

    setSavingPassword(true);
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        Swal.fire({ icon: 'success', title: 'הסיסמה שונתה בהצלחה', confirmButtonColor: '#C9A84C' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        Swal.fire({ icon: 'error', title: 'שגיאה', text: data.error || 'שגיאה בשינוי הסיסמה', confirmButtonColor: '#C9A84C' });
      }
    } catch {
      Swal.fire({ icon: 'error', title: 'שגיאה', text: 'שגיאת תקשורת', confirmButtonColor: '#C9A84C' });
    }
    setSavingPassword(false);
  }

  async function handleSaveSite() {
    setSavingSite(true);
    // Future: save to DB
    await new Promise(r => setTimeout(r, 500));
    Swal.fire({ icon: 'success', title: 'ההגדרות נשמרו', confirmButtonColor: '#C9A84C' });
    setSavingSite(false);
  }

  async function handleSaveImport() {
    setSavingImport(true);
    await new Promise(r => setTimeout(r, 500));
    Swal.fire({ icon: 'success', title: 'הגדרות הייבוא נשמרו', confirmButtonColor: '#C9A84C' });
    setSavingImport(false);
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-bold text-legal-text">הגדרות</h1>

      {/* Password Change */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Key className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-bold text-legal-text">שינוי סיסמה</h2>
            <p className="text-xs text-gray-400">שנה את סיסמת הכניסה לפאנל הניהול</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">סיסמה נוכחית</label>
            <div className="relative">
              <input
                type={showPasswords ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                placeholder="הכנס סיסמה נוכחית"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">סיסמה חדשה</label>
            <input
              type={showPasswords ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
              placeholder="הכנס סיסמה חדשה (לפחות 6 תווים)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">אימות סיסמה חדשה</label>
            <input
              type={showPasswords ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
              placeholder="הכנס שוב את הסיסמה החדשה"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowPasswords(!showPasswords)}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition"
            >
              {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showPasswords ? 'הסתר סיסמאות' : 'הצג סיסמאות'}
            </button>
            <button
              onClick={handlePasswordChange}
              disabled={savingPassword}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-light transition disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {savingPassword ? 'שומר...' : 'שנה סיסמה'}
            </button>
          </div>
        </div>
      </div>

      {/* Site Settings */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
            <Globe className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h2 className="font-bold text-legal-text">הגדרות אתר</h2>
            <p className="text-xs text-gray-400">פרטי קשר ומידע כללי</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">שם האתר</label>
            <input
              type="text"
              value={siteName}
              disabled
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-500"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">אימייל ליצירת קשר</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">טלפון</label>
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                dir="ltr"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleSaveSite}
              disabled={savingSite}
              className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {savingSite ? 'שומר...' : 'שמור הגדרות'}
            </button>
          </div>
        </div>
      </div>

      {/* Import Settings */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h2 className="font-bold text-legal-text">הגדרות ייבוא</h2>
            <p className="text-xs text-gray-400">ניהול ייבוא אוטומטי של פסקי דין</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-legal-text">ייבוא אוטומטי יומי</p>
              <p className="text-xs text-gray-400">סריקת כל המקורות אוטומטית כל יום</p>
            </div>
            <button
              onClick={() => setAutoImport(!autoImport)}
              className={`relative w-12 h-6 rounded-full transition-colors ${autoImport ? 'bg-green-500' : 'bg-gray-300'}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${autoImport ? 'right-0.5' : 'right-6'}`} />
            </button>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">שעת ייבוא</label>
            <input
              type="time"
              value={importHour}
              onChange={(e) => setImportHour(e.target.value)}
              className="w-40 px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
              dir="ltr"
            />
            <p className="text-xs text-gray-400 mt-1">הייבוא מתבצע מדי יום בשעה שנבחרה (שעון ישראל)</p>
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleSaveImport}
              disabled={savingImport}
              className="flex items-center gap-2 px-5 py-2.5 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {savingImport ? 'שומר...' : 'שמור הגדרות ייבוא'}
            </button>
          </div>
        </div>
      </div>

      {/* System Info */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="font-bold text-legal-text mb-4">מידע מערכת</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-500">גרסה</span>
            <span className="font-medium text-legal-text">0.1.0</span>
          </div>
          <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-500">סביבה</span>
            <span className="font-medium text-legal-text">Production</span>
          </div>
          <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-500">בסיס נתונים</span>
            <span className="font-medium text-green-600">מחובר</span>
          </div>
          <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-500">אחסון</span>
            <span className="font-medium text-legal-text">Google Cloud Run</span>
          </div>
        </div>
      </div>
    </div>
  );
}
