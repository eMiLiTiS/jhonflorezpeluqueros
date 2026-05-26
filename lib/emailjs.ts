'use client'

import emailjs from '@emailjs/browser'
import type { Booking } from '@/types'

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
const TEMPLATE_ADMIN = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ADMIN!
const TEMPLATE_RECEIVED = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_RECEIVED!
const TEMPLATE_CONFIRMED = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_CONFIRMED!
const TEMPLATE_CANCELLED = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_CANCELLED!

export async function sendAdminNotification(booking: Partial<Booking>) {
  return emailjs.send(
    SERVICE_ID,
    TEMPLATE_ADMIN,
    {
      booking_id: booking.id,
      customer_name: booking.customer_name,
      customer_email: booking.customer_email,
      customer_phone: booking.customer_phone,
      service_name: booking.service_name,
      preferred_date: booking.preferred_date,
      preferred_time: booking.preferred_time,
      notes: booking.notes || '—',
      admin_url: `${process.env.NEXT_PUBLIC_BASE_URL}/admin/dashboard`,
    },
    PUBLIC_KEY
  )
}

export async function sendBookingReceived(booking: Partial<Booking>) {
  return emailjs.send(
    SERVICE_ID,
    TEMPLATE_RECEIVED,
    {
      to_email: booking.customer_email,
      to_name: booking.customer_name,
      service_name: booking.service_name,
      preferred_date: booking.preferred_date,
      preferred_time: booking.preferred_time,
    },
    PUBLIC_KEY
  )
}

export async function sendBookingConfirmed(booking: Partial<Booking>) {
  return emailjs.send(
    SERVICE_ID,
    TEMPLATE_CONFIRMED,
    {
      to_email: booking.customer_email,
      to_name: booking.customer_name,
      service_name: booking.service_name,
      preferred_date: booking.preferred_date,
      preferred_time: booking.preferred_time,
    },
    PUBLIC_KEY
  )
}

export async function sendBookingCancelled(booking: Partial<Booking>) {
  return emailjs.send(
    SERVICE_ID,
    TEMPLATE_CANCELLED,
    {
      to_email: booking.customer_email,
      to_name: booking.customer_name,
      service_name: booking.service_name,
      preferred_date: booking.preferred_date,
      preferred_time: booking.preferred_time,
    },
    PUBLIC_KEY
  )
}
