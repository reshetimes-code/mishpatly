"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Building2,
  Search,
  BookOpen,
  ShieldCheck,
  SlidersHorizontal,
  Bell,
  Phone,
  ArrowLeft,
  Scale,
  Gavel,
  Globe,
  Users,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  Scroll reveal hook                                                 */
/* ------------------------------------------------------------------ */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Find the .reveal child or use the element itself
    const revealEl = el.querySelector('.reveal') || el;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          revealEl.classList.add("visible");
          observer.unobserve(el);
        }
      },
      { threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */
const stats = [
  { icon: FileText, value: "83,000+", label: "פסקי דין", suffix: "" },
  { icon: Building2, value: "250+", label: "בתי משפט", suffix: "" },
  { icon: Globe, value: "7", label: "מקורות מידע", suffix: "" },
  { icon: Users, value: "24/7", label: "גישה חופשית", suffix: "" },
];

const features = [
  {
    icon: BookOpen,
    title: "מאגר פסקי דין מקיף",
    description: "גישה למאגר הגדול בישראל הכולל עשרות אלפי פסקי דין, החלטות שיפוטיות ופרוטוקולים מכל בתי המשפט ברחבי הארץ.",
    image: "/images/feature1.jpg",
  },
  {
    icon: ShieldCheck,
    title: "הסרת אזכורים",
    description: "שירות מקצועי להסרת אזכורים משפטיים ממנועי חיפוש ומאגרי מידע, תוך שמירה על פרטיותך וזכויותיך.",
    image: "/images/feature2.jpg",
  },
  {
    icon: SlidersHorizontal,
    title: "חיפוש מתקדם",
    description: "מנוע חיפוש חכם המאפשר סינון לפי שם, מספר תיק, בית משפט, תאריך ומילות מפתח לתוצאות מדויקות.",
    image: "/images/feature3.jpg",
  },
  {
    icon: Bell,
    title: "עדכונים שוטפים",
    description: "קבלת התראות על פסקי דין חדשים, שינויים בתיקים קיימים ועדכוני חקיקה רלוונטיים ישירות למייל שלך.",
    image: "/images/feature4.jpg",
  },
];

const categories = [
  { name: "אזרחי", count: "42,000+", icon: Scale },
  { name: "פלילי", count: "18,500+", icon: Gavel },
  { name: "עבודה", count: "8,200+", icon: Users },
  { name: "מנהלי", count: "5,800+", icon: Building2 },
  { name: "משפחה", count: "4,100+", icon: Users },
  { name: "נזיקין", count: "3,600+", icon: ShieldCheck },
];


/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */
export default function HomePage() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const r1 = useReveal();
  const r2 = useReveal();
  const r3 = useReveal();
  const r4 = useReveal();
  const r5 = useReveal();
  const r6 = useReveal();

  return (
    <div dir="rtl" className="min-h-screen bg-[#FAFBFC] text-[#1a1a2e]">
      {/* ============================================================ */}
      {/*  HERO SECTION — Premium cinematic style                      */}
      {/* ============================================================ */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Background image with overlay */}
        <div className="absolute inset-0 bg-[#072a42]">
          <img src="/images/hero.jpg" alt="משפטלי - מאגר פסקי דין" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-l from-[#072a42]/90 via-[#0B3C5D]/80 to-[#0B3C5D]/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#072a42] via-transparent to-transparent opacity-60" />
        </div>

        {/* Animated geometric accents */}
        <div className="absolute top-20 left-20 w-72 h-72 rounded-full border border-[#C9A84C]/10 animate-rotate-slow" />
        <div className="absolute bottom-20 right-10 w-48 h-48 rounded-full border border-[#C9A84C]/8 animate-rotate-slow" style={{ animationDirection: 'reverse', animationDuration: '30s' }} />
        <div className="absolute top-1/3 right-1/4 w-4 h-4 bg-[#C9A84C]/30 rounded-full animate-float" />
        <div className="absolute top-2/3 left-1/3 w-3 h-3 bg-[#C9A84C]/20 rounded-full animate-float delay-500" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="max-w-3xl">
            {/* Gold accent line */}
            <div className="w-16 h-1 bg-gradient-to-l from-[#C9A84C] to-[#D4B85E] rounded-full mb-8 animate-draw-line" />

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-6 animate-fade-in-up">
              מאגר פסקי דין
              <br />
              <span className="text-gradient-gold">והחלטות משפטיות</span>
            </h1>

            <p className="text-lg sm:text-xl text-blue-100/70 leading-relaxed mb-10 max-w-2xl animate-fade-in-up delay-200">
              המאגר המשפטי המקיף ביותר בישראל. חיפוש מהיר ומדויק בעשרות אלפי
              פסקי דין מכל בתי המשפט, עם עדכון יומי אוטומטי מ-7 מקורות מידע.
            </p>

            {/* Search form */}
            <form
              onSubmit={handleSearch}
              className="flex flex-col sm:flex-row gap-3 mb-12 animate-fade-in-up delay-400"
            >
              <div className="relative flex-1">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="הקלד שם אדם, חברה, מספר תיק או מילת חיפוש"
                  className="w-full pr-12 pl-6 py-4.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white text-base placeholder:text-white/40 outline-none focus:border-[#C9A84C]/60 focus:bg-white/15 transition-all duration-300"
                />
              </div>
              <button
                type="submit"
                className="flex items-center justify-center gap-2 px-8 py-4.5 bg-gradient-to-l from-[#C9A84C] to-[#D4B85E] text-[#072a42] text-base font-bold rounded-xl shadow-lg shadow-[#C9A84C]/20 transition-all duration-300 hover:shadow-xl hover:shadow-[#C9A84C]/30 hover:-translate-y-0.5 active:translate-y-0"
              >
                <Search className="h-5 w-5" />
                חיפוש
              </button>
            </form>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-4 animate-fade-in delay-600">
              <div className="glass px-4 py-2 rounded-full text-xs text-white/60 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                עדכון יומי אוטומטי
              </div>
              <div className="glass px-4 py-2 rounded-full text-xs text-white/60">
                83,000+ פסקי דין במאגר
              </div>
              <div className="glass px-4 py-2 rounded-full text-xs text-white/60">
                חיפוש חינמי ומהיר
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  STATS SECTION — Floating cards                              */}
      {/* ============================================================ */}
      <section className="relative z-10 -mt-16 px-4 sm:px-6" ref={r1}>
        <div className="reveal mx-auto grid max-w-5xl grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="card-premium bg-white rounded-2xl p-6 text-center shadow-xl border border-gray-100"
              style={{ animationDelay: `${i * 120}ms` }}
            >
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-[#0B3C5D] to-[#1E5B8C] flex items-center justify-center">
                <stat.icon className="h-6 w-6 text-[#C9A84C]" strokeWidth={1.8} />
              </div>
              <span className="block text-2xl sm:text-3xl font-extrabold text-[#0B3C5D] stat-number">
                {stat.value}
              </span>
              <span className="text-sm text-gray-500">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/*  FEATURES SECTION — Image cards with overlay                 */}
      {/* ============================================================ */}
      <section className="px-4 py-24 sm:px-6" ref={r2}>
        <div className="reveal mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-[#C9A84C]/10 text-[#C9A84C] text-sm font-bold rounded-full mb-4">
              למה משפטלי?
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B3C5D] mb-4">
              הפלטפורמה המשפטית
              <span className="text-gradient-gold"> המתקדמת ביותר</span>
            </h2>
            <div className="divider-gold w-20 mx-auto mt-6" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className="card-premium group bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-[#0B3C5D]">
                  <img src={feature.image} alt={feature.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B3C5D]/80 via-[#0B3C5D]/30 to-transparent" />
                  <div className="absolute bottom-4 right-4 w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                    <feature.icon className="h-6 w-6 text-[#C9A84C]" strokeWidth={1.8} />
                  </div>
                </div>
                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#0B3C5D] mb-2 group-hover:text-[#C9A84C] transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-600">
                    {feature.description}
                  </p>
                  <div className="mt-4 flex items-center gap-1 text-[#C9A84C] text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                    <span>למידע נוסף</span>
                    <ChevronLeft className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  CATEGORIES SECTION — Dark section with gold accents         */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden" ref={r3}>
        <div className="reveal bg-gradient-to-l from-[#072a42] via-[#0B3C5D] to-[#0B3C5D] px-4 py-24 sm:px-6">
          {/* Decorative circles */}
          <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-[#C9A84C]/5 -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-[#C9A84C]/5 translate-x-1/3 translate-y-1/3" />

          <div className="relative mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 bg-[#C9A84C]/15 text-[#C9A84C] text-sm font-bold rounded-full mb-4">
                תחומי משפט
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
                חיפוש לפי <span className="text-gradient-gold">קטגוריה</span>
              </h2>
              <div className="divider-gold w-20 mx-auto mt-6 opacity-40" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((cat, i) => (
                <Link
                  key={cat.name}
                  href={`/search?procedureType=${cat.name}`}
                  className="group glass rounded-2xl p-5 text-center hover:bg-white/15 hover:border-[#C9A84C]/30 transition-all duration-400"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <cat.icon className="h-8 w-8 text-[#C9A84C] mx-auto mb-3 transition-transform duration-300 group-hover:scale-110" strokeWidth={1.5} />
                  <h3 className="text-white font-bold text-sm mb-1">{cat.name}</h3>
                  <span className="text-[#C9A84C]/70 text-xs">{cat.count}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  ABOUT SECTION — Why choose us                               */}
      {/* ============================================================ */}
      <section className="px-4 py-24 sm:px-6" ref={r4}>
        <div className="reveal mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Image side */}
            <div className="relative order-2 lg:order-1">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-[#0B3C5D]/20 bg-[#0B3C5D]">
                <img src="/images/about.jpg" alt="מאגר פסקי דין מקיף" className="w-full h-[400px] object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B3C5D]/40 to-transparent" />
              </div>
              <div className="absolute -top-4 -right-4 w-full h-full rounded-2xl border-2 border-[#C9A84C]/20 -z-10" />
            </div>

            {/* Text side */}
            <div className="order-1 lg:order-2">
              <span className="inline-block px-4 py-1.5 bg-[#C9A84C]/10 text-[#C9A84C] text-sm font-bold rounded-full mb-4">
                היתרונות שלנו
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B3C5D] mb-6 leading-tight">
                המאגר המשפטי
                <br />
                <span className="text-gradient-gold">המקיף בישראל</span>
              </h2>
              <p className="text-gray-600 leading-relaxed mb-8">
                משפטלי מציע גישה מהירה ונוחה לעשרות אלפי פסקי דין מכל
                בתי המשפט בישראל. חיפוש לפי שם, מספר תיק, בית משפט
                או מילות מפתח - עם תוצאות מדויקות תוך שניות.
              </p>

              <div className="space-y-4">
                {[
                  "חיפוש מהיר ומדויק לפי שם אדם או חברה",
                  "מאגר פסיקה עדכני ומקיף",
                  "סיווג לפי קטגוריה משפטית",
                  "שירות הסרת אזכורים מקצועי",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#C9A84C]/10 flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-[#C9A84C]" />
                    </div>
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  TESTIMONIAL / TRUST SECTION                                 */}
      {/* ============================================================ */}
      <section className="bg-white px-4 py-24 sm:px-6" ref={r5}>
        <div className="reveal mx-auto max-w-6xl">
          <div className="bg-gradient-to-l from-[#0B3C5D] to-[#072a42] rounded-3xl p-10 sm:p-16 relative overflow-hidden">
            {/* Gold decorative */}
            <div className="absolute top-0 left-0 w-48 h-48 bg-[#C9A84C]/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#C9A84C]/10 rounded-full translate-x-1/2 translate-y-1/2" />

            <div className="relative text-center">
              <Scale className="w-12 h-12 text-[#C9A84C] mx-auto mb-6" strokeWidth={1.2} />
              <blockquote className="text-2xl sm:text-3xl font-bold text-white leading-relaxed mb-8 max-w-3xl mx-auto">
                &ldquo;הצדק הוא אמת בפעולה&rdquo;
              </blockquote>
              <div className="divider-gold w-16 mx-auto mb-6 opacity-40" />
              <p className="text-blue-100/60 text-sm">
                משפטלי - הדרך הקלה ביותר לגשת למידע משפטי בישראל
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  CTA SECTION — Premium gold accent                           */}
      {/* ============================================================ */}
      <section className="px-4 py-24 sm:px-6" ref={r6}>
        <div className="reveal mx-auto max-w-4xl text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B3C5D] mb-6">
            מחפש פסק דין <span className="text-gradient-gold">ספציפי?</span>
          </h2>
          <p className="text-gray-600 mb-10 text-lg max-w-2xl mx-auto">
            צוות המומחים שלנו ישמח לעזור לך למצוא כל מסמך משפטי שאתה צריך.
            השירות שלנו מהיר, מקצועי ודיסקרטי.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/search"
              className="px-8 py-4 bg-gradient-to-l from-[#0B3C5D] to-[#1E5B8C] text-white text-base font-bold rounded-xl shadow-lg shadow-[#0B3C5D]/30 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2"
            >
              <Search className="h-5 w-5" />
              חיפוש במאגר
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 bg-white border-2 border-[#C9A84C] text-[#C9A84C] text-base font-bold rounded-xl transition-all duration-300 hover:bg-[#C9A84C] hover:text-white flex items-center gap-2"
            >
              <Phone className="h-5 w-5" />
              צור קשר
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
