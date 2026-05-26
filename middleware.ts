import { createServerClient } from '@supabase/ssr'
import createNextIntlMiddleware from 'next-intl/middleware'
import { NextRequest, NextResponse } from 'next/server'
import { routing } from './i18n/routing'

type CookieToSet = { name: string; value: string; options?: object }

const handleI18n = createNextIntlMiddleware(routing)

export async function middleware(request: NextRequest) {
  // i18n middleware first — captures locale redirects and rewrites
  const i18nResponse = handleI18n(request)

  // If i18n wants to redirect (e.g. /en → /), respect it immediately
  if (i18nResponse.status !== 200) return i18nResponse

  // Build a mutable response that Supabase can write auth cookies into
  let response = NextResponse.next({ request })

  // Transfer i18n-set headers/cookies into our response
  i18nResponse.headers.forEach((value, key) => {
    if (key.toLowerCase() !== 'set-cookie') response.headers.set(key, value)
  })
  i18nResponse.cookies.getAll().forEach(cookie =>
    response.cookies.set(cookie.name, cookie.value, cookie)
  )

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(cookiesToSet: CookieToSet[]) {
          // Propagate updated cookies into the mutable request
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          // Re-apply i18n headers after response was re-created
          i18nResponse.headers.forEach((v, k) => {
            if (k.toLowerCase() !== 'set-cookie') response.headers.set(k, v)
          })
          i18nResponse.cookies.getAll().forEach(c =>
            response.cookies.set(c.name, c.value, c)
          )
          cookiesToSet.forEach(({ name, value, options }) =>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            response.cookies.set(name, value, options as any)
          )
        },
      },
    }
  )

  // IMPORTANT: Do not add any logic between createServerClient and getUser()
  const { data: { user } } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // Protect admin dashboard — redirect to login if not authenticated
  if (/\/admin\/dashboard/.test(pathname) && !user) {
    const locale = pathname.match(/^\/(es|en)/)?.[1] ?? 'es'
    return NextResponse.redirect(new URL(`/${locale}/admin/login`, request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
