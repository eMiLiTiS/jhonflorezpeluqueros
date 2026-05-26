'use client'

import { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { useTranslations, useLocale } from 'next-intl'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Home, ChevronDown } from 'lucide-react'

const ParticleField = dynamic(() => import('@/components/3d/ParticleField'), {
  ssr: false,
})

export default function Hero() {
  const t = useTranslations('hero')
  const locale = useLocale()
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background image with parallax */}
      <motion.div className="absolute inset-0" style={{ y }}>
        <Image
          src="/Gemini_Generated_Image_xpc59xxpc59xxpc5.png"
          alt="Jhon Florez Peluqueros"
          fill
          priority
          className="object-cover object-center"
          quality={90}
        />
      </motion.div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-obsidian-800 via-obsidian-800/60 to-obsidian-800/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-obsidian-800/50 via-transparent to-obsidian-800/30" />

      {/* Particles */}
      <ParticleField />

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 text-center max-w-5xl mx-auto px-4 sm:px-6"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 text-gold text-sm font-medium mb-8"
        >
          <Home className="w-3.5 h-3.5" />
          <span>{t('home_service_badge')}</span>
        </motion.div>

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="flex justify-center mb-8"
        >
          <Image
            src="/logo-jf3.png"
            alt="JF"
            width={120}
            height={120}
            className="object-contain drop-shadow-[0_0_30px_rgba(201,169,110,0.5)] animate-float"
            priority
          />
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <h1 className="font-display font-light leading-tight mb-2">
            <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white/95">
              {t('tagline')}
            </span>
            <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl gold-text font-normal italic">
              {t('tagline2')}
            </span>
          </h1>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="w-24 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto my-8"
        />

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="text-white/70 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-12"
        >
          {t('subtitle')}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.75 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            href={`/${locale}/reservas`}
            className="btn-gold flex items-center gap-2 px-8 py-4 rounded-full text-base font-semibold group shadow-gold"
          >
            <span>{t('cta_book')}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
          <Link
            href={`/${locale}/servicios`}
            className="btn-outline-gold flex items-center gap-2 px-8 py-4 rounded-full text-base font-medium"
          >
            <span>{t('cta_services')}</span>
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-white/30 text-xs uppercase tracking-widest">
          {locale === 'es' ? 'Desplaza' : 'Scroll'}
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-5 h-5 text-gold/50" />
        </motion.div>
      </motion.div>
    </section>
  )
}
