interface CalendarEventParams {
  customerName: string
  serviceName: string
  date: string        // YYYY-MM-DD
  time: string        // HH:MM
  phone: string
  email: string
  notes?: string | null
  durationMinutes?: number
}

async function getAccessToken(): Promise<string> {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN!,
      grant_type: 'refresh_token',
    }),
    next: { revalidate: 0 },
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Google token exchange failed: ${body}`)
  }

  const data: { access_token?: string } = await res.json()
  if (!data.access_token) throw new Error('No access_token in Google response')
  return data.access_token
}

export async function createCalendarEvent(params: CalendarEventParams): Promise<string | null> {
  const {
    customerName,
    serviceName,
    date,
    time,
    phone,
    email,
    notes,
    durationMinutes = 60,
  } = params

  const accessToken = await getAccessToken()
  const calendarId = encodeURIComponent(process.env.GOOGLE_CALENDAR_ID ?? 'primary')

  const startISO = new Date(`${date}T${time}:00`).toISOString()
  const endISO = new Date(
    new Date(`${date}T${time}:00`).getTime() + durationMinutes * 60_000
  ).toISOString()

  const descriptionLines = [
    `👤 Cliente: ${customerName}`,
    `✂️ Servicio: ${serviceName}`,
    `📞 Teléfono: ${phone}`,
    `✉️ Email: ${email}`,
    notes ? `📝 Notas: ${notes}` : null,
  ].filter(Boolean)

  const body = {
    summary: `${serviceName} — ${customerName}`,
    description: descriptionLines.join('\n'),
    start: { dateTime: startISO, timeZone: 'Europe/Madrid' },
    end: { dateTime: endISO, timeZone: 'Europe/Madrid' },
    colorId: '5', // banana
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'popup', minutes: 60 },
        { method: 'popup', minutes: 15 },
      ],
    },
  }

  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  )

  if (!res.ok) return null

  const data: { id?: string } = await res.json()
  return data.id ?? null
}

export async function deleteCalendarEvent(eventId: string): Promise<void> {
  const accessToken = await getAccessToken()
  const calendarId = encodeURIComponent(process.env.GOOGLE_CALENDAR_ID ?? 'primary')

  await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${eventId}`,
    {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  )
}

export function isGoogleCalendarConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET &&
    process.env.GOOGLE_REFRESH_TOKEN
  )
}
