import { describe, expect, it } from 'vitest'
import { formatPhone, isValidPhone, normalizePhone } from './phone'

describe('normalizePhone', () => {
  it.each([
    ['+7 (999) 123-45-67', '79991234567'],
    ['8 999 123 45 67', '79991234567'],
    ['9991234567', '79991234567'],
    ['+998 90 123 45 67', '998901234567'],
  ])('normalizes %s to %s', (input, expected) => {
    expect(normalizePhone(input)).toBe(expected)
  })
})

describe('isValidPhone', () => {
  it('accepts international numbers', () => {
    expect(isValidPhone('79991234567')).toBe(true)
  })

  it('rejects too short numbers', () => {
    expect(isValidPhone('12345')).toBe(false)
  })
})

describe('formatPhone', () => {
  it('formats russian numbers', () => {
    expect(formatPhone('79991234567')).toBe('+7 999 123-45-67')
  })

  it('adds a plus sign to other numbers', () => {
    expect(formatPhone('998901234567')).toBe('+998901234567')
  })
})
