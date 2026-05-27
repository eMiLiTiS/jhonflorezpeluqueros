import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import FloatingContact from '@/components/common/FloatingContact'
import CookieBanner from '@/components/common/CookieBanner'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://jhonflorezpeluqueros.vercel.app'

interface LocaleLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })

  return {
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: `${BASE_URL}/${locale}`,
      languages: {
        'es': `${BASE_URL}/es`,
        'en': `${BASE_URL}/en`,
        'x-default': `${BASE_URL}/es`,
      },
    },
    title: {
      template: `%s | Jhon Florez Peluqueros`,
      default: t('home_title'),
    },
    description: t('home_desc'),
    openGraph: {
      type: 'website',
      locale: locale === 'es' ? 'es_ES' : 'en_GB',
      alternateLocale: locale === 'es' ? 'en_GB' : 'es_ES',
      siteName: 'Jhon Florez Peluqueros',
      images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Jhon Florez Peluqueros' }],
    },
  }
}

const localBusinessJsonLd = (locale: string) => ({
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'HairSalon'],
  '@id': `${BASE_URL}/${locale}#business`,
  name: 'Jhon Florez Peluqueros',
  description: locale === 'es'
    ? 'Peluquería profesional a domicilio en la provincia de Valencia. Cortes, coloración, mechas, keratina, maquillaje y más.'
    : 'Professional home hairdressing service across Valencia province. Haircuts, colour, highlights, keratin, makeup and more.',
  url: `${BASE_URL}/${locale}`,
  telephone: '+34641093550',
  email: 'jhonarnulfa1402@gmail.com',
  address: {
    '@type': 'PostalAddress',
    addressRegion: 'Valencia',
    addressCountry: 'ES',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 39.4699,
    longitude: -0.3763,
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: '09:00',
    closes: '21:00',
  },
  priceRange: '€–€€',
  currenciesAccepted: 'EUR',
  paymentAccepted: 'Cash, Bank Transfer',
  areaServed: {
    '@type': 'AdministrativeArea',
    name: locale === 'es' ? 'Provincia de Valencia' : 'Valencia Province',
  },
  image: `${BASE_URL}/images/logo-jf3.png`,
  sameAs: [],
})

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params

  if (!routing.locales.includes(locale as 'es' | 'en')) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd(locale)) }}
      />

      {/* Skip navigation for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-gold focus:text-obsidian-800 focus:rounded-lg focus:font-medium focus:text-sm focus:outline-none"
      >
        {locale === 'es' ? 'Saltar al contenido' : 'Skip to content'}
      </a>

      <Navbar />

      <main id="main-content" className="min-h-screen">
        {children}
      </main>

      <Footer />
      <FloatingContact />
      <CookieBanner />
    </NextIntlClientProvider>
  )
}
