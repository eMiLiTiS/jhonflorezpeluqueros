'use client'

import { useState, useEffect, useCallback, useTransition } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CalendarDays, Clock, CheckCircle2, XCircle, AlertCircle,
  LogOut, X, Phone, Mail, FileText, Filter, Search,
  Download, RefreshCw, StickyNote, Wifi, WifiOff,
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
  const map: Record<BookingStatus, { label: string; cls: string; Icon: typeof AlertCircle }> = {
    pending: { label: t('status_pending'), cls: 'badge-pending', Icon: AlertCircle },
    confirmed: { label: t('status_confirmed'), cls: 'badge-confirmed', Icon: CheckCircle2 },
    cancelled: { label: t('status_cancelled'), cls: 'badge-cancelled', Icon: XCircle },
  }
  const { label, cls, Icon } = map[status]
  return (
    <span className={cn('flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium', cls)}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  )
}

function ConfirmDialog({
  message,
  onConfirm,
  onCancel,
}: {
  message: string
  onConfirm: () => void
  onCancel: () => void
}) {
  const t = useTranslations('admin')
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.92, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, y: 16 }}
        transition={{ type: 'spring', damping: 28, stiffness: 320 }}
        className="bg-obsidian-700 border border-gold/20 rounded-2xl p-8 max-w-sm w-full shadow-[0_24px_80px_rgba(0,0,0,0.8)]"
        onClick={e => e.stopPropagation()}
      >
        <p className="text-white text-base text-center leading-relaxed mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white text-sm font-medium transition-all"
          >
            {t('no')}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-xl btn-gold text-sm font-medium"
          >
            {t('yes')}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

