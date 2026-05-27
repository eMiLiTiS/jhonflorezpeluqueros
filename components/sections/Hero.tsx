'use client'

import { useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { useTranslations, useLocale } from 'next-intl'
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import { ArrowRight, Home, ChevronDown, Star } from 'lucide-react'

const ParticleField = dynamic(() => import('@/components/3d/ParticleField'), {
  ssr: false,
})

function MagneticButton({
  children,
  className,
  href,
}: {
  children: React.ReactNode
  className?: string
  href: string
}) {
  const ref = useRef<HTMLAnchorElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 350, damping: 25 })
  const springY = useSpring(y, { stiffness: 350, damping: 25 })

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    x.set((e.clientX - cx) * 0.25)
    y.set((e.clientY - cy) * 0.25)
  }, [x, y])

  const handleMouseLeave = useCallback(() => {
    x.set(0)
    y.set(0)
  }, [x, y])

  return (
    <motion.a
      ref={ref}
      href={href}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
    >
      {children}
    </motion.a>
  )
}

const STATS = [
  { value: '10+', label: { es: 'Años de exp.', en: 'Years exp.' } },
  { value: '500+', label: { es: 'Clientes felices', en: 'Happy clients' } },
  { value: '100%', label: { es: 'A domicilio', en: 'Home service' } },
]

export default function Hero() {
  const t = useTranslations('hero')
  const locale = useLocale()
  const ref = useRef<HTMLDivElement>(null)
  const [imageLoaded, setImageLoaded] = useState(false)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '28%'])
  const opacity = useTransform(scrollYProgress, [0, 0.55], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.04])

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      aria-label={locale === 'es' ? 'Sección principal' : 'Hero section'}
    >
      {/* Background image with parallax */}
      <motion.div className="absolute inset-0" style={{ y, scale }}>
        <Image
          src="/images/Gemini_Generated_Image_xpc59xxpc59xxpc5.png"
          alt="Jhon Florez Peluqueros — servicio de peluquería a domicilio en Valencia"
          fill
          priority
          fetchPriority="high"
          className={`object-cover object-[center_38%] transition-opacity duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          quality={90}
          onLoad={() => setImageLoaded(true)}
          sizes="100vw"
        />
      </motion.div>

      {/* Layered gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-obsidian-800 via-obsidian-800/55 to-obsidian-800/15" />
      <div className="absolute inset-0 bg-gradient-to-r from-obsidian-800/40 via-transparent to-obsidian-800/25" />
      <div className="absolute inset-0 bg-radial-gradient" style={{
        background: 'radial-gradient(ellipse at 60% 40%, rgba(201,169,110,0.04) 0%, transparent 70%)'
      }} />

      {/* 3D Particle field */}
      <ParticleField />

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 text-center max-w-5xl mx-auto px-4 sm:px-6 pt-20"
      >
        {/* Home service badge */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/25 text-gold text-sm font-medium mb-8 backdrop-blur-sm"
        >
          <Home className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{t('home_service_badge')}</span>
        </motion.div>

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.75 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="flex justify-center mb-8"
        >
          {/* Outer wrapper animates — glow and logo float together */}
          <div className="relative w-[114px] h-[114px] animate-float">
            {/* Ambient aura — co-anchored to wrapper */}
            <div className="absolute inset-0 rounded-full bg-gold/20 blur-3xl scale-[1.65] animate-pulse-gold pointer-events-none" />
            {/* 2 px gradient ring shell: bright gold top → dim mid → gold bottom */}
            <div className="relative z-10 w-full h-full rounded-full p-[2px] bg-gradient-to-b from-gold/55 via-gold/15 to-gold/50 shadow-[0_12px_40px_rgba(0,0,0,0.55)]">
              {/* Dark backing clips white PNG corners, ensures contrast on dark hero */}
              <div className="w-full h-full rounded-full overflow-hidden bg-obsidian-800/65">
                <Image
                  src="/images/logo-jf3.png"
                  alt="Jhon Florez Peluqueros"
                  width={110}
                  height={110}
                  sizes="114px"
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="font-display font-light leading-tight mb-2">
            <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-white/95 drop-shadow-[0_2px_20px_rgba(0,0,0,0.5)]">
              {t('tagline')}
            </span>
            <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl gold-text font-normal italic drop-shadow-[0_2px_20px_rgba(201,169,110,0.3)]">
              {t('tagline2')}
            </span>
          </h1>
        </motion.div>

        {/* Decorative divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-center gap-3 my-8"
        >
          <div className="h-px w-20 bg-gradient-to-r from-transparent to-gold/50" />
          <Star className="w-3 h-3 text-gold/70 fill-current" aria-hidden="true" />
          <div className="h-px w-20 bg-gradient-to-l from-transparent to-gold/50" />
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="text-white/65 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-12"
        >
          {t('subtitle')}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
        >
          <Link
            href={`/${locale}/reservas`}
            className="btn-gold flex items-center gap-2.5 px-9 py-4 rounded-full text-base font-semibold group shadow-gold hover:shadow-gold-lg transition-shadow duration-300 relative overflow-hidden"
          >
            <span className="relative z-10">{t('cta_book')}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200 relative z-10" aria-hidden="true" />
          </Link>
          <Link
            href={`/${locale}/servicios`}
            className="btn-outline-gold flex items-center gap-2.5 px-9 py-4 rounded-full text-base font-medium backdrop-blur-sm"
          >
            <span>{t('cta_services')}</span>
          </Link>
        </motion.div>

        {/* Social proof stats */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.95, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-center gap-8 sm:gap-12"
        >
          {STATS.map(({ value, label }, i) => (
            <div key={i} className="text-center">
              <p className="font-display text-2xl sm:text-3xl font-semibold text-gold">{value}</p>
              <p className="text-white/40 text-xs mt-0.5 uppercase tracking-wide">
                {label[locale as 'es' | 'en'] ?? label.es}
              </p>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        aria-hidden="true"
      >
        <span className="text-white/25 text-xs uppercase tracking-[0.2em]">
          {locale === 'es' ? 'Desplaza' : 'Scroll'}
        </span>
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-5 h-5 text-gold/40" />
        </motion.div>
      </motion.div>
    </section>
  )
}
