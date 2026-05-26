'use client'

import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { motion } from 'framer-motion'
import { ArrowRight, MessageCircle } from 'lucide-react'

export default function BookingCTA() {
  const t = useTranslations('home')
  const locale = useLocale()

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="max-w-4xl mx-auto relative"
      >
        {/* Card */}
        <div className="glass-card rounded-3xl p-12 sm:p-16 text-center relative overflow-hidden">
          {/* Decorative glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-gold/5 pointer-events-none rounded-3xl" />
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-gold/5 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-gold/5 blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <p className="section-label mb-6">{locale === 'es' ? 'Reserva ahora' : 'Book now'}</p>
            <h2 className="font-display text-4xl sm:text-5xl font-light text-white leading-tight mb-6">
              {t('cta_title')}
            </h2>
            <p className="text-muted max-w-lg mx-auto mb-10 leading-relaxed">
              {t('cta_subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href={`/${locale}/reservas`}
                className="btn-gold flex items-center gap-2 px-8 py-4 rounded-full text-base font-semibold group shadow-gold-lg"
              >
                <span>{t('cta_button')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="https://wa.me/34641093550?text=Hola%20quiero%20una%20cita"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline-gold flex items-center gap-2 px-8 py-4 rounded-full text-base font-medium"
              >
                <MessageCircle className="w-5 h-5" />
                <span>{t('cta_whatsapp')}</span>
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
