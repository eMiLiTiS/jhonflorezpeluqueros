'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import BookingForm from '@/components/booking/BookingForm'
import { CalendarClock } from 'lucide-react'

export default function BookingPageClient({
  locale,
  preselectedService,
}: {
  locale: string
  preselectedService?: string
}) {
  const t = useTranslations('booking')

  return (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-16 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gold/10 border border-gold/20 mb-6"
        >
          <CalendarClock className="w-8 h-8 text-gold" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-display text-5xl sm:text-6xl font-light text-white mb-4"
        >
          {t('title')}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-muted leading-relaxed"
        >
          {t('subtitle')}
        </motion.p>
      </div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <BookingForm preselectedService={preselectedService} />
      </motion.div>
    </div>
  )
}
