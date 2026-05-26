'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { DayPicker } from 'react-day-picker'
import { format, addDays } from 'date-fns'
import { es, enGB } from 'date-fns/locale'
import {
  Scissors, Palette, Heart, Sparkles, Droplets,
  ChevronRight, ChevronLeft, Check, MessageCircle,
  User, Mail, Phone, Clock, Calendar, FileText
} from 'lucide-react'
import { cn, generateTimeSlots, isDateAvailable } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import 'react-day-picker/dist/style.css'

const SERVICES = [
  { key: 'corte_hombre', price: '15€', icon: Scissors, category: 'men', nameEs: 'Corte Hombre', nameEn: "Men's Haircut" },
  { key: 'corte_barba', price: '18€', icon: Scissors, category: 'men', nameEs: 'Corte Hombre + Barba', nameEn: 'Haircut + Beard' },
  { key: 'corte_mujer', price: 'Consultar', icon: Scissors, category: 'women', nameEs: 'Corte Mujer', nameEn: "Women's Haircut" },
  { key: 'color', price: 'Consultar', icon: Palette, category: 'treatment', nameEs: 'Color', nameEn: 'Colour' },
  { key: 'mechas', price: 'Consultar', icon: Palette, category: 'treatment', nameEs: 'Mechas', nameEn: 'Highlights' },
  { key: 'lavado', price: 'Consultar', icon: Droplets, category: 'treatment', nameEs: 'Lavado', nameEn: 'Wash' },
  { key: 'peinado', price: 'Consultar', icon: Sparkles, category: 'women', nameEs: 'Peinado', nameEn: 'Styling' },
  { key: 'keratina', price: 'Consultar', icon: Droplets, category: 'treatment', nameEs: 'Keratina', nameEn: 'Keratin' },
  { key: 'maquillaje_novia', price: '35€', icon: Heart, category: 'bridal', nameEs: 'Maquillaje Novia', nameEn: 'Bridal Makeup' },
  { key: 'maquillaje_novia_peinado', price: '55€', icon: Heart, category: 'bridal', nameEs: 'Maquillaje Novia + Peinado', nameEn: 'Bridal Makeup + Styling' },
  { key: 'maquillaje_fantasia', price: 'Consultar', icon: Sparkles, category: 'makeup', nameEs: 'Maquillaje Fantasía', nameEn: 'Fantasy Makeup' },
]

const TIME_SLOTS = generateTimeSlots(9, 21, 30)

function buildSchema(_t: ReturnType<typeof useTranslations<'booking'>>) {
  return z.object({
    service_key: z.string().min(1, 'Selecciona un servicio'),
    service_name: z.string().min(1),
    preferred_date: z.string().min(1, 'Selecciona una fecha'),
    preferred_time: z.string().min(1, 'Selecciona una hora'),
    customer_name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    customer_email: z.string().email('Email no válido'),
    customer_phone: z.string().min(9, 'El teléfono debe tener al menos 9 dígitos'),
    notes: z.string().max(500).optional(),
    gdpr_consent: z.literal(true, {
      errorMap: () => ({ message: 'Debes aceptar la política de privacidad' }),
    }),
  })
}

type FormData = {
  service_key: string
  service_name: string
  preferred_date: string
  preferred_time: string
  customer_name: string
  customer_email: string
  customer_phone: string
  notes?: string
  gdpr_consent: boolean
}

const STEPS = 4

