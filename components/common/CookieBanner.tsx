'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { Cookie } from 'lucide-react'

export default function CookieBanner() {
  const t = useTranslations('cookie')
  const locale = useLocale()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  function accept() {
    localStorage.setItem('cookie-consent', 'accepted')
    setVisible(false)
  }

  function reject() {
    localStorage.setItem('cookie-consent', 'rejected')
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-24 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-sm z-50"
        >
          <div className="glass-card rounded-2xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 rounded-lg bg-gold/10 flex-shrink-0 mt-0.5">
                <Cookie className="w-4 h-4 text-gold" />
              </div>
              <p className="text-sm text-muted leading-relaxed">
                {t('message')}{' '}
                <Link
                  href={`/${locale}/cookies`}
                  className="text-gold hover:underline"
                >
                  {t('learn_more')}
                </Link>
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={accept}
                className="flex-1 btn-gold py-2 px-4 rounded-xl text-sm font-medium"
              >
                <span>{t('accept')}</span>
              </button>
              <button
                onClick={reject}
                className="flex-1 btn-outline-gold py-2 px-4 rounded-xl text-sm font-medium"
              >
                {t('reject')}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
