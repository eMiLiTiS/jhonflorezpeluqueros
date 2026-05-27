import { createServerClient } from '@supabase/ssr'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

type CookieToSet = { name: string; value: string; options?: object }

function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) {
    throw new Error(
      'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
    )
  }
  return { url, key }
}

export async function createClient() {
  const { url, key } = getSupabaseEnv()
  const cookieStore = await cookies()

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet: CookieToSet[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            cookieStore.set(name, value, options as any)
          )
        } catch {
          // Server Component — cookies can be set via middleware only
        }
      },
    },
  })
}

// Service role client — bypasses RLS, no session or cookie management needed.
// Use only in trusted server-side contexts (API routes, not middleware).
export function createAdminClient() {
  const { url } = getSupabaseEnv()
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) {
    throw new Error('Supabase is not configured. Set SUPABASE_SERVICE_ROLE_KEY.')
  }
  return createSupabaseClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