export default function BookingForm({ preselectedService }: { preselectedService?: string }) {
  const t = useTranslations('booking')
  const locale = useLocale()
  const [step, setStep] = useState(1)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const dateFnsLocale = locale === 'es' ? es : enGB

  const schema = buildSchema(t)

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      service_key: preselectedService || '',
      service_name: preselectedService
        ? (SERVICES.find(s => s.key === preselectedService)?.[locale === 'es' ? 'nameEs' : 'nameEn'] ?? '')
        : '',
      preferred_date: '',
      preferred_time: '',
      customer_name: '',
      customer_email: '',
      customer_phone: '',
      notes: '',
      gdpr_consent: false,
    },
  })

  const watchedServiceKey = watch('service_key')
  const watchedDate = watch('preferred_date')
  const watchedTime = watch('preferred_time')

  const selectService = useCallback((svc: typeof SERVICES[0]) => {
    setValue('service_key', svc.key)
    setValue('service_name', locale === 'es' ? svc.nameEs : svc.nameEn)
  }, [setValue, locale])

  const handleDateSelect = useCallback((date: Date | undefined) => {
    if (!date || !isDateAvailable(date)) return
    setSelectedDate(date)
    setValue('preferred_date', format(date, 'yyyy-MM-dd'))
    setValue('preferred_time', '')
  }, [setValue])

  async function onSubmit(data: FormData) {
    setStatus('submitting')
    try {
      const supabase = createClient()

      const { error } = await supabase.from('bookings').insert({
        customer_name: data.customer_name,
        customer_email: data.customer_email,
        customer_phone: data.customer_phone,
        service_name: data.service_name,
        preferred_date: data.preferred_date,
        preferred_time: data.preferred_time,
        notes: data.notes || null,
        status: 'pending',
        locale,
      })

      if (error) throw error

      // EmailJS notifications
      try {
        const { sendAdminNotification, sendBookingReceived } = await import('@/lib/emailjs')
        await Promise.all([
          sendAdminNotification(data as any),
          sendBookingReceived(data as any),
        ])
      } catch {
        // Email send failure is non-critical — booking is saved
      }

      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card rounded-2xl p-12 text-center max-w-lg mx-auto"
      >
        <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
          <Check className="w-8 h-8 text-green-400" />
        </div>
        <h3 className="font-display text-3xl text-white mb-3">{t('success_title')}</h3>
        <p className="text-muted leading-relaxed mb-4">{t('success_message')}</p>
        <p className="text-muted text-sm mb-8">{t('success_note')}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => { setStatus('idle'); setStep(1); setSelectedDate(undefined) }}
            className="btn-outline-gold px-6 py-3 rounded-xl text-sm font-medium"
          >
            {t('new_booking')}
          </button>
          <a
            href="https://wa.me/34641093550"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold flex items-center gap-2 justify-center px-6 py-3 rounded-xl text-sm font-medium"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp</span>
          </a>
        </div>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl mx-auto">
      {/* Progress bar */}
      <div className="flex items-center gap-2 mb-10">
        {Array.from({ length: STEPS }).map((_, i) => (
          <div key={i} className="flex items-center flex-1">
            <div
              className={cn(
                'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 flex-shrink-0',
                i + 1 < step ? 'bg-gold text-obsidian-800' :
                i + 1 === step ? 'bg-gold text-obsidian-800 ring-4 ring-gold/20' :
                'bg-white/5 border border-white/10 text-muted'
              )}
            >
              {i + 1 < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
            </div>
            {i < STEPS - 1 && (
              <div className={cn(
                'flex-1 h-px mx-2 transition-all duration-300',
                i + 1 < step ? 'bg-gold' : 'bg-white/10'
              )} />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Service */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            <h2 className="font-display text-3xl font-light text-white mb-2">{t('step1_title')}</h2>
            <p className="text-muted text-sm mb-8">{t('select_service')}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {SERVICES.map(svc => (
                <button
                  key={svc.key}
                  type="button"
                  onClick={() => selectService(svc)}
                  className={cn(
                    'flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 text-left group',
                    watchedServiceKey === svc.key
                      ? 'border-gold/60 bg-gold/10 shadow-gold'
                      : 'border-white/10 bg-white/3 hover:border-gold/30 hover:bg-white/5'
                  )}
                >
                  <div className={cn(
                    'p-2.5 rounded-lg flex-shrink-0 transition-colors duration-200',
                    watchedServiceKey === svc.key ? 'bg-gold/20' : 'bg-white/5 group-hover:bg-gold/10'
                  )}>
                    <svc.icon className={cn('w-4 h-4', watchedServiceKey === svc.key ? 'text-gold' : 'text-white/40 group-hover:text-gold/60')} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn('text-sm font-medium truncate', watchedServiceKey === svc.key ? 'text-white' : 'text-white/70')}>
                      {locale === 'es' ? svc.nameEs : svc.nameEn}
                    </p>
                    <p className={cn('text-xs mt-0.5', watchedServiceKey === svc.key ? 'text-gold' : 'text-muted')}>
                      {svc.price}
                    </p>
                  </div>
                  {watchedServiceKey === svc.key && (
                    <Check className="w-4 h-4 text-gold flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>

            <button
              type="button"
              disabled={!watchedServiceKey}
              onClick={() => setStep(2)}
              className="btn-gold flex items-center gap-2 px-8 py-3.5 rounded-xl font-medium disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>{t('next')}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* Step 2: Date & time */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            <h2 className="font-display text-3xl font-light text-white mb-2">{t('step2_title')}</h2>
            <p className="text-muted text-sm mb-8">{t('availability_note')}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Calendar */}
              <div className="glass-card rounded-xl p-4">
                <div className="flex items-center gap-2 mb-4 text-sm text-muted">
                  <Calendar className="w-4 h-4 text-gold" />
                  <span>{t('select_date')}</span>
                </div>
                <DayPicker
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  locale={dateFnsLocale}
                  fromDate={addDays(new Date(), 1)}
                  toDate={addDays(new Date(), 60)}
                  disabled={(date) => !isDateAvailable(date)}
                  className="!font-sans"
                  classNames={{
                    root: 'w-full',
                    months: 'w-full',
                    month: 'w-full',
                    caption: 'flex justify-between items-center px-2 pb-3',
                    caption_label: 'text-sm font-medium text-white capitalize',
                    nav: 'flex gap-1',
                    nav_button: 'w-7 h-7 rounded-lg bg-white/5 hover:bg-gold/10 text-white/60 hover:text-gold flex items-center justify-center transition-colors',
                    table: 'w-full border-collapse',
                    head_row: 'flex',
                    head_cell: 'flex-1 text-center text-xs text-muted capitalize py-1',
                    row: 'flex mt-1',
                    cell: 'flex-1 text-center',
                    day: 'w-full aspect-square rounded-lg text-sm text-white/70 hover:bg-gold/10 hover:text-gold transition-colors',
                    day_selected: '!bg-gold !text-obsidian-800 font-semibold',
                    day_today: 'border border-gold/30 text-gold',
                    day_disabled: 'opacity-25 cursor-not-allowed hover:bg-transparent hover:text-white/70',
                  }}
                />
              </div>

              {/* Time slots */}
              <div>
                <div className="flex items-center gap-2 mb-4 text-sm text-muted">
                  <Clock className="w-4 h-4 text-gold" />
                  <span>{t('select_time')}</span>
                </div>
                {!watchedDate ? (
                  <p className="text-muted text-sm italic">{t('select_date')}</p>
                ) : (
                  <div className="grid grid-cols-3 gap-2 max-h-80 overflow-y-auto pr-1">
                    {TIME_SLOTS.map(slot => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setValue('preferred_time', slot)}
                        className={cn(
                          'py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                          watchedTime === slot
                            ? 'bg-gold text-obsidian-800 shadow-gold'
                            : 'bg-white/5 border border-white/10 text-white/60 hover:border-gold/30 hover:text-white'
                        )}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="btn-outline-gold flex items-center gap-2 px-6 py-3.5 rounded-xl font-medium"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{t('back')}</span>
              </button>
              <button
                type="button"
                disabled={!watchedDate || !watchedTime}
                onClick={() => setStep(3)}
                className="btn-gold flex items-center gap-2 px-8 py-3.5 rounded-xl font-medium disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>{t('next')}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Personal info */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            <h2 className="font-display text-3xl font-light text-white mb-2">{t('step3_title')}</h2>
            <p className="text-muted text-sm mb-8">{t('pending_note')}</p>

            <div className="space-y-5 mb-8">
              {/* Name */}
              <div>
                <label className="flex items-center gap-2 text-sm text-white/70 mb-2">
                  <User className="w-3.5 h-3.5 text-gold/60" />
                  {t('name_label')}
                </label>
                <input
                  {...register('customer_name')}
                  placeholder={t('name_placeholder')}
                  autoComplete="name"
                  className={cn('form-input', errors.customer_name && 'error')}
                />
                {errors.customer_name && (
                  <p className="text-red-400 text-xs mt-1.5">{errors.customer_name.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center gap-2 text-sm text-white/70 mb-2">
                  <Mail className="w-3.5 h-3.5 text-gold/60" />
                  {t('email_label')}
                </label>
                <input
                  {...register('customer_email')}
                  type="email"
                  placeholder={t('email_placeholder')}
                  autoComplete="email"
                  className={cn('form-input', errors.customer_email && 'error')}
                />
                {errors.customer_email && (
                  <p className="text-red-400 text-xs mt-1.5">{errors.customer_email.message}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="flex items-center gap-2 text-sm text-white/70 mb-2">
                  <Phone className="w-3.5 h-3.5 text-gold/60" />
                  {t('phone_label')}
                </label>
                <input
                  {...register('customer_phone')}
                  type="tel"
                  placeholder={t('phone_placeholder')}
                  autoComplete="tel"
                  className={cn('form-input', errors.customer_phone && 'error')}
                />
                {errors.customer_phone && (
                  <p className="text-red-400 text-xs mt-1.5">{errors.customer_phone.message}</p>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="flex items-center gap-2 text-sm text-white/70 mb-2">
                  <FileText className="w-3.5 h-3.5 text-gold/60" />
                  {t('notes_label')}
                </label>
                <textarea
                  {...register('notes')}
                  placeholder={t('notes_placeholder')}
                  rows={3}
                  className="form-input resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="btn-outline-gold flex items-center gap-2 px-6 py-3.5 rounded-xl font-medium"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{t('back')}</span>
              </button>
              <button
                type="button"
                onClick={async () => {
                  const valid = await trigger(['customer_name', 'customer_email', 'customer_phone'])
                  if (valid) setStep(4)
                }}
                className="btn-gold flex items-center gap-2 px-8 py-3.5 rounded-xl font-medium"
              >
                <span>{t('next')}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 4: Confirm */}
        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            <h2 className="font-display text-3xl font-light text-white mb-2">{t('step4_title')}</h2>
            <p className="text-muted text-sm mb-8">{t('pending_note')}</p>

            {/* Summary */}
            <div className="glass-card rounded-2xl p-6 mb-6 space-y-3">
              {[
                { label: t('select_service'), value: locale === 'es' ? SERVICES.find(s => s.key === watchedServiceKey)?.nameEs : SERVICES.find(s => s.key === watchedServiceKey)?.nameEn },
                { label: t('select_date'), value: watchedDate },
                { label: t('select_time'), value: watchedTime },
                { label: t('name_label'), value: watch('customer_name') },
                { label: t('email_label'), value: watch('customer_email') },
                { label: t('phone_label'), value: watch('customer_phone') },
              ].map(({ label, value }) => value && (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-muted">{label}</span>
                  <span className="text-white font-medium">{value}</span>
                </div>
              ))}
            </div>

            {/* GDPR */}
            <div className="mb-8">
              <label className="flex items-start gap-3 cursor-pointer group">
                <Controller
                  name="gdpr_consent"
                  control={control}
                  rules={{ validate: v => v === true }}
                  render={({ field }) => (
                    <div
                      onClick={() => field.onChange(!field.value)}
                      className={cn(
                        'flex-shrink-0 w-5 h-5 rounded border mt-0.5 flex items-center justify-center transition-all duration-200 cursor-pointer',
                        field.value
                          ? 'bg-gold border-gold'
                          : 'border-white/20 group-hover:border-gold/40'
                      )}
                    >
                      {field.value && <Check className="w-3 h-3 text-obsidian-800" />}
                    </div>
                  )}
                />
                <span className="text-sm text-muted leading-relaxed">
                  {t('gdpr_text')}{' '}
                  <Link href={`/${locale}/privacidad`} className="text-gold hover:underline">
                    {t('privacy_link')}
                  </Link>
                </span>
              </label>
              {errors.gdpr_consent && (
                <p className="text-red-400 text-xs mt-2 ml-8">Debes aceptar la política de privacidad</p>
              )}
            </div>

            {status === 'error' && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {t('error_message')}
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="btn-outline-gold flex items-center gap-2 px-6 py-3.5 rounded-xl font-medium"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{t('back')}</span>
              </button>
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="btn-gold flex items-center gap-2 px-8 py-3.5 rounded-xl font-medium disabled:opacity-60"
              >
                <span>{status === 'submitting' ? t('submitting') : t('submit')}</span>
                {status !== 'submitting' && <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  )
}
