export type BookingStatus = 'pending' | 'confirmed' | 'cancelled'

export interface Service {
  id: string
  name_es: string
  name_en: string
  description_es: string | null
  description_en: string | null
  price_display: string
  price_min: number | null
  category: 'men' | 'women' | 'bridal' | 'treatment' | 'makeup'
  duration_minutes: number | null
  is_active: boolean
  sort_order: number
}

export interface Booking {
  id: string
  created_at: string
  updated_at: string
  customer_name: string
  customer_email: string
  customer_phone: string
  service_id: string | null
  service_name: string
  preferred_date: string
  preferred_time: string
  notes: string | null
  status: BookingStatus
  admin_notes: string | null
  calendar_event_id: string | null
  locale: string
}

export interface BookingFormData {
  service_name: string
  preferred_date: string
  preferred_time: string
  customer_name: string
  customer_email: string
  customer_phone: string
  notes?: string
  gdpr_consent: boolean
}

export interface AdminNote {
  id: string
  booking_id: string
  note: string
  created_at: string
}

export interface DashboardStats {
  total: number
  pending: number
  confirmed: number
  cancelled: number
}
