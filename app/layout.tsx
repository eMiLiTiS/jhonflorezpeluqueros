import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://jhonflorezpeluqueros.vercel.app'),
  title: {
    template: '%s | Jhon Florez Peluqueros',
    default: 'Jhon Florez Peluqueros — Peluquería a domicilio en Valencia',
  },
  description: 'Peluquería profesional a domicilio en la provincia de Valencia. Cortes, coloración, mechas, keratina, maquillaje y más. Reserva online.',
  keywords: ['peluquería Valencia', 'peluquero a domicilio Valencia', 'corte de cabello Valencia', 'maquillaje novias Valencia', 'Jhon Florez'],
  authors: [{ name: 'Jhon Florez Peluqueros' }],
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    alternateLocale: 'en_GB',
    siteName: 'Jhon Florez Peluqueros',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="bg-obsidian-800 text-white antialiased">
        {children}
      </body>
    </html>
  )
}
