'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Menu, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/', key: 'home' },
  { href: '/servicios', key: 'services' },
  { href: '/reservas', key: 'booking' },
  { href: '/nosotros', key: 'about' },
  { href: '/contacto', key: 'contact' },
] as const

export default function Navbar() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const altLocale = locale === 'es' ? 'en' : 'es'
  const localePath = pathname.replace(`/${locale}`, '') || '/'

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          isScrolled
            ? 'bg-obsidian-800/95 backdrop-blur-xl border-b border-gold-subtle py-3'
            : 'bg-transparent py-5'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href={`/${locale}`} className="flex items-center gap-3 group">
              <div className="relative w-12 h-12 transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/logo-jf3.png"
                  alt="Jhon Florez Peluqueros"
                  fill
                  className="object-contain drop-shadow-[0_0_8px_rgba(201,169,110,0.4)]"
                  priority
                />
              </div>
              <span className="hidden sm:block font-display text-lg font-medium tracking-wide text-white/90 group-hover:text-gold transition-colors duration-300">
                Jhon Florez
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map(({ href, key }) => {
                const fullHref = `/${locale}${href === '/' ? '' : href}`
                const isActive = pathname === fullHref || (href !== '/' && pathname.startsWith(fullHref))
                return (
                  <Link
                    key={key}
                    href={fullHref}
                    className={cn(
                      'px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                      isActive
                        ? 'text-gold bg-gold/10'
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                    )}
                  >
                    {t(key)}
                  </Link>
                )
              })}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* Language switcher */}
              <Link
                href={`/${altLocale}${localePath === '/' ? '' : localePath}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white/60 hover:text-gold border border-white/10 hover:border-gold/30 transition-all duration-200"
                title={altLocale === 'es' ? 'Español' : 'English'}
              >
                <Globe className="w-3.5 h-3.5" />
                <span className="uppercase">{altLocale}</span>
              </Link>

              {/* Book CTA */}
              <Link
                href={`/${locale}/reservas`}
                className="hidden sm:flex items-center btn-gold px-5 py-2.5 rounded-full text-sm"
              >
                <span>{t('book_now')}</span>
              </Link>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsOpen(true)}
                className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 text-white hover:border-gold/30 transition-colors"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm lg:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-80 bg-obsidian-700 border-l border-gold/10 lg:hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-gold/10">
                <Image
                  src="/logo-jf3.png"
                  alt="JF"
                  width={44}
                  height={44}
                  className="object-contain"
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-white/5 text-white/70 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                {NAV_LINKS.map(({ href, key }, i) => {
                  const fullHref = `/${locale}${href === '/' ? '' : href}`
                  const isActive = pathname === fullHref || (href !== '/' && pathname.startsWith(fullHref))
                  return (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        href={fullHref}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          'flex items-center px-4 py-3.5 rounded-xl text-base font-medium transition-all duration-200',
                          isActive
                            ? 'text-gold bg-gold/10 border border-gold/20'
                            : 'text-white/70 hover:text-white hover:bg-white/5'
                        )}
                      >
                        {t(key)}
                      </Link>
                    </motion.div>
                  )
                })}
              </div>

              <div className="p-6 space-y-3 border-t border-gold/10">
                <Link
                  href={`/${locale}/reservas`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center btn-gold px-6 py-3.5 rounded-xl text-base font-medium w-full"
                >
                  <span>{t('book_now')}</span>
                </Link>
                <Link
                  href={`/${altLocale}${localePath === '/' ? '' : localePath}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 btn-outline-gold px-6 py-3 rounded-xl text-sm w-full"
                >
                  <Globe className="w-4 h-4" />
                  {altLocale === 'es' ? 'Español' : 'English'}
                </Link>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
