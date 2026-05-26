'use client'

import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { motion } from 'framer-motion'
import { Scissors, Palette, Sparkles, ArrowRight } from 'lucide-react'

const FEATURED_SERVICES = [
  {
    key: 'corte_hombre',
    icon: Scissors,
    price: '15€',
    category: 'men',
    delay: 0,
  },
  {
    key: 'maquillaje_novia_peinado',
    icon: Sparkles,
    price: '55€',
    category: 'bridal',
    delay: 0.1,
  },
  {
    key: 'color',
    icon: Palette,
    price: null,
    category: 'treatment',
    delay: 0.2,
  },
] as const

const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function Services() {
  const t = useTranslations()
  const locale = useLocale()
  const ts = useTranslations('home')
  const tSvc = useTranslations('services')

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-16">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="section-label mb-4"
        >
          {ts('featured_services_title')}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-4xl sm:text-5xl font-light text-white mb-4"
        >
          {ts('featured_services_subtitle')}
        </motion.h2>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-16 h-px bg-gold mx-auto"
        />
      </div>

      {/* Service cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {FEATURED_SERVICES.map(({ key, icon: Icon, price, delay }, i) => {
          const svcKey = key as keyof ReturnType<typeof useTranslations<'services.services_list'>>
          return (
            <motion.div
              key={key}
              custom={i}
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              className="glass-card glass-card-hover rounded-2xl p-8 group"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="p-3 rounded-xl bg-gold/10 border border-gold/20 group-hover:bg-gold/15 transition-colors duration-300">
                  <Icon className="w-5 h-5 text-gold" />
                </div>
                <span className="font-display text-2xl font-medium text-gold">
                  {price ?? tSvc('consult')}
                </span>
              </div>

              <h3 className="font-display text-2xl font-medium text-white mb-3">
                {tSvc(`services_list.${key}.name` as `services_list.${typeof key}.name`)}
              </h3>
              <p className="text-muted text-sm leading-relaxed">
                {tSvc(`services_list.${key}.desc` as `services_list.${typeof key}.desc`)}
              </p>

              <Link
                href={`/${locale}/reservas?service=${key}`}
                className="inline-flex items-center gap-2 mt-6 text-gold/70 hover:text-gold text-sm font-medium transition-colors duration-200 group/link"
              >
                <span>{tSvc('book_service')}</span>
                <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform duration-200" />
              </Link>
            </motion.div>
          )
        })}
      </div>

      {/* View all link */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <Link
          href={`/${locale}/servicios`}
          className="inline-flex items-center gap-2 btn-outline-gold px-8 py-3.5 rounded-full text-sm font-medium group"
        >
          <span>{locale === 'es' ? 'Ver todos los servicios' : 'View all services'}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
        </Link>
      </motion.div>
    </section>
  )
}
