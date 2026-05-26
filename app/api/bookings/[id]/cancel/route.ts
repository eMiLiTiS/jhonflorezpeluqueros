import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isGoogleCalendarConfigured, deleteCalendarEvent } from '@/lib/google-calendar'

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Get calendar_event_id before cancelling
  const { data: booking } = await supabase
    .from('bookings')
    .select('calendar_event_id')
    .eq('id', id)
    .single()

  const { data, error } = await supabase
    .from('bookings')
    .update({ status: 'cancelled', updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Remove Google Calendar event if one was created
  if (isGoogleCalendarConfigured() && booking?.calendar_event_id) {
    deleteCalendarEvent(booking.calendar_event_id).catch(() => {})
  }

  return NextResponse.json({ booking: data })
}
