import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import LegalPage from '@/components/common/LegalPage'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'legal' })
  return { title: t('legal_title') }
}

export default async function LegalNoticePage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'legal' })
  return <LegalPage title={t('legal_title')} body={t('legal_body')} />
}
