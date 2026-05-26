import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminDashboardClient from './AdminDashboardClient'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function AdminDashboardPage({ params }: Props) {
  const { locale } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect(`/${locale}/admin/login`)
  }

  const { data: bookings } = await supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false })

  return <AdminDashboardClient bookings={bookings ?? []} locale={locale} userEmail={user.email ?? ''} />
}
