'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { ClipboardList, CalendarCheck, CheckCircle } from 'lucide-react'

const STEPS = [
  { icon: ClipboardList, key: 'step1' },
  { icon: CalendarCheck, key: 'step2' },
  { icon: CheckCircle, key: 'step3' },
] as const

export default function HowItWorks() {
  const t = useTranslations('home')

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold/[0.02] to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="section-label mb-4"
          >
            {t('how_subtitle')}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl font-light text-white"
          >
            {t('how_title')}
          </motion.h2>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-16 left-[16.666%] right-[16.666%] h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map(({ icon: Icon, key }, i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="flex flex-col items-center text-center"
              >
                {/* Step number + icon */}
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-full bg-obsidian-700 border border-gold/30 flex items-center justify-center shadow-gold">
                    <Icon className="w-7 h-7 text-gold" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gold text-obsidian-800 text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>

                <h3 className="font-display text-2xl font-medium text-white mb-3">
                  {t(`${key}_title` as 'step1_title' | 'step2_title' | 'step3_title')}
                </h3>
                <p className="text-muted text-sm leading-relaxed max-w-xs">
                  {t(`${key}_desc` as 'step1_desc' | 'step2_desc' | 'step3_desc')}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
