import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "صيدلية د. إسلام | دليلك للأدوية والرعاية الصحية بالتجمع الثالث",
  description: "اطلب أدويتك ومستلزماتك الطبية عبر الإنترنت من صيدلية د. إسلام بالتجمع الثالث. نوفر خدمة الطلب السريع والآمن عبر واتساب، وتجهيز الروشتة فوراً، والتوصيل بجوار نادي التجمع هايتس و GUC.",
  keywords: "صيدلية، صيدلية د. إسلام، أدوية، روشتة، مستحضرات تجميل، رعاية صحية، التجمع الثالث، صيدلية أونلاين، القاهرة الجديدة، نادي التجمع هايتس، GUC، توصيل أدوية بالتجمع، واتساب صيدلية",
  openGraph: {
    title: "صيدلية د. إسلام | دليلك للأدوية والرعاية الصحية بالتجمع الثالث",
    description: "اطلب أدويتك ومستلزماتك الطبية عبر الإنترنت مع خدمة التوصيل السريع وتجهيز الروشتة من صيدلية د. إسلام بالتجمع الثالث.",
    locale: "ar_EG",
    type: "website",
    siteName: "صيدلية د. إسلام",
  },
  twitter: {
    card: "summary_large_image",
    title: "صيدلية د. إسلام",
    description: "اطلب أدويتك ومستلزماتك الطبية عبر الإنترنت مع خدمة التوصيل السريع في التجمع الثالث من صيدلية د. إسلام.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Pharmacy",
    "name": "صيدلية د. إسلام - Dr. Eslam's Pharmacy",
    "image": "/logo.png",
    "@id": "https://dr-eslam-pharmacy.vercel.app/#pharmacy",
    "url": "https://dr-eslam-pharmacy.vercel.app",
    "telephone": "+201068359667",
    "priceRange": "EGP",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "التجمع الثالث - بجوار نادي التجمع هايتس و GUC",
      "addressLocality": "القاهرة الجديدة",
      "addressRegion": "القاهرة",
      "postalCode": "11835",
      "addressCountry": "EG"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 29.9829375,
      "longitude": 31.4441094
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "00:00",
      "closes": "23:59"
    },
    "sameAs": [
      "https://www.facebook.com",
      "https://wa.me/201068359667"
    ]
  };

  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable}`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-brand-bg text-gray-800 antialiased min-h-screen font-cairo" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
