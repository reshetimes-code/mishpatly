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
      {/* Half-circle button attached to right edge */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-1/2 -translate-y-1/2 right-0 z-50 bg-[#0B3C5D] hover:bg-[#072a42] text-white rounded-l-full w-10 h-20 flex items-center justify-center shadow-lg transition-colors"
        aria-label="תפריט נגישות"
        title="נגישות"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mr-1">
          <circle cx="12" cy="4" r="2"/>
          <path d="M19 13v-2c-1.54.02-3.09-.75-4.07-1.83l-1.29-1.43c-.17-.19-.38-.34-.61-.45-.01 0-.01-.01-.02-.01H13c-.35-.2-.75-.3-1.19-.26C10.76 7.11 10 8.04 10 9.09V15c0 1.1.9 2 2 2h5v5h2v-5.5c0-1.1-.9-2-2-2h-3v-3.45c1.29 1.07 3.25 1.94 5 1.95zm-6.17 5c-.41 1.16-1.52 2-2.83 2-1.66 0-3-1.34-3-3 0-1.31.84-2.41 2-2.83V12.1c-2.28.46-4 2.48-4 4.9 0 2.76 2.24 5 5 5 2.42 0 4.44-1.72 4.9-4h-2.07z"/>
        </svg>
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed top-1/2 -translate-y-1/2 right-12 z-50 bg-white rounded-xl shadow-2xl border border-gray-200 w-72 overflow-hidden" dir="rtl">
          <div className="bg-[#0B3C5D] text-white px-4 py-3 flex items-center justify-between">
            <h3 className="font-bold text-sm">הגדרות נגישות</h3>
            <button onClick={() => setOpen(false)} className="text-white hover:text-gray-200">&#x2715;</button>
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
