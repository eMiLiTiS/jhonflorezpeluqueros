import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import BookingPageClient from './BookingPageClient'

interface Props {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ service?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })
  return {
    title: t('booking_title'),
    description: t('booking_desc'),
  }
}

export default async function BookingPage({ params, searchParams }: Props) {
  const { locale } = await params
  const { service } = await searchParams
  return <BookingPageClient locale={locale} preselectedService={service} />
}
