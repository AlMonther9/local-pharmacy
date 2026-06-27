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
  title: "صيدلية المنذر | دليلك للأدوية والرعاية الصحية بمصر",
  description: "اطلب أدويتك ومستلزماتك الطبية عبر الإنترنت من صيدلية المنذر. نوفر خدمة الطلب السريع والآمن عبر واتساب، وتجهيز الروشتة فوراً، وتغطية كاملة لاحتياجاتك الصحية في مصر بأسعار معتمدة.",
  keywords: "صيدلية، صيدلية المنذر، أدوية، روشتة، مستحضرات تجميل، رعاية صحية، مصر، صيدلية أونلاين، التجمع الخامس، بنادول، توصيل أدوية، واتساب صيدلية",
  openGraph: {
    title: "صيدلية المنذر | دليلك للأدوية والرعاية الصحية بمصر",
    description: "اطلب أدويتك ومستلزماتك الطبية عبر الإنترنت مع خدمة التوصيل السريع وتجهيز الروشتة من صيدلية المنذر عبر واتساب.",
    locale: "ar_EG",
    type: "website",
    siteName: "صيدلية المنذر",
  },
  twitter: {
    card: "summary_large_image",
    title: "صيدلية المنذر",
    description: "اطلب أدويتك ومستلزماتك الطبية عبر الإنترنت مع خدمة التوصيل السريع في مصر من صيدلية المنذر.",
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
    "name": "صيدلية المنذر - AlMonther Pharmacy",
    "image": "/logo.png",
    "@id": "https://egypt-pharmacy.vercel.app/#pharmacy",
    "url": "https://egypt-pharmacy.vercel.app",
    "telephone": "+201068359667",
    "priceRange": "EGP",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "شارع التسعين الشمالي، التجمع الخامس",
      "addressLocality": "القاهرة",
      "addressRegion": "القاهرة",
      "postalCode": "11835",
      "addressCountry": "EG"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 30.0264,
      "longitude": 31.4886
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
