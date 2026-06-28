'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Menu, X, ChevronDown } from 'lucide-react';
import Swal from 'sweetalert2';

const navLinks = [
  { href: '/', label: 'דף הבית' },
  { href: '/about', label: 'אודות' },
  { href: '/search', label: 'פסקי דין' },
  { href: '/my-judgments', label: 'פרסם פסקי דין' },
  { href: '#', label: 'דירוג', dropdown: [
    { href: '/rating/judges', label: 'דירוג שופטים' },
    { href: '/rating/lawyers', label: 'דירוג עורכי דין' },
  ]},
  { href: '/lawyers', label: 'פורטל עורכי דין' },
  { href: '/articles', label: 'מאמרים משפטיים' },
  { href: '/legal-help', label: 'ליווי משפטי' },
  { href: '/contact', label: 'צור קשר' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lawyerSlug, setLawyerSlug] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('lawyerToken');
    const slug = localStorage.getItem('lawyerSlug');
    if (token && slug) {
      setLawyerSlug(slug);
    }
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#072a42]/95 backdrop-blur-xl shadow-2xl shadow-black/20 py-2'
          : 'bg-[#0B3C5D] py-3'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <Image
                src="/logo.png"
                alt="משפטלי"
                width={180}
                height={180}
                className="object-contain transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute -inset-2 bg-[#C9A84C]/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link, i) => (
              link.dropdown ? (
                <div key={link.label} className="relative group">
                  <button
                    className="relative text-blue-100/80 hover:text-white px-3 py-2.5 text-sm font-medium transition-all duration-300 whitespace-nowrap flex items-center gap-1"
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    {link.label}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#C9A84C] transition-all duration-400 group-hover:w-3/4 rounded-full" />
                  </button>
                  <div className="absolute top-full right-0 mt-1 bg-[#072a42] border border-[#C9A84C]/20 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-[180px] z-50">
                    {link.dropdown.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className="block px-4 py-2.5 text-sm text-blue-100/80 hover:text-white hover:bg-white/10 transition-colors first:rounded-t-lg last:rounded-b-lg"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-blue-100/80 hover:text-white px-3 py-2.5 text-sm font-medium transition-all duration-300 group whitespace-nowrap"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#C9A84C] transition-all duration-400 group-hover:w-3/4 rounded-full" />
              </Link>
              )
            ))}
            <Link
              href="/admin/login"
              className="mr-2 px-4 py-2 border border-[#C9A84C]/50 text-[#C9A84C] text-sm font-medium rounded-lg transition-all duration-300 hover:bg-[#C9A84C]/10 whitespace-nowrap"
            >
              כניסת מנהל
            </Link>
            <Link
              href={lawyerSlug ? `/lawyers/${lawyerSlug}/edit` : '/lawyers/login'}
              className="mr-2 px-4 py-2 border border-[#C9A84C]/50 text-[#C9A84C] text-sm font-medium rounded-lg transition-all duration-300 hover:bg-[#C9A84C]/10 whitespace-nowrap"
            >
              {lawyerSlug ? 'הכרטיס שלי' : 'כניסה לעורכי דין'}
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-white p-2.5 rounded-xl hover:bg-white/10 transition-all duration-300"
            aria-label={mobileMenuOpen ? 'סגור תפריט' : 'פתח תפריט'}
          >
            <div className="relative w-6 h-6">
              <Menu className={`absolute inset-0 transition-all duration-300 ${mobileMenuOpen ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'}`} size={24} />
              <X className={`absolute inset-0 transition-all duration-300 ${mobileMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'}`} size={24} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${mobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="bg-[#072a42]/95 backdrop-blur-xl border-t border-[#C9A84C]/20">
          <nav className="px-4 py-4 space-y-1">
            {navLinks.map((link, i) => (
              link.dropdown ? (
                <div key={link.label}>
                  <span className="block text-[#C9A84C] px-4 py-2 text-xs font-bold uppercase tracking-wider">{link.label}</span>
                  {link.dropdown.map((sub) => (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-blue-100/80 hover:text-white hover:bg-white/5 px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-300"
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              ) : (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-blue-100/80 hover:text-white hover:bg-white/5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 hover:pr-6"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {link.label}
              </Link>
              )
            ))}
            <Link
              href="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-[#C9A84C] hover:text-white hover:bg-white/5 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 hover:pr-6"
            >
              כניסת מנהל
            </Link>
            <Link
              href={lawyerSlug ? `/lawyers/${lawyerSlug}/edit` : '/lawyers/login'}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-[#C9A84C] hover:text-white hover:bg-white/5 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 hover:pr-6"
            >
              {lawyerSlug ? 'הכרטיס שלי' : 'כניסה לעורכי דין'}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
