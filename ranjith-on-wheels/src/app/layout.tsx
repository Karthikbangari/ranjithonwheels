import type { Metadata } from "next";
import { Fraunces, Manrope, Geist_Mono } from "next/font/google";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SkipLink } from "@/components/layout/SkipLink";
import { site, siteUrl } from "@/content/site";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT"],
  style: ["normal", "italic"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const description = `${site.traveller} has cycled ${site.distanceKm.toLocaleString()}+ kilometres across ${site.countryCount} countries. Follow the journey that continues from ${site.latestCountry}.`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${site.name} - ${site.message}`,
    template: `%s - ${site.name}`,
  },
  description,
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} - ${site.message}`,
    description,
    images: [{ url: "/media/hero/open-road.jpg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} - ${site.message}`,
    description,
    images: ["/media/hero/open-road.jpg"],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      name: site.traveller,
      alternateName: site.name,
      description,
      url: siteUrl,
    },
    {
      "@type": "WebSite",
      name: site.name,
      url: siteUrl,
    },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fraunces.variable} ${manrope.variable} ${geistMono.variable}`}>
      <body>
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
      </body>
    </html>
  );
}
