import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import { ensureHydrated } from "@/lib/judgment-store";

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  variable: "--font-heebo",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mishpatly.co.il"),
  title: {
    default: "משפטלי - מאגר פסקי דין והחלטות משפטיות | משפט לי | חיפוש פסקי דין",
    template: "%s | משפטלי - משפט לי",
  },
  description:
    "משפטלי (משפט לי) - מאגר פסקי דין מקיף לחיפוש לפי שם אדם, חברה או מספר תיק. פסקי דין פליליים, אזרחיים, עבודה, משפחה ומנהליים מכל בתי המשפט בישראל. הסרת אזכורים משפטיים מגוגל. חיפוש חינמי במאגר פסיקה עדכני.",
  keywords: [
    "משפטלי",
    "משפט לי",
    "mishpatly",
    "פסקי דין",
    "מאגר פסקי דין",
    "חיפוש פסקי דין",
    "פסק דין",
    "חיפוש פסק דין לפי שם",
    "פסקי דין לפי שם",
    "בדיקת פסקי דין לפי שם",
    "חיפוש שם בפסקי דין",
    "הסרת אזכורים משפטיים",
    "הסרת פסק דין מגוגל",
    "מחיקת פסק דין",
    "הסרת שם מפסק דין",
    "הסרת אזכור משפטי",
    "מאגר משפטי",
    "החלטות משפטיות",
    "משפט פלילי",
    "פסק דין פלילי",
    "פסקי דין פליליים",
    "בית משפט",
    "בית משפט השלום",
    "בית המשפט המחוזי",
    "בית המשפט העליון",
    "בית הדין לעבודה",
    "פסיקה ישראלית",
    "מאגר פסיקה",
    "פסקי דין חינם",
    "חיפוש משפטי",
    "זכות להישכח",
    "נזיקין",
    "חוזים",
    "מקרקעין",
    "דיני משפחה",
    "דיני עבודה",
    "פלילי",
    "אזרחי",
    "מנהלי",
    "פסקי דין לפי שם",
    "חיפוש שם בפסקי דין",
    "פסקי דין נגד",
    "בדיקת רקע משפטי",
    "מאגר פסקי דין חינם",
    "פסקי דין חינם באינטרנט",
    "פסקי דין לפי שם נתבע",
  ],
  authors: [{ name: "משפטלי" }],
  creator: "משפטלי",
  publisher: "משפטלי",
  alternates: {
    canonical: "https://mishpatly.co.il",
  },
  verification: {
    google: "GOOGLE_SEARCH_CONSOLE_VERIFICATION_CODE",
  },
  openGraph: {
    type: "website",
    locale: "he_IL",
    url: "https://mishpatly.co.il",
    siteName: "משפטלי - משפט לי",
    title: "משפטלי - מאגר פסקי דין והחלטות משפטיות | משפט לי",
    description:
      "משפטלי (משפט לי) - מאגר פסקי דין מקיף לחיפוש לפי שם. פסקי דין פליליים, אזרחיים ועוד מכל בתי המשפט בישראל.",
    images: [{ url: "/logo.png", width: 200, height: 200, alt: "משפטלי - משפט לי - מאגר פסקי דין" }],
  },
  twitter: {
    card: "summary",
    title: "משפטלי - משפט לי | מאגר פסקי דין",
    description:
      "חיפוש פסקי דין לפי שם מכל בתי המשפט בישראל. משפט פלילי, אזרחי, עבודה. הסרת אזכורים.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Auto-hydrate judgment store from scrapers if empty (after deploy/restart)
  ensureHydrated();
  return (
    <html lang="he" dir="rtl" className={`${heebo.variable} antialiased`}>
      <body className="min-h-screen flex flex-col font-[var(--font-heebo)] bg-legal-bg text-legal-text">
        {/* Organization + WebSite Schema for Google */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": "https://mishpatly.co.il/#organization",
              "name": "משפטלי",
              "alternateName": ["משפט לי", "Mishpatly", "mishpatly"],
              "url": "https://mishpatly.co.il",
              "logo": "https://mishpatly.co.il/logo.png",
              "description": "משפטלי - מאגר פסקי דין מקיף לחיפוש לפי שם אדם, חברה או מספר תיק מכל בתי המשפט בישראל",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+972-50-722-9966",
                "email": "telaviv2u@gmail.com",
                "contactType": "customer service",
                "availableLanguage": "Hebrew"
              },
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "IL",
                "addressRegion": "ישראל"
              },
              "areaServed": {
                "@type": "Country",
                "name": "Israel"
              },
              "serviceArea": {
                "@type": "Country",
                "name": "Israel"
              }
            },
            {
              "@type": "WebSite",
              "@id": "https://mishpatly.co.il/#website",
              "name": "משפטלי - משפט לי",
              "alternateName": "משפט לי",
              "url": "https://mishpatly.co.il",
              "publisher": { "@id": "https://mishpatly.co.il/#organization" },
              "inLanguage": "he",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://mishpatly.co.il/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            }
          ]
        }) }} />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <AccessibilityWidget />
      </body>
    </html>
  );
}
