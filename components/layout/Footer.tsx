'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'
import { Instagram, Facebook, Phone, Mail, MapPin, Clock } from 'lucide-react'

export default function Footer() {
  const t = useTranslations('footer')
  const locale = useLocale()
  const year = new Date().getFullYear()

  return (
    <footer className="bg-obsidian-700 border-t border-gold/10 mt-24">
      {/* Divider gradient */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href={`/${locale}`} className="inline-flex items-center gap-3 mb-5 group">
              <Image
                src="/images/logo-jf3.png"
                alt="Jhon Florez Peluqueros"
                width={50}
                height={50}
                sizes="50px"
                className="object-contain group-hover:scale-105 transition-transform duration-300"
              />
              <span className="font-display text-xl font-medium text-white/90">
                Jhon Florez
              </span>
            </Link>
            <p className="text-muted text-sm leading-relaxed mb-6">
              {t('tagline')}
            </p>
            {/* Socials */}
            <div className="flex gap-3">
              {[
                { icon: Instagram, href: '#', label: 'Instagram' },
                { icon: Facebook, href: '#', label: 'Facebook' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/5 border border-white/10 text-white/50 hover:text-gold hover:border-gold/30 hover:bg-gold/5 transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Legal column */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-gold mb-5 font-medium">
              {t('legal_title')}
            </h3>
            <ul className="space-y-3">
              {[
                { key: 'legal_notice', href: `/${locale}/aviso-legal` },
                { key: 'privacy', href: `/${locale}/privacidad` },
                { key: 'cookies', href: `/${locale}/cookies` },
                { key: 'booking_conditions', href: `/${locale}/condiciones-reserva` },
              ].map(({ key, href }) => (
                <li key={key}>
                  <Link
                    href={href}
                    className="text-sm text-muted hover:text-gold transition-colors duration-200"
                  >
                    {t(key as 'legal_notice' | 'privacy' | 'cookies' | 'booking_conditions')}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Bookings column */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-gold mb-5 font-medium">
              {t('bookings_title')}
            </h3>
            <div className="flex items-center gap-2 mb-3 text-muted">
              <Clock className="w-4 h-4 text-gold/60 flex-shrink-0" />
              <span className="text-sm">{t('bookings_desc')}</span>
            </div>
            <Link
              href={`/${locale}/reservas`}
              className="inline-flex items-center gap-2 btn-gold px-5 py-2.5 rounded-full text-sm mt-4"
            >
              <span>{locale === 'es' ? 'Reservar cita' : 'Book now'}</span>
            </Link>
          </div>

          {/* Contact column */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-gold mb-5 font-medium">
              {t('contact_title')}
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:jhonarnulfa1402@gmail.com"
                  className="flex items-center gap-2 text-sm text-muted hover:text-gold transition-colors duration-200"
                >
                  <Mail className="w-4 h-4 text-gold/60 flex-shrink-0" />
                  <span>jhonarnulfa1402@gmail.com</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+34641093550"
                  className="flex items-center gap-2 text-sm text-muted hover:text-gold transition-colors duration-200"
                >
                  <Phone className="w-4 h-4 text-gold/60 flex-shrink-0" />
                  <span>+34 641 09 35 50</span>
                </a>
              </li>
              <li>
                <span className="flex items-center gap-2 text-sm text-muted">
                  <MapPin className="w-4 h-4 text-gold/60 flex-shrink-0" />
                  <span>{t('location')}</span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mt-12 mb-6" />

        {/* Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted">
          <span>© {year} Jhon Florez Peluqueros. {t('copyright')}</span>
          <span>{t('made_with')}</span>
        </div>
      </div>
    </footer>
  )
}
