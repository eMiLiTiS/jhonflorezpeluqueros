import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

interface Props {
  title: string
  body: string
  backLabel?: string
  backHref?: string
}

export default function LegalPage({ title, body, backLabel, backHref }: Props) {
  return (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      {backHref && backLabel && (
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-gold transition-colors mb-8 group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          {backLabel}
        </Link>
      )}

      <p className="section-label mb-4">Jhon Florez Peluqueros</p>
      <h1 className="font-display text-4xl sm:text-5xl font-light text-white mb-6">{title}</h1>

      <div className="h-px bg-gradient-to-r from-gold/40 to-transparent mb-10" />

      <article className="glass-card rounded-2xl p-8 sm:p-10">
        <p className="text-white/70 leading-[1.85] text-[0.9375rem]">{body}</p>
      </article>

      <p className="text-center text-muted text-xs mt-8">
        © {new Date().getFullYear()} Jhon Florez Peluqueros
      </p>
    </div>
  )
}
