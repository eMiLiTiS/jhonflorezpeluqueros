'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { motion } from 'framer-motion'
import { Star, Gem, Shield, Home, ArrowRight } from 'lucide-react'

const VALUES = [
  { key: 'value1', icon: Star },
  { key: 'value2', icon: Gem },
  { key: 'value3', icon: Shield },
  { key: 'value4', icon: Home },
] as const

export default function AboutPageClient() {
  const t = useTranslations('about')
  const locale = useLocale()

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

      {/* Story + image */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="font-display text-4xl font-light text-white mb-6">{t('story_title')}</h2>
          <div className="w-12 h-px bg-gold mb-8" />
          <div className="space-y-5 text-muted leading-relaxed">
            <p>{t('story_p1')}</p>
            <p>{t('story_p2')}</p>
            <p>{t('story_p3')}</p>
          </div>
          <Link
            href={`/${locale}/reservas`}
            className="inline-flex items-center gap-2 btn-gold px-7 py-3.5 rounded-full text-sm font-medium mt-8 group"
          >
            <span>{locale === 'es' ? 'Reservar cita' : 'Book now'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden">
            <Image
              src="/Gemini_Generated_Image_xpc59xxpc59xxpc5.png"
              alt={t('story_title')}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian-800/60 to-transparent" />
          </div>
          {/* Floating badge */}
          <div className="absolute -bottom-4 -left-4 glass-card rounded-xl p-5 border border-gold/20">
            <p className="font-display text-3xl font-medium text-gold">10+</p>
            <p className="text-muted text-xs mt-1">
              {locale === 'es' ? 'Años de experiencia' : 'Years of experience'}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Values */}
      <div className="mb-24">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl font-light text-white"
          >
            {t('values_title')}
          </motion.h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {VALUES.map(({ key, icon: Icon }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card glass-card-hover rounded-2xl p-6 text-center"
            >
              <div className="p-3 rounded-xl bg-gold/10 w-fit mx-auto mb-4">
                <Icon className="w-5 h-5 text-gold" />
              </div>
              <h3 className="font-display text-xl font-medium text-white mb-2">
                {t(`${key}_title` as 'value1_title' | 'value2_title' | 'value3_title' | 'value4_title')}
              </h3>
              <p className="text-muted text-sm leading-relaxed">
                {t(`${key}_desc` as 'value1_desc' | 'value2_desc' | 'value3_desc' | 'value4_desc')}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Service area */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-card rounded-3xl p-10 text-center max-w-2xl mx-auto"
      >
        <div className="p-4 rounded-full bg-gold/10 border border-gold/20 w-fit mx-auto mb-5">
          <Home className="w-7 h-7 text-gold" />
        </div>
        <h2 className="font-display text-3xl font-light text-white mb-3">{t('coverage_title')}</h2>
        <p className="text-muted leading-relaxed mb-6">{t('coverage_desc')}</p>
        <Link
          href={`/${locale}/contacto`}
          className="inline-flex items-center gap-2 btn-outline-gold px-7 py-3 rounded-full text-sm font-medium group"
        >
          <span>{locale === 'es' ? 'Consúltanos' : 'Contact us'}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>
    </div>
  )
}
