'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Clock, ChevronLeft, Scale } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden">
      {/* Top gold divider */}
      <div className="h-1 bg-gradient-to-l from-transparent via-[#C9A84C] to-transparent" />

      <div className="bg-gradient-to-b from-[#072a42] to-[#051e30] text-blue-100">
        {/* Decorative */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#C9A84C]/3 translate-x-1/2 -translate-y-1/2" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* About */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-5">
                <Image src="/logo.png" alt="משפטלי" width={45} height={45} className="rounded" />
                <div>
                  <h3 className="text-white font-bold text-xl">משפטלי</h3>
                  <p className="text-[#C9A84C] text-xs font-medium">מאגר משפטי מתקדם</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-blue-200/60">
                משפטלי הוא מאגר פסקי דין והחלטות משפטיות המציע חיפוש מהיר ומדויק
                במאגר פסיקה עדכני מ-7 מקורות מידע. האתר מספק גישה נוחה למידע משפטי ציבורי.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-bold text-base mb-5 flex items-center gap-2">
                <div className="w-1 h-5 bg-[#C9A84C] rounded-full" />
                קישורים מהירים
              </h3>
              <ul className="space-y-3 text-sm">
                {[
                  { href: '/', label: 'דף הבית' },
                  { href: '/search', label: 'חיפוש פסקי דין' },
                  { href: '/removal-request', label: 'בקשת הסרת אזכור' },
                  { href: '/articles', label: 'מאמרים משפטיים' },
                  { href: '/accessibility', label: 'הצהרת נגישות' },
                  { href: '/privacy', label: 'מדיניות פרטיות' },
                  { href: '/terms', label: 'תנאי שימוש' },
                ].map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-blue-200/60 hover:text-[#C9A84C] transition-colors duration-300 flex items-center gap-1 group">
                      <ChevronLeft className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Areas */}
            <div>
              <h3 className="text-white font-bold text-base mb-5 flex items-center gap-2">
                <div className="w-1 h-5 bg-[#C9A84C] rounded-full" />
                תחומי משפט
              </h3>
              <ul className="space-y-3 text-sm">
                {['אזרחי', 'פלילי', 'עבודה', 'מנהלי', 'משפחה', 'נזיקין'].map((area) => (
                  <li key={area}>
                    <Link href={`/search?procedureType=${area}`} className="text-blue-200/60 hover:text-[#C9A84C] transition-colors duration-300 flex items-center gap-1 group">
                      <ChevronLeft className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                      {area}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-white font-bold text-base mb-5 flex items-center gap-2">
                <div className="w-1 h-5 bg-[#C9A84C] rounded-full" />
                צור קשר
              </h3>
              <ul className="space-y-4 text-sm">
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-[#C9A84C]" />
                  </div>
                  <a href="mailto:telaviv2u@gmail.com" className="text-blue-200/60 hover:text-[#C9A84C] transition-colors duration-300">
                    telaviv2u@gmail.com
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-[#C9A84C]" />
                  </div>
                  <a href="tel:+972-50-722-9966" className="text-blue-200/60 hover:text-[#C9A84C] transition-colors duration-300">
                    050-722-9966
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-[#C9A84C]" />
                  </div>
                  <span className="text-blue-200/60">דרך חיפה 19, קרית אתא</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-[#C9A84C]" />
                  </div>
                  <span className="text-blue-200/60">א׳-ה׳ 09:00-17:00</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-blue-300/40">
            <p className="flex items-center gap-2">
              <Scale className="w-3.5 h-3.5 text-[#C9A84C]/40" />
              &copy; {currentYear} משפטלי - כל הזכויות שמורות
            </p>
            <div className="flex gap-6">
              <Link href="/accessibility" className="hover:text-[#C9A84C] transition-colors duration-300">נגישות</Link>
              <Link href="/privacy" className="hover:text-[#C9A84C] transition-colors duration-300">פרטיות</Link>
              <Link href="/terms" className="hover:text-[#C9A84C] transition-colors duration-300">תנאי שימוש</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
