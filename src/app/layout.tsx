import type { Metadata } from 'next'
import './globals.css'
import { Navigation } from '@/components/layout/Navigation'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Roamstead - Modern Mountain Hospitality',
  description: 'A growing collection of places to stay in Heber Valley and the surrounding mountains. Each one is shaped by its setting and designed for the way people actually live while traveling.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-theme="base">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;500&family=Funnel+Sans:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Navigation />
        <main className="pt-12">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}