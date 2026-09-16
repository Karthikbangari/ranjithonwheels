import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SkipLink } from "@/components/layout/SkipLink";
import { ReducedMotionProvider } from "@/components/motion/ReducedMotionProvider";
import { siteContent, siteUrl } from "@/content/site";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const description = `${siteContent.personName} has cycled ${siteContent.distanceKm.toLocaleString()}${siteContent.distanceSuffix} kilometres across ${siteContent.countryCount} countries. Follow the journey that continues from ${siteContent.currentCountry}.`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteContent.name} - ${siteContent.message}`,
    template: `%s - ${siteContent.name}`,
  },
  description,
  openGraph: {
    type: "website",
    siteName: siteContent.name,
    title: `${siteContent.name} - ${siteContent.message}`,
    description,
    images: [{ url: "/media/hero/open-road.jpg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteContent.name} - ${siteContent.message}`,
    description,
    images: ["/media/hero/open-road.jpg"],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      name: siteContent.personName,
      alternateName: siteContent.name,
      description,
      url: siteUrl,
    },
    {
      "@type": "WebSite",
      name: siteContent.name,
      url: siteUrl,
    },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body>
        <ReducedMotionProvider>
          <SkipLink />
          <SiteHeader />
          <main id="main-content" tabIndex={-1}>
            {children}
          </main>
          <SiteFooter />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          />
        </ReducedMotionProvider>
      </body>
    </html>
  );
}
