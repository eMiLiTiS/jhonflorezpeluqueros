import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import ServicesPageClient from './ServicesPageClient'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })
  return {
    title: t('services_title'),
    description: t('services_desc'),
  }
}

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params
  return <ServicesPageClient locale={locale} />
}
