import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateStr: string, locale: string = 'es'): string {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatTime(timeStr: string): string {
  const [h, m] = timeStr.split(':')
  return `${h}:${m}`
}

export function generateTimeSlots(
  startHour = 9,
  endHour = 21,
  intervalMinutes = 30
): string[] {
  const slots: string[] = []
  for (let h = startHour; h < endHour; h++) {
    for (let m = 0; m < 60; m += intervalMinutes) {
      slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
    }
  }
  return slots
}

export function isDateAvailable(date: Date): boolean {
  const now = new Date()
  const minDate = new Date(now.getTime() + 24 * 60 * 60 * 1000) // +24h
  const maxDate = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000) // +60 days
  return date >= minDate && date <= maxDate
}
