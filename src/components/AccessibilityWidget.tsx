'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AccessibilityWidget() {
  const [open, setOpen] = useState(false);

  const actions = [
    { label: 'הגדלת טקסט', action: () => document.body.style.fontSize = '120%' },
    { label: 'הקטנת טקסט', action: () => document.body.style.fontSize = '100%' },
    { label: 'ניגודיות גבוהה', action: () => document.body.classList.toggle('high-contrast') },
    { label: 'קישורים מודגשים', action: () => document.body.classList.toggle('underline-links') },
    { label: 'גופן קריא', action: () => document.body.classList.toggle('readable-font') },
    { label: 'איפוס', action: () => { document.body.style.fontSize = '100%'; document.body.classList.remove('high-contrast', 'underline-links', 'readable-font'); } },
  ];

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 left-6 z-50 bg-accent hover:bg-primary text-white rounded-full w-14 h-14 flex items-center justify-center shadow-xl transition-colors"
        aria-label="תפריט נגישות"
        title="נגישות"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
          <path d="M12 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm-1 6h2c.55 0 1 .45 1 1v3l3.5 6.5c.3.55.1 1.24-.45 1.54-.55.3-1.24.1-1.54-.45L12.5 14h-1l-3.01 5.59c-.3.55-.99.75-1.54.45-.55-.3-.75-.99-.45-1.54L10 12V9c0-.55.45-1 1-1z"/>
        </svg>
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-24 left-6 z-50 bg-white rounded-xl shadow-2xl border border-gray-200 w-72 overflow-hidden" dir="rtl">
          <div className="bg-primary text-white px-4 py-3 flex items-center justify-between">
            <h3 className="font-bold text-sm">הגדרות נגישות</h3>
            <button onClick={() => setOpen(false)} className="text-white hover:text-gray-200">✕</button>
          </div>
          <div className="p-3 space-y-2">
            {actions.map((a) => (
              <button
                key={a.label}
                onClick={a.action}
                className="w-full text-right px-4 py-2.5 text-sm bg-legal-bg hover:bg-gray-200 rounded-lg transition-colors font-medium text-legal-text"
              >
                {a.label}
              </button>
            ))}
            <Link
              href="/accessibility"
              onClick={() => setOpen(false)}
              className="block w-full text-right px-4 py-2.5 text-sm bg-accent/10 hover:bg-accent/20 rounded-lg transition-colors font-medium text-accent"
            >
              הצהרת נגישות מלאה
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
