'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ChevronDown } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'דף הבית' },
  { href: '/search', label: 'פסקי דין' },
  { href: '/search?advanced=true', label: 'חיפוש מתקדם' },
  { href: '/lawyers', label: 'פורטל עורכי דין' },
  { href: '/articles', label: 'מאמרים משפטיים' },
  { href: '/contact', label: 'צור קשר' },
  { href: '/admin/login', label: 'כניסת מנהל' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
              <Link
                key={link.href}
                href={link.href}
                className="relative text-blue-100/80 hover:text-white px-4 py-2.5 text-sm font-medium transition-all duration-300 group"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#C9A84C] transition-all duration-400 group-hover:w-3/4 rounded-full" />
              </Link>
            ))}
            <Link
              href="/search"
              className="mr-3 px-5 py-2 bg-gradient-to-l from-[#C9A84C] to-[#D4B85E] text-[#072a42] text-sm font-bold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-[#C9A84C]/25 hover:-translate-y-0.5"
            >
              חיפוש פסיקה
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
      <div className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="bg-[#072a42]/95 backdrop-blur-xl border-t border-[#C9A84C]/20">
          <nav className="px-4 py-4 space-y-1">
            {navLinks.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-blue-100/80 hover:text-white hover:bg-white/5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 hover:pr-6"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
