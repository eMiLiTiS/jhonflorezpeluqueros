import { getTranslations } from 'next-intl/server'
import LegalPage from '@/components/common/LegalPage'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'legal' })
  return <LegalPage title={t('privacy_title')} body={t('privacy_body')} />
}
