import { describe, expect, it } from 'vitest'
import { formatDayLabel, formatShortDate, isSameDay } from './formatDate'

const NOW = new Date(2026, 9, 3, 15, 30).getTime()

describe('formatDate', () => {
  it('compares calendar days', () => {
    expect(isSameDay(new Date(2026, 9, 3, 0, 1), new Date(2026, 9, 3, 23, 59))).toBe(true)
    expect(isSameDay(new Date(2026, 9, 3), new Date(2026, 9, 4))).toBe(false)
  })

  it('shows time for today and date for older messages', () => {
    expect(formatShortDate(new Date(2026, 9, 3, 9, 5).getTime(), NOW)).toBe('09:05')
    expect(formatShortDate(new Date(2026, 8, 28, 9, 5).getTime(), NOW)).toBe('28.09')
  })

  it('labels days relative to now', () => {
    expect(formatDayLabel(NOW, NOW)).toBe('Сегодня')
    expect(formatDayLabel(new Date(2026, 9, 2).getTime(), NOW)).toBe('Вчера')
    expect(formatDayLabel(new Date(2026, 8, 28).getTime(), NOW)).toBe('28 сентября')
  })
})
