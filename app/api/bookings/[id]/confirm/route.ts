import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isGoogleCalendarConfigured, createCalendarEvent } from '@/lib/google-calendar'

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Fetch booking before update so we have data for calendar event
  const { data: booking, error: fetchError } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', id)
    .single()

  if (fetchError || !booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  }

  const { data, error } = await supabase
    .from('bookings')
    .update({ status: 'confirmed', updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Create Google Calendar event asynchronously — non-blocking
  if (isGoogleCalendarConfigured() && !booking.calendar_event_id) {
    createCalendarEvent({
      customerName: booking.customer_name,
      serviceName: booking.service_name,
      date: booking.preferred_date,
      time: booking.preferred_time,
      phone: booking.customer_phone,
      email: booking.customer_email,
      notes: booking.notes,
    })
      .then(eventId => {
        if (eventId) {
          supabase
            .from('bookings')
            .update({ calendar_event_id: eventId })
            .eq('id', id)
            .then(() => {})
        }
      })
      .catch(() => {
        // Calendar failure is non-critical
      })
  }

  return NextResponse.json({ booking: data })
}
