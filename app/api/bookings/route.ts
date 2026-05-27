import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const isDev = process.env.NODE_ENV !== 'production'

export async function POST(request: NextRequest) {
  // Separate JSON parse (400) from processing errors (500)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let body: any
  try {
    body = await request.json()
  } catch {
    console.error('[POST /api/bookings] Failed to parse request JSON')
    return NextResponse.json(
      { error: 'Invalid request body', error_code: 'INVALID_JSON' },
      { status: 400 }
    )
  }

  try {
    // Log received keys — never log values (may contain PII)
    const receivedKeys = body && typeof body === 'object' ? Object.keys(body as object) : []
    console.log('[POST /api/bookings] received keys:', receivedKeys)

    const {
      customer_name,
      customer_email,
      customer_phone,
      service_name,
      preferred_date,
      preferred_time,
      notes,
      locale,
    } = body

    const required = ['customer_name', 'customer_email', 'customer_phone', 'service_name', 'preferred_date', 'preferred_time'] as const
    const missing = required.filter(k => !body[k])
    if (missing.length > 0) {
      console.error('[POST /api/bookings] missing required fields:', missing)
      return NextResponse.json(
        {
          error: 'Missing required fields',
          ...(isDev && { missing_fields: missing }),
        },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from('bookings')
      .insert({
        customer_name,
        customer_email,
        customer_phone,
        service_name,
        preferred_date,
        preferred_time,
        notes: notes || null,
        status: 'pending',
        locale: locale || 'es',
      })
      .select()
      .single()

    if (error) {
      console.error('[POST /api/bookings] Supabase insert error:', error.code, error.message)
      return NextResponse.json(
        {
          error: isDev ? error.message : 'Failed to save booking',
          error_code: error.code ?? 'DB_INSERT_FAILED',
        },
        { status: 500 }
      )
    }

    return NextResponse.json({ booking: data }, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[POST /api/bookings] Unexpected error:', message)
    return NextResponse.json(
      {
        error: isDev ? message : 'Internal server error',
        error_code: 'INTERNAL_ERROR',
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    let query = supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false })

    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) {
      console.error('[GET /api/bookings] Supabase query error:', error.code, error.message)
      return NextResponse.json(
        { error: isDev ? error.message : 'Failed to fetch bookings', error_code: error.code ?? 'DB_QUERY_FAILED' },
        { status: 500 }
      )
    }

    return NextResponse.json({ bookings: data })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[GET /api/bookings] Unexpected error:', message)
    return NextResponse.json(
      { error: isDev ? message : 'Internal server error', error_code: 'INTERNAL_ERROR' },
      { status: 500 }
    )
  }
}
