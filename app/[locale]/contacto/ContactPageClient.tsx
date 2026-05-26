'use client'

import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Clock, MessageCircle, ArrowRight } from 'lucide-react'

export default function ContactPageClient() {
  const t = useTranslations('contact')
  const locale = useLocale()

  const INFO_CARDS = [
    {
      icon: Phone,
      label: t('phone_label'),
      value: '+34 641 09 35 50',
      href: 'tel:+34641093550',
    },
    {
      icon: Mail,
      label: t('email_label'),
      value: 'jhonarnulfa1402@gmail.com',
      href: 'mailto:jhonarnulfa1402@gmail.com',
    },
    {
      icon: MapPin,
      label: t('location_label'),
      value: t('location_value'),
      href: null,
    },
    {
      icon: Clock,
      label: t('hours_label'),
      value: t('hours_value'),
      href: null,
    },
  ]

  return (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-20">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="section-label mb-4">
          Jhon Florez Peluqueros
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-display text-5xl sm:text-6xl font-light text-white mb-4"
        >
          {t('title')}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="text-muted max-w-xl mx-auto"
        >
          {t('subtitle')}
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left: info cards + CTAs */}
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {INFO_CARDS.map(({ icon: Icon, label, value, href }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass-card rounded-xl p-5"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-4 h-4 text-gold" />
                  <span className="text-xs text-muted uppercase tracking-wide">{label}</span>
                </div>
                {href ? (
                  <a
                    href={href}
                    className="text-white text-sm hover:text-gold transition-colors duration-200 break-all"
                  >
                    {value}
                  </a>
                ) : (
                  <span className="text-white text-sm">{value}</span>
                )}
              </motion.div>
            ))}
          </div>

          {/* Home service note */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="glass-card rounded-xl p-6 border-l-2 border-gold mb-8"
          >
            <h3 className="text-white font-medium mb-1">{t('home_service_title')}</h3>
            <p className="text-muted text-sm leading-relaxed">{t('home_service_desc')}</p>
          </motion.div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="https://wa.me/34641093550?text=Hola%20quiero%20una%20cita"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl font-medium group"
            >
              <MessageCircle className="w-5 h-5" />
              <span>{t('whatsapp_cta')}</span>
            </a>
            <a
              href="tel:+34641093550"
              className="btn-outline-gold flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl font-medium"
            >
              <Phone className="w-5 h-5" />
              <span>{t('call_cta')}</span>
            </a>
          </div>
        </div>

        {/* Right: booking CTA card */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="glass-card rounded-3xl p-10 relative overflow-hidden"
        >
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-gold/5 blur-3xl" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-gold/5 blur-3xl" />

          <div className="relative">
            <p className="section-label mb-4">{locale === 'es' ? 'La forma más rápida' : 'The quickest way'}</p>
            <h2 className="font-display text-4xl font-light text-white mb-4 leading-tight">
              {locale === 'es' ? 'Reserva online en minutos' : 'Book online in minutes'}
            </h2>
            <p className="text-muted text-sm leading-relaxed mb-8">
              {locale === 'es'
                ? 'Completa el formulario de reserva y te confirmamos en menos de 24 horas. Sin llamadas, sin esperas.'
                : 'Fill in the booking form and we\'ll confirm within 24 hours. No calls, no waiting.'}
            </p>
            <Link
              href={`/${locale}/reservas`}
              className="btn-gold flex items-center gap-2 px-8 py-4 rounded-xl font-medium group w-fit"
            >
              <span>{locale === 'es' ? 'Ir a reservas' : 'Book now'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
