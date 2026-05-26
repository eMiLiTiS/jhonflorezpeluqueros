import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import { motion } from 'framer-motion'
import AboutPageClient from './AboutPageClient'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })
  return {
    title: t('about_title'),
    description: t('about_desc'),
  }
}

export default function AboutPage() {
  return <AboutPageClient />
}
