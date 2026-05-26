'use client'

import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { motion } from 'framer-motion'
import { Home, Star, Shield, Heart, Gem, ArrowRight } from 'lucide-react'

const VALUES = [
  { key: 'value1', icon: Star },
  { key: 'value2', icon: Gem },
  { key: 'value3', icon: Shield },
  { key: 'value4', icon: Home },
] as const

export default function About() {
  const t = useTranslations('about')
  const th = useTranslations('home')
  const locale = useLocale()

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left: text */}
        <div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="section-label mb-4"
          >
            {th('about_badge')}
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl font-light text-white leading-tight mb-6"
          >
            {th('about_title')}
          </motion.h2>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-12 h-px bg-gold mb-8 origin-left"
          />

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-muted leading-relaxed mb-6"
          >
            {t('story_p1')}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-muted leading-relaxed mb-8"
          >
            {t('story_p3')}
          </motion.p>

          {/* Home service highlight */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="glass-card rounded-xl p-6 border-l-2 border-gold mb-8"
          >
            <div className="flex items-start gap-4">
              <div className="p-2.5 rounded-lg bg-gold/10 flex-shrink-0">
                <Home className="w-5 h-5 text-gold" />
              </div>
              <div>
                <h4 className="text-white font-medium mb-1">{th('home_service_title')}</h4>
                <p className="text-muted text-sm leading-relaxed">{th('home_service_subtitle')}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
          >
            <Link
              href={`/${locale}/nosotros`}
              className="inline-flex items-center gap-2 text-gold hover:text-gold-300 text-sm font-medium transition-colors group"
            >
              <span>{locale === 'es' ? 'Conoce nuestra historia' : 'Our story'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </motion.div>
        </div>

        {/* Right: values grid */}
        <div className="grid grid-cols-2 gap-4">
          {VALUES.map(({ key, icon: Icon }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card glass-card-hover rounded-2xl p-6"
            >
              <div className="p-3 rounded-xl bg-gold/10 w-fit mb-4">
                <Icon className="w-5 h-5 text-gold" />
              </div>
              <h4 className="text-white font-medium mb-2 font-display text-lg">
                {t(`${key}_title` as 'value1_title' | 'value2_title' | 'value3_title' | 'value4_title')}
              </h4>
              <p className="text-muted text-sm leading-relaxed">
                {t(`${key}_desc` as 'value1_desc' | 'value2_desc' | 'value3_desc' | 'value4_desc')}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
