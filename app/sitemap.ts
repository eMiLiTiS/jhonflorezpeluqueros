import { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://jhonflorezpeluqueros.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ['es', 'en']
  const mainRoutes = [
    { path: '', priority: 1.0, changeFrequency: 'weekly' as const },
    { path: '/reservas', priority: 0.95, changeFrequency: 'monthly' as const },
    { path: '/servicios', priority: 0.85, changeFrequency: 'monthly' as const },
    { path: '/nosotros', priority: 0.75, changeFrequency: 'monthly' as const },
    { path: '/contacto', priority: 0.75, changeFrequency: 'monthly' as const },
  ]
  const legalRoutes = [
    { path: '/privacidad', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/aviso-legal', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/cookies', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/condiciones-reserva', priority: 0.3, changeFrequency: 'yearly' as const },
  ]

  const entries: MetadataRoute.Sitemap = []
  const now = new Date()

  for (const locale of locales) {
    for (const { path, priority, changeFrequency } of [...mainRoutes, ...legalRoutes]) {
      entries.push({
        url: `${BASE_URL}/${locale}${path}`,
        lastModified: now,
        changeFrequency,
        priority,
        alternates: {
          languages: Object.fromEntries(
            locales.map(l => [l, `${BASE_URL}/${l}${path}`])
          ),
        },
      })
    }
  }

  return entries
}
