import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import ContactPageClient from './ContactPageClient'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })
  return {
    title: t('contact_title'),
    description: t('contact_desc'),
  }
}

export default function ContactPage() {
  return <ContactPageClient />
}
