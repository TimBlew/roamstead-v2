import localFont from "next/font/local";
import type { Metadata } from "next";
import { PublicAnalytics } from "@/components/analytics/PublicAnalytics";
import "./globals.css";
import { siteUrl, launchIndexingEnabled, socialImage, googleSiteVerification } from "@/lib/site";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";

const headingFont = localFont({
  src: [
    { path: "./fonts/bricolage-grotesque/vietnamese.woff2", weight: "400 500", style: "normal" },
    { path: "./fonts/bricolage-grotesque/latin-ext.woff2", weight: "400 500", style: "normal" },
    { path: "./fonts/bricolage-grotesque/latin.woff2", weight: "400 500", style: "normal" },
  ],
  display: "swap", variable: "--font-bricolage", fallback: ["sans-serif"], adjustFontFallback: false,
});
const bodyFont = localFont({
  src: [
    { path: "./fonts/funnel-sans/latin-ext.woff2", weight: "400 500", style: "normal" },
    { path: "./fonts/funnel-sans/latin.woff2", weight: "400 500", style: "normal" },
  ],
  display: "swap", variable: "--font-funnel", fallback: ["sans-serif"], adjustFontFallback: false,
});

const googleVerification = googleSiteVerification();

export const metadata: Metadata = {
  metadataBase: siteUrl,
  openGraph: { images: [socialImage] },
  twitter: { card: "summary_large_image", images: [socialImage] },
  alternates: { canonical: "/" },
  title: "Roamstead Collective | Wasatch Back stays in Midway & Park City",
  robots: { index: launchIndexingEnabled, follow: launchIndexingEnabled },
  description: "Homes across Utah's Wasatch Back, from Heber Valley to Park City. Ski, ride, float, then settle in. Book direct with Roamstead Collective.",
  ...(googleVerification ? { verification: { google: googleVerification } } : {}),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="base" className={`${headingFont.variable} ${bodyFont.variable}`}>
      <head>
        <link rel="icon" href="/favicon.svg?v=2" type="image/svg+xml" sizes="any" />
      </head>
      <body>
        <PublicAnalytics />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebSite", name: "Roamstead Collective", url: siteUrl.toString() }).replace(/</g, "\\u003c") }} />
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-[16px] focus:top-[8px] focus:z-[100] focus:rounded-[8px] focus:bg-[#FFFCFB] focus:px-[16px] focus:py-[12px] focus:text-[#1F3125]">Skip to content</a>
        <Navigation />
        <main id="main-content" tabIndex={-1} className="pt-[52px]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
