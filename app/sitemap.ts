import { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://jhonflorezpeluqueros.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ['es', 'en']
  const routes = ['', '/servicios', '/reservas', '/nosotros', '/contacto']

  const entries: MetadataRoute.Sitemap = []

  for (const locale of locales) {
    for (const route of routes) {
      entries.push({
        url: `${BASE_URL}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'weekly' : 'monthly',
        priority: route === '' ? 1 : route === '/reservas' ? 0.9 : 0.8,
      })
    }
  }

  return entries
}
