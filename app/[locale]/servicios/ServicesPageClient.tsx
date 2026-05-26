'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { Scissors, Palette, Heart, Sparkles, Droplets, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ServiceItem {
  key: string
  price: string | null
  category: string
  duration: number | null
  icon: React.ComponentType<{ className?: string }>
}

const SERVICES: ServiceItem[] = [
  { key: 'corte_hombre', price: '15€', category: 'men', duration: 30, icon: Scissors },
  { key: 'corte_barba', price: '18€', category: 'men', duration: 45, icon: Scissors },
  { key: 'corte_mujer', price: null, category: 'women', duration: 60, icon: Scissors },
  { key: 'color', price: null, category: 'treatment', duration: 120, icon: Palette },
  { key: 'mechas', price: null, category: 'treatment', duration: 150, icon: Palette },
  { key: 'lavado', price: null, category: 'treatment', duration: 20, icon: Droplets },
  { key: 'peinado', price: null, category: 'women', duration: 30, icon: Sparkles },
  { key: 'keratina', price: null, category: 'treatment', duration: 180, icon: Droplets },
  { key: 'maquillaje_novia', price: '35€', category: 'bridal', duration: 60, icon: Heart },
  { key: 'maquillaje_novia_peinado', price: '55€', category: 'bridal', duration: 120, icon: Heart },
  { key: 'maquillaje_fantasia', price: null, category: 'makeup', duration: 90, icon: Sparkles },
]

const CATEGORIES = ['all', 'men', 'women', 'bridal', 'makeup', 'treatment'] as const

export default function ServicesPageClient({ locale }: { locale: string }) {
  const t = useTranslations('services')
  const [activeCategory, setActiveCategory] = useState<string>('all')

  const filtered = activeCategory === 'all'
    ? SERVICES
    : SERVICES.filter(s => s.category === activeCategory)

  return (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="section-label mb-4"
        >
          Jhon Florez Peluqueros
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-5xl sm:text-6xl font-light text-white mb-4"
        >
          {t('title')}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-muted max-w-xl mx-auto"
        >
          {t('subtitle')}
        </motion.p>
      </div>

      {/* Category filter */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-wrap justify-center gap-2 mb-12"
      >
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              'px-5 py-2 rounded-full text-sm font-medium transition-all duration-200',
              activeCategory === cat
                ? 'bg-gold text-obsidian-800 shadow-gold'
                : 'bg-white/5 border border-white/10 text-white/60 hover:border-gold/30 hover:text-white'
            )}
          >
            {t(cat === 'all' ? 'all' : `category_${cat}` as 'all' | 'category_men' | 'category_women' | 'category_bridal' | 'category_makeup' | 'category_treatment')}
          </button>
        ))}
      </motion.div>

      {/* Services grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(({ key, price, duration, icon: Icon }, i) => (
          <motion.div
            key={key}
            layout
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            className="glass-card glass-card-hover rounded-2xl p-7 flex flex-col group"
          >
            {/* Icon + price */}
            <div className="flex items-start justify-between mb-5">
              <div className="p-3 rounded-xl bg-gold/10 border border-gold/15 group-hover:bg-gold/15 transition-colors">
                <Icon className="w-5 h-5 text-gold" />
              </div>
              <div className="text-right">
                {price ? (
                  <span className="font-display text-2xl font-medium text-gold">{price}</span>
                ) : (
                  <span className="text-sm text-muted italic">{t('consult')}</span>
                )}
              </div>
            </div>

            {/* Name */}
            <h3 className="font-display text-xl font-medium text-white mb-2">
              {t(`services_list.${key}.name` as `services_list.${string}.name`)}
            </h3>

            {/* Description */}
            <p className="text-muted text-sm leading-relaxed flex-1 mb-5">
              {t(`services_list.${key}.desc` as `services_list.${string}.desc`)}
            </p>

            {/* Duration */}
            {duration && (
              <div className="flex items-center gap-1.5 text-xs text-muted/60 mb-4">
                <span>{t('duration')}:</span>
                <span>~{duration} {t('minutes')}</span>
              </div>
            )}

            {/* CTA */}
            <Link
              href={`/${locale}/reservas?service=${key}`}
              className="flex items-center gap-2 text-gold/70 hover:text-gold text-sm font-medium transition-colors group/link"
            >
              <span>{t('book_service')}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Note about consult */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center text-muted text-sm mt-12"
      >
        {locale === 'es'
          ? 'Los servicios marcados como "Consultar" varían según longitud y tratamiento. Contáctanos para un presupuesto personalizado.'
          : 'Services marked "On request" vary depending on length and treatment. Contact us for a personalised quote.'}
      </motion.p>
    </div>
  )
}
