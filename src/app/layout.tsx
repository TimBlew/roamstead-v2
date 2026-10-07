import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Roamstead - Modern Mountain Hospitality",
  robots: "noindex, nofollow",
  description: "Thoughtful mountain stays across Heber Valley and Park City, designed for the way people actually travel.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="base">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;500&family=Funnel+Sans:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Navigation />
        <main className="pt-12">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
