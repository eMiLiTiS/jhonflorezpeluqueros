import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import Hero from '@/components/sections/Hero'
import Services from '@/components/sections/Services'
import About from '@/components/sections/About'
import HowItWorks from '@/components/sections/HowItWorks'
import BookingCTA from '@/components/sections/BookingCTA'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })
  return {
    title: t('home_title'),
    description: t('home_desc'),
    alternates: {
      canonical: `/${locale}`,
      languages: { es: '/es', en: '/en' },
    },
  }
}

export default async function HomePage({ params }: Props) {
  await params // ensure locale is resolved
  return (
    <>
      <Hero />
      <div className="divider-gold mx-8 my-4" />
      <Services />
      <div className="divider-gold mx-8" />
      <About />
      <div className="divider-gold mx-8" />
      <HowItWorks />
      <BookingCTA />
    </>
  )
}
