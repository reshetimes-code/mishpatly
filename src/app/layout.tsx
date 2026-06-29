import type { Metadata } from "next";
import { Suspense } from "react";
import { Heebo } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import TopLoader from "@/components/TopLoader";

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  variable: "--font-heebo",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mishpatly.co.il"),
  title: {
    default: "משפט לי - משפטלי | מאגר פסקי דין וחיפוש לפי שם | חיפוש פסקי דין חינם",
    template: "%s | משפט לי - משפטלי | מאגר פסקי דין",
  },
  description:
    "משפטלי - משפט לי - מאגר פסקי דין מהרשות השופטת. חיפוש פסקי דין לפי שם אדם, חברה או מספר תיק מכל בתי המשפט בישראל - פלילי, אזרחי, עבודה, משפחה ומנהלי. הסרת אזכורים משפטיים. חיפוש חינמי.",
  keywords: [
    "משפטלי",
    "משפט לי",
    "משפטלי משפט לי",
    "משפטלי מאגר פסקי דין",
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
    google: "googled258063ce988c4c4",
  },
  openGraph: {
    type: "website",
    locale: "he_IL",
    siteName: "משפט לי - משפטלי",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "משפט לי - משפטלי - מאגר פסקי דין" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "משפטלי - משפט לי | מאגר פסקי דין - חיפוש לפי שם",
    description:
      "משפטלי (משפט לי) - חיפוש פסקי דין לפי שם מכל בתי המשפט בישראל. הסרת אזכורים משפטיים.",
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
  // ensureHydrated removed - data comes only from GOV.IL daily import
  return (
    <html lang="he" dir="rtl" className={`${heebo.variable} antialiased`}>
      <body className="min-h-screen flex flex-col font-[var(--font-heebo)] bg-legal-bg text-legal-text">
        {/* Organization + WebSite + FAQ Schema for Google */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": ["Organization", "LegalService"],
              "@id": "https://mishpatly.co.il/#organization",
              "name": "משפט לי - משפטלי",
              "alternateName": ["משפט לי", "משפטלי", "Mishpatly", "mishpatly", "משפטלי - מאגר פסקי דין", "mishpat li"],
              "url": "https://mishpatly.co.il",
              "logo": {
                "@type": "ImageObject",
                "url": "https://mishpatly.co.il/logo.png",
                "width": 200,
                "height": 200
              },
              "image": "https://mishpatly.co.il/logo.png",
              "description": "משפטלי - המאגר המשפטי הגדול בישראל. חיפוש פסקי דין לפי שם אדם, חברה או מספר תיק מכל בתי המשפט. הסרת אזכורים משפטיים.",
              "foundingDate": "2025",
              "numberOfEmployees": { "@type": "QuantitativeValue", "value": "5" },
              "knowsAbout": ["פסקי דין", "משפט ישראלי", "הסרת אזכורים", "מאגר פסיקה", "חיפוש משפטי"],
              "slogan": "המאגר המשפטי הגדול בישראל",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+972-50-722-9966",
                "email": "telaviv2u@gmail.com",
                "contactType": "customer service",
                "availableLanguage": ["Hebrew", "English"]
              },
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "דרך חיפה 19",
                "addressLocality": "קרית אתא",
                "addressRegion": "חיפה",
                "postalCode": "2840000",
                "addressCountry": "IL"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 32.8095,
                "longitude": 35.1064
              },
              "areaServed": {
                "@type": "Country",
                "name": "Israel"
              },
              "serviceArea": {
                "@type": "Country",
                "name": "Israel"
              },
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "שירותי משפטלי",
                "itemListElement": [
                  { "@type": "Offer", "name": "חיפוש פסקי דין לפי שם", "itemOffered": { "@type": "Service", "name": "חיפוש פסקי דין לפי שם", "description": "חיפוש חינמי במאגר פסקי דין מהרשות השופטת" } },
                  { "@type": "Offer", "name": "הסרת אזכורים משפטיים", "itemOffered": { "@type": "Service", "name": "הסרת אזכורים משפטיים", "description": "שירות הסרת אזכורים ממנועי חיפוש" } },
                  { "@type": "Offer", "name": "פורטל עורכי דין", "itemOffered": { "@type": "Service", "name": "פורטל עורכי דין", "description": "מאגר עורכי דין לפי התמחות ואזור" } }
                ]
              },
              "sameAs": [
                "https://mishpatly.co.il"
              ]
            },
            {
              "@type": "WebSite",
              "@id": "https://mishpatly.co.il/#website",
              "name": "משפט לי - משפטלי",
              "alternateName": ["משפט לי", "משפטלי", "Mishpatly", "mishpat li", "משפטלי - מאגר פסקי דין"],
              "url": "https://mishpatly.co.il",
              "publisher": { "@id": "https://mishpatly.co.il/#organization" },
              "inLanguage": "he",
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://mishpatly.co.il/search?q={search_term_string}"
                },
                "query-input": "required name=search_term_string"
              }
            },
            {
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "מה זה משפט לי?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "משפט לי (משפטלי) הוא מאגר פסקי הדין הגדול בישראל. האתר מאפשר חיפוש חינמי של פסקי דין לפי שם אדם, חברה, שופט או מספר תיק - מכל בתי המשפט בישראל. הכתובת: mishpatly.co.il. משפט לי אינו קשור למשפט Lie המתמטי - מדובר בפלטפורמה משפטית-ציבורית ישראלית."
                  }
                },
                {
                  "@type": "Question",
                  "name": "מה ההבדל בין משפטלי למשפט לי?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "משפטלי ומשפט לי הם שני שמות לאותה פלטפורמה: mishpatly.co.il. השם 'משפט לי' מתאר את הרעיון שכל אזרח יכול לחפש פסקי דין הנוגעים אליו. האתר מציע חיפוש חינמי של פסקי דין מהרשות השופטת, הסרת אזכורים משפטיים ופורטל עורכי דין."
                  }
                },
                {
                  "@type": "Question",
                  "name": "איך מחפשים פסק דין לפי שם?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "באתר משפטלי ניתן לחפש פסקי דין לפי שם אדם, שם חברה, מספר תיק או מילות מפתח. פשוט הקלידו את השם בשדה החיפוש ותקבלו את כל פסקי הדין הרלוונטיים מכל בתי המשפט בישראל."
                  }
                },
                {
                  "@type": "Question",
                  "name": "איך מסירים אזכור משפטי מגוגל?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "ניתן להגיש בקשת הסרת אזכור משפטי דרך אתר משפטלי. הגישו בקשה עם פרטי פסק הדין, שמכם המלא ומסמכים מזהים. הבקשה תיבדק ותטופל בהתאם לזכות להישכח ולחוק הגנת הפרטיות."
                  }
                },
                {
                  "@type": "Question",
                  "name": "מה כולל מאגר פסקי הדין של משפטלי?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "מאגר משפטלי כולל פסקי דין מהרשות השופטת, כולל בית המשפט העליון, בתי המשפט המחוזיים, בתי משפט השלום, בתי הדין לעבודה ועוד. המאגר מתעדכן באופן יומי אוטומטי."
                  }
                },
                {
                  "@type": "Question",
                  "name": "האם חיפוש פסקי דין במשפטלי הוא חינמי?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "כן, חיפוש פסקי דין במאגר משפטלי הוא חינמי לחלוטין. ניתן לחפש ולצפות בתקציר של כל פסק דין ללא עלות. לצפייה במסמך המלא ניתן לרכוש את המסמך."
                  }
                },
                {
                  "@type": "Question",
                  "name": "איך מוצאים עורך דין מתאים?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "בפורטל עורכי הדין של משפטלי ניתן לחפש עורכי דין לפי תחום התמחות, עיר ודירוג לקוחות. כל עורך דין בפורטל מציג את תחומי ההתמחות, ניסיון, חוות דעת לקוחות ופרטי התקשרות."
                  }
                },
                {
                  "@type": "Question",
                  "name": "איך מחפשים פסק דין לפי שם שופט?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "באתר משפטלי ניתן לחפש פסקי דין לפי שם שופט/ת. השתמשו בחיפוש המתקדם ובחרו את שם השופט/ת מתוך רשימת השופטים. תוכלו לצפות בכל פסקי הדין וההחלטות של השופט/ת המבוקש/ת."
                  }
                },
                {
                  "@type": "Question",
                  "name": "מה ההבדל בין פסק דין להחלטה?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "פסק דין הוא ההחלטה הסופית של בית המשפט המסיימת את ההליך המשפטי. החלטה היא הכרעה של בית המשפט בנושא ביניים במהלך ההליך, כגון החלטה על ביניים, צו זמני או החלטה בבקשה."
                  }
                },
                {
                  "@type": "Question",
                  "name": "איך מחפשים פסקי דין לפי מספר תיק?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "הקלידו את מספר התיק בשדה החיפוש של משפטלי. המערכת תחפש את מספר התיק בכל בתי המשפט ותציג את כל פסקי הדין וההחלטות הקשורים לתיק זה."
                  }
                }
              ]
            }
          ]
        }) }} />
        <Suspense fallback={null}><TopLoader /></Suspense>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <AccessibilityWidget />
      </body>
    </html>
  );
}
