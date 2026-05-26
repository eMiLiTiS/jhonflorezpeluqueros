'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CalendarDays, Clock, CheckCircle2, XCircle, AlertCircle,
  LogOut, X, Phone, Mail, FileText, Filter
} from 'lucide-react'
import { cn, formatDate, formatTime } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import type { Booking, BookingStatus, DashboardStats } from '@/types'

interface Props {
  bookings: Booking[]
  locale: string
  userEmail: string
}

function StatusBadge({ status }: { status: BookingStatus }) {
  const t = useTranslations('admin')
  const map = {
    pending: { label: t('status_pending'), cls: 'badge-pending', icon: AlertCircle },
    confirmed: { label: t('status_confirmed'), cls: 'badge-confirmed', icon: CheckCircle2 },
    cancelled: { label: t('status_cancelled'), cls: 'badge-cancelled', icon: XCircle },
  }
  const { label, cls, icon: Icon } = map[status]
  return (
    <span className={cn('flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium', cls)}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  )
}

export default function AdminDashboardClient({ bookings: initial, locale, userEmail }: Props) {
  const t = useTranslations('admin')
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>(initial)
  const [filter, setFilter] = useState<BookingStatus | 'all'>('all')
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isPending, startTransition] = useTransition()

  const stats: DashboardStats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  }

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter)

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push(`/${locale}/admin/login`)
  }

  async function updateStatus(id: string, status: BookingStatus) {
    const supabase = createClient()
    const { error } = await supabase
      .from('bookings')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (!error) {
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b))
      if (selectedBooking?.id === id) {
        setSelectedBooking(prev => prev ? { ...prev, status } : null)
      }

      // Send email notification
      try {
        const booking = bookings.find(b => b.id === id)
        if (booking) {
          const { sendBookingConfirmed, sendBookingCancelled } = await import('@/lib/emailjs')
          if (status === 'confirmed') await sendBookingConfirmed(booking)
          if (status === 'cancelled') await sendBookingCancelled(booking)
        }
      } catch {
        // Email failure is non-critical
      }
    }
  }

  const STATS_CARDS = [
    { label: t('stats_total'), value: stats.total, icon: CalendarDays, color: 'text-white' },
    { label: t('stats_pending'), value: stats.pending, icon: AlertCircle, color: 'text-yellow-400' },
    { label: t('stats_confirmed'), value: stats.confirmed, icon: CheckCircle2, color: 'text-green-400' },
    { label: t('stats_cancelled'), value: stats.cancelled, icon: XCircle, color: 'text-red-400' },
  ]

  return (
    <div className="min-h-screen bg-obsidian-800">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-obsidian-700/90 backdrop-blur-xl border-b border-gold/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo-jf3.png" alt="JF" width={36} height={36} className="object-contain" />
            <h1 className="font-display text-xl text-white">{t('dashboard_title')}</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:block text-xs text-muted">{userEmail}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-red-500/30 transition-all text-sm"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:block">{t('logout')}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {STATS_CARDS.map(({ label, value, icon: Icon, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="glass-card rounded-xl p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <Icon className={cn('w-5 h-5', color)} />
              </div>
              <p className={cn('text-3xl font-bold font-display', color)}>{value}</p>
              <p className="text-muted text-xs mt-1">{label}</p>
            </motion.div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
          <Filter className="w-4 h-4 text-muted flex-shrink-0" />
          {(['all', 'pending', 'confirmed', 'cancelled'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0',
                filter === f
                  ? 'bg-gold text-obsidian-800'
                  : 'bg-white/5 border border-white/10 text-white/60 hover:text-white'
              )}
            >
              {t(`filter_${f}` as 'filter_all' | 'filter_pending' | 'filter_confirmed' | 'filter_cancelled')}
              <span className="ml-2 text-xs opacity-70">
                ({f === 'all' ? bookings.length : bookings.filter(b => b.status === f).length})
              </span>
            </button>
          ))}
        </div>

        {/* Bookings table */}
        {filtered.length === 0 ? (
          <div className="glass-card rounded-2xl p-16 text-center">
            <p className="text-muted">{t('no_bookings')}</p>
          </div>
        ) : (
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    {[t('table_customer'), t('table_service'), t('table_date'), t('table_time'), t('table_status'), t('table_actions')].map(h => (
                      <th key={h} className="text-left px-4 py-3.5 text-xs text-muted uppercase tracking-wide font-medium whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((booking, i) => (
                    <motion.tr
                      key={booking.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-white/5 hover:bg-white/2 transition-colors"
                    >
                      <td className="px-4 py-4">
                        <p className="text-white text-sm font-medium">{booking.customer_name}</p>
                        <p className="text-muted text-xs">{booking.customer_email}</p>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-white/80 text-sm">{booking.service_name}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-white/80 text-sm">{booking.preferred_date}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-white/80 text-sm">{formatTime(booking.preferred_time)}</span>
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge status={booking.status} />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedBooking(booking)}
                            className="text-xs px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-gold/30 transition-all"
                          >
                            {t('action_view')}
                          </button>
                          {booking.status === 'pending' && (
                            <>
                              <button
                                onClick={() => updateStatus(booking.id, 'confirmed')}
                                className="text-xs px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 transition-all"
                              >
                                {t('action_confirm')}
                              </button>
                              <button
                                onClick={() => updateStatus(booking.id, 'cancelled')}
                                className="text-xs px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all"
                              >
                                {t('action_cancel')}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Detail modal */}
      <AnimatePresence>
        {selectedBooking && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
              onClick={() => setSelectedBooking(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="bg-obsidian-700 border border-gold/15 rounded-2xl p-8 w-full max-w-lg pointer-events-auto shadow-[0_24px_80px_rgba(0,0,0,0.8)]">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-2xl text-white">{t('detail_title')}</h2>
                  <button
                    onClick={() => setSelectedBooking(null)}
                    className="text-muted hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Status */}
                <div className="mb-6">
                  <StatusBadge status={selectedBooking.status} />
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[
                    { label: t('table_customer'), value: selectedBooking.customer_name },
                    { label: t('table_service'), value: selectedBooking.service_name },
                    { label: t('table_date'), value: selectedBooking.preferred_date },
                    { label: t('table_time'), value: formatTime(selectedBooking.preferred_time) },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-xs text-muted mb-1">{label}</p>
                      <p className="text-white text-sm font-medium">{value}</p>
                    </div>
                  ))}
                </div>

                {/* Contact */}
                <div className="space-y-2 mb-6 pb-6 border-b border-white/5">
                  <a
                    href={`tel:${selectedBooking.customer_phone}`}
                    className="flex items-center gap-3 p-3 rounded-lg bg-white/3 hover:bg-white/5 transition-colors"
                  >
                    <Phone className="w-4 h-4 text-gold" />
                    <span className="text-sm text-white/80">{selectedBooking.customer_phone}</span>
                  </a>
                  <a
                    href={`mailto:${selectedBooking.customer_email}`}
                    className="flex items-center gap-3 p-3 rounded-lg bg-white/3 hover:bg-white/5 transition-colors"
                  >
                    <Mail className="w-4 h-4 text-gold" />
                    <span className="text-sm text-white/80">{selectedBooking.customer_email}</span>
                  </a>
                </div>

                {/* Notes */}
                {selectedBooking.notes && (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-gold/60" />
                      <p className="text-xs text-muted">{t('detail_notes')}</p>
                    </div>
                    <p className="text-white/70 text-sm leading-relaxed bg-white/3 rounded-lg p-3">
                      {selectedBooking.notes}
                    </p>
                  </div>
                )}

                {/* Actions */}
                {selectedBooking.status === 'pending' && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => updateStatus(selectedBooking.id, 'confirmed')}
                      className="flex-1 py-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 text-sm font-medium transition-all"
                    >
                      {t('action_confirm')}
                    </button>
                    <button
                      onClick={() => updateStatus(selectedBooking.id, 'cancelled')}
                      className="flex-1 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 text-sm font-medium transition-all"
                    >
                      {t('action_cancel')}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
