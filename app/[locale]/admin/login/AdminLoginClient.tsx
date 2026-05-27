'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter, useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { Lock, Mail, Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

export default function AdminLoginClient() {
  const t = useTranslations('admin')
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as string

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    if (!supabase) {
      setError(t('invalid_credentials'))
      setLoading(false)
      return
    }
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError(t('invalid_credentials'))
      setLoading(false)
      return
    }

    router.push(`/${locale}/admin/dashboard`)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-obsidian-800">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/3 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gold/3 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative"
      >
        <div className="glass-card rounded-3xl p-10">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <Image
              src="/images/logo-jf3.png"
              alt="JF"
              width={70}
              height={70}
              sizes="70px"
              className="object-contain mb-4"
            />
            <h1 className="font-display text-3xl font-light text-white">{t('login_title')}</h1>
            <p className="text-muted text-sm mt-1 text-center">{t('login_subtitle')}</p>
          </div>

          <div className="w-full h-px divider-gold mb-8" />

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <label className="flex items-center gap-2 text-sm text-white/60 mb-2">
                <Mail className="w-3.5 h-3.5 text-gold/60" />
                {t('email')}
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="form-input"
                placeholder="admin@email.com"
              />
            </div>

            {/* Password */}
            <div>
              <label className="flex items-center gap-2 text-sm text-white/60 mb-2">
                <Lock className="w-3.5 h-3.5 text-gold/60" />
                {t('password')}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="form-input pr-11"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center"
              >
                {error}
              </motion.div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-gold py-3.5 rounded-xl font-medium text-sm mt-2 disabled:opacity-60"
            >
              <span>{loading ? t('signing_in') : t('sign_in')}</span>
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