function exportToCSV(bookings: Booking[]) {
  const headers = ['ID', 'Nombre', 'Email', 'Teléfono', 'Servicio', 'Fecha', 'Hora', 'Estado', 'Notas', 'Creado']
  const rows = bookings.map(b => [
    b.id,
    b.customer_name,
    b.customer_email,
    b.customer_phone,
    b.service_name,
    b.preferred_date,
    b.preferred_time,
    b.status,
    b.notes ?? '',
    new Date(b.created_at).toLocaleString('es-ES'),
  ])

  const csv = [headers, ...rows]
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n')

  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `reservas_${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

export default function AdminDashboardClient({ bookings: initial, locale, userEmail }: Props) {
  const t = useTranslations('admin')
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>(initial)
  const [filter, setFilter] = useState<BookingStatus | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [pendingConfirm, setPendingConfirm] = useState<{ id: string; status: BookingStatus } | null>(null)
  const [adminNoteText, setAdminNoteText] = useState('')
  const [savingNote, setSavingNote] = useState(false)
  const [isRealtime, setIsRealtime] = useState(false)
  const [isPending, startTransition] = useTransition()

  const stats: DashboardStats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  }

  const filtered = bookings.filter(b => {
    if (filter !== 'all' && b.status !== filter) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return (
        b.customer_name.toLowerCase().includes(q) ||
        b.customer_email.toLowerCase().includes(q) ||
        b.customer_phone.includes(q) ||
        b.service_name.toLowerCase().includes(q)
      )
    }
    return true
  })

  // Supabase realtime subscription
  useEffect(() => {
    const supabase = createClient()
    if (!supabase) return
    const channel = supabase
      .channel('bookings-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookings' },
        payload => {
          if (payload.eventType === 'INSERT') {
            setBookings(prev => [payload.new as Booking, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            setBookings(prev =>
              prev.map(b => b.id === (payload.new as Booking).id ? payload.new as Booking : b)
            )
            setSelectedBooking(prev =>
              prev?.id === (payload.new as Booking).id ? payload.new as Booking : prev
            )
          } else if (payload.eventType === 'DELETE') {
            setBookings(prev => prev.filter(b => b.id !== payload.old.id))
          }
        }
      )
      .subscribe(status => {
        setIsRealtime(status === 'SUBSCRIBED')
      })

    return () => { supabase.removeChannel(channel) }
  }, [])

  // Sync admin note text when selected booking changes
  useEffect(() => {
    setAdminNoteText(selectedBooking?.admin_notes ?? '')
  }, [selectedBooking?.id])

  async function handleLogout() {
    const supabase = createClient()
    if (supabase) await supabase.auth.signOut()
    router.push(`/${locale}/admin/login`)
  }

  const confirmStatusChange = useCallback((id: string, status: BookingStatus) => {
    setPendingConfirm({ id, status })
  }, [])

  async function executeStatusChange() {
    if (!pendingConfirm) return
    const { id, status } = pendingConfirm
    setPendingConfirm(null)

    const supabase = createClient()
    if (!supabase) return
    const { error } = await supabase
      .from('bookings')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (!error) {
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b))
      if (selectedBooking?.id === id) {
        setSelectedBooking(prev => prev ? { ...prev, status } : null)
      }

      try {
        const booking = bookings.find(b => b.id === id)
        if (booking) {
          const { sendBookingConfirmed, sendBookingCancelled } = await import('@/lib/emailjs')
          if (status === 'confirmed') await sendBookingConfirmed(booking)
          if (status === 'cancelled') await sendBookingCancelled(booking)
        }
      } catch {
        // Non-critical
      }

      // Trigger server-side calendar update
      const endpoint = status === 'confirmed' ? 'confirm' : 'cancel'
      fetch(`/api/bookings/${id}/${endpoint}`, { method: 'PATCH' }).catch(() => {})
    }
  }

  async function saveAdminNote() {
    if (!selectedBooking) return
    setSavingNote(true)
    const supabase = createClient()
    if (!supabase) { setSavingNote(false); return }
    const { error } = await supabase
      .from('bookings')
      .update({ admin_notes: adminNoteText || null })
      .eq('id', selectedBooking.id)

    if (!error) {
      setBookings(prev =>
        prev.map(b => b.id === selectedBooking.id ? { ...b, admin_notes: adminNoteText || null } : b)
      )
      setSelectedBooking(prev => prev ? { ...prev, admin_notes: adminNoteText || null } : null)
    }
    setSavingNote(false)
  }

  function handleRefresh() {
    startTransition(() => router.refresh())
  }

  const STATS_CARDS = [
    { label: t('stats_total'), value: stats.total, Icon: CalendarDays, color: 'text-white' },
    { label: t('stats_pending'), value: stats.pending, Icon: AlertCircle, color: 'text-yellow-400' },
    { label: t('stats_confirmed'), value: stats.confirmed, Icon: CheckCircle2, color: 'text-green-400' },
    { label: t('stats_cancelled'), value: stats.cancelled, Icon: XCircle, color: 'text-red-400' },
  ]

  return (
    <div className="min-h-screen bg-obsidian-800">
      {/* ── Header ── */}
      <header className="sticky top-0 z-20 bg-obsidian-700/95 backdrop-blur-xl border-b border-gold/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image src="/logo-jf3.png" alt="JF" width={36} height={36} className="object-contain" />
            <h1 className="font-display text-xl text-white hidden sm:block">{t('dashboard_title')}</h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Realtime indicator */}
            <div className={cn('flex items-center gap-1.5 text-xs', isRealtime ? 'text-green-400' : 'text-muted')}>
              {isRealtime ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isRealtime ? 'En vivo' : 'Offline'}</span>
            </div>

            {/* CSV export */}
            <button
              onClick={() => exportToCSV(filtered)}
              title="Exportar CSV"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-gold/30 transition-all text-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">CSV</span>
            </button>

            {/* Refresh */}
            <button
              onClick={handleRefresh}
              disabled={isPending}
              title="Actualizar"
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-gold/30 transition-all"
            >
              <RefreshCw className={cn('w-3.5 h-3.5', isPending && 'animate-spin')} />
            </button>

            <span className="hidden md:block text-xs text-muted truncate max-w-[180px]">{userEmail}</span>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white hover:border-red-500/30 transition-all text-xs sm:text-sm"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:block">{t('logout')}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {STATS_CARDS.map(({ label, value, Icon, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="glass-card rounded-xl p-5"
            >
              <Icon className={cn('w-5 h-5 mb-3', color)} />
              <p className={cn('text-3xl font-bold font-display', color)}>{value}</p>
              <p className="text-muted text-xs mt-1">{label}</p>
            </motion.div>
          ))}
        </div>

        {/* ── Toolbar: filter + search ── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-0.5">
            <Filter className="w-4 h-4 text-muted flex-shrink-0" />
            {(['all', 'pending', 'confirmed', 'cancelled'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex-shrink-0',
                  filter === f
                    ? 'bg-gold text-obsidian-800'
                    : 'bg-white/5 border border-white/10 text-white/60 hover:text-white'
                )}
              >
                {t(`filter_${f}` as 'filter_all' | 'filter_pending' | 'filter_confirmed' | 'filter_cancelled')}
                <span className="ml-1.5 opacity-60">
                  ({f === 'all' ? bookings.length : bookings.filter(b => b.status === f).length})
                </span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative sm:ml-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Buscar cliente, servicio…"
              className="form-input pl-9 py-2 text-sm w-full sm:w-64"
            />
          </div>
        </div>

        {/* ── Table ── */}
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
                      transition={{ delay: Math.min(i * 0.03, 0.3) }}
                      className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-4 py-4">
                        <p className="text-white text-sm font-medium">{booking.customer_name}</p>
                        <p className="text-muted text-xs">{booking.customer_email}</p>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-white/80 text-sm">{booking.service_name}</span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
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
                                onClick={() => confirmStatusChange(booking.id, 'confirmed')}
                                className="text-xs px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 transition-all"
                              >
                                {t('action_confirm')}
                              </button>
                              <button
                                onClick={() => confirmStatusChange(booking.id, 'cancelled')}
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

            <div className="px-4 py-3 border-t border-white/5 text-xs text-muted flex items-center justify-between">
              <span>{filtered.length} reserva{filtered.length !== 1 ? 's' : ''}</span>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-gold hover:underline"
                >
                  Limpiar búsqueda
                </button>
              )}
            </div>
          </div>
        )}
      </main>

      {/* ── Booking detail modal ── */}
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
              initial={{ opacity: 0, scale: 0.96, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 24 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="bg-obsidian-700 border border-gold/15 rounded-3xl p-8 w-full max-w-lg pointer-events-auto shadow-[0_24px_80px_rgba(0,0,0,0.8)] max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-2xl text-white">{t('detail_title')}</h2>
                  <button
                    onClick={() => setSelectedBooking(null)}
                    aria-label="Cerrar"
                    className="text-muted hover:text-white transition-colors rounded-full p-1 hover:bg-white/5"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-5">
                  <StatusBadge status={selectedBooking.status} />
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-4 mb-5">
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

                {/* Contact links */}
                <div className="space-y-2 mb-5 pb-5 border-b border-white/5">
                  <a
                    href={`tel:${selectedBooking.customer_phone}`}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/3 hover:bg-white/5 transition-colors"
                  >
                    <Phone className="w-4 h-4 text-gold flex-shrink-0" />
                    <span className="text-sm text-white/80">{selectedBooking.customer_phone}</span>
                  </a>
                  <a
                    href={`mailto:${selectedBooking.customer_email}`}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/3 hover:bg-white/5 transition-colors"
                  >
                    <Mail className="w-4 h-4 text-gold flex-shrink-0" />
                    <span className="text-sm text-white/80 break-all">{selectedBooking.customer_email}</span>
                  </a>
                </div>

                {/* Customer notes */}
                {selectedBooking.notes && (
                  <div className="mb-5">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-gold/60" />
                      <p className="text-xs text-muted">{t('detail_notes')}</p>
                    </div>
                    <p className="text-white/70 text-sm leading-relaxed bg-white/3 rounded-xl p-4">
                      {selectedBooking.notes}
                    </p>
                  </div>
                )}

                {/* Admin notes */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <StickyNote className="w-4 h-4 text-gold/60" />
                    <p className="text-xs text-muted">{t('detail_admin_notes')}</p>
                  </div>
                  <textarea
                    value={adminNoteText}
                    onChange={e => setAdminNoteText(e.target.value)}
                    rows={3}
                    placeholder="Notas internas (no visibles al cliente)…"
                    className="form-input resize-none text-sm mb-2"
                  />
                  <button
                    onClick={saveAdminNote}
                    disabled={savingNote}
                    className="text-xs px-4 py-2 rounded-lg bg-gold/10 border border-gold/20 text-gold hover:bg-gold/15 transition-all disabled:opacity-50"
                  >
                    {savingNote ? 'Guardando…' : 'Guardar nota'}
                  </button>
                </div>

                {/* Actions */}
                {selectedBooking.status === 'pending' && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setSelectedBooking(null)
                        confirmStatusChange(selectedBooking.id, 'confirmed')
                      }}
                      className="flex-1 py-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 text-sm font-medium transition-all"
                    >
                      {t('action_confirm')}
                    </button>
                    <button
                      onClick={() => {
                        setSelectedBooking(null)
                        confirmStatusChange(selectedBooking.id, 'cancelled')
                      }}
                      className="flex-1 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 text-sm font-medium transition-all"
                    >
                      {t('action_cancel')}
                    </button>
                  </div>
                )}

                <p className="text-xs text-muted mt-4 text-center">
                  {t('detail_created')}: {new Date(selectedBooking.created_at).toLocaleString(locale === 'es' ? 'es-ES' : 'en-GB')}
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Confirm dialog ── */}
      <AnimatePresence>
        {pendingConfirm && (
          <ConfirmDialog
            message={
              pendingConfirm.status === 'confirmed'
                ? t('confirm_confirm')
                : t('confirm_cancel')
            }
            onConfirm={executeStatusChange}
            onCancel={() => setPendingConfirm(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
