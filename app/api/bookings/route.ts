import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient, createClient } from '@/lib/supabase/server'

const isDev = process.env.NODE_ENV !== 'production'

type EmailStatus = 'sent' | 'skipped' | 'failed'

function isEmailJSConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID &&
    process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY &&
    process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ADMIN &&
    process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_RECEIVED
  )
}

// Calls the EmailJS REST API directly — works in Node.js without @emailjs/browser.
// The public key is intentionally public; no secrets are sent.
async function sendEmailJS(
  templateId: string,
  templateParams: Record<string, string | null | undefined>
): Promise<void> {
  const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      service_id: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
      template_id: templateId,
      user_id: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
      template_params: templateParams,
    }),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '(no body)')
    throw new Error(`EmailJS HTTP ${res.status}: ${text}`)
  }
}

export async function POST(request: NextRequest) {
  // Separate JSON parse errors (400) from processing errors (500)
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

    // ── 1. Supabase insert — service role bypasses RLS; public users never write directly ──
    const supabase = createAdminClient()
    const { data, error: dbError } = await supabase
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

    if (dbError) {
      console.error('[POST /api/bookings] Supabase insert error:', dbError.code, dbError.message)
      return NextResponse.json(
        {
          error: isDev ? dbError.message : 'Failed to save booking',
          error_code: dbError.code ?? 'DB_INSERT_FAILED',
        },
        { status: 500 }
      )
    }

    // ── 2. Email notifications — optional, never blocks booking success ──
    let emailStatus: EmailStatus = 'skipped'
    let warning: string | null = null

    if (!isEmailJSConfigured()) {
      console.log('[POST /api/bookings] EmailJS not configured — skipping notifications')
      warning = 'EmailJS not configured'
    } else {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || ''
        await Promise.all([
          sendEmailJS(process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ADMIN!, {
            booking_id: data.id,
            customer_name: data.customer_name,
            customer_email: data.customer_email,
            customer_phone: data.customer_phone,
            service_name: data.service_name,
            preferred_date: data.preferred_date,
            preferred_time: data.preferred_time,
            notes: data.notes || '—',
            admin_url: `${baseUrl}/admin/dashboard`,
          }),
          sendEmailJS(process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_RECEIVED!, {
            to_email: data.customer_email,
            to_name: data.customer_name,
            service_name: data.service_name,
            preferred_date: data.preferred_date,
            preferred_time: data.preferred_time,
          }),
        ])
        emailStatus = 'sent'
        console.log('[POST /api/bookings] Email notifications sent for booking', data.id)
      } catch (emailErr) {
        emailStatus = 'failed'
        const msg = emailErr instanceof Error ? emailErr.message : String(emailErr)
        console.error('[POST /api/bookings] Email send failed (booking saved):', msg)
        warning = isDev ? msg : 'Email notification failed'
      }
    }

    return NextResponse.json(
      { success: true, booking: data, email_status: emailStatus, warning },
      { status: 201 }
    )
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
