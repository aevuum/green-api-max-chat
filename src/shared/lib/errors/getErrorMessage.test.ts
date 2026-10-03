import { describe, expect, it } from 'vitest'
import { HttpError, NetworkError } from '@/shared/api'
import { getErrorMessage } from './getErrorMessage'

describe('getErrorMessage', () => {
  it('maps known HTTP statuses to readable messages', () => {
    expect(getErrorMessage(new HttpError(401, 'Unauthorized'))).toBe(
      'Неверный idInstance или apiTokenInstance',
    )
  })

  it('falls back to a generic message for unknown HTTP statuses', () => {
    expect(getErrorMessage(new HttpError(502, 'Bad Gateway'))).toBe(
      'Ошибка сервера GREEN-API (502)',
    )
  })

  it('describes network failures', () => {
    expect(getErrorMessage(new NetworkError())).toMatch(/Не удалось связаться/)
  })

  it('uses the message of a regular error', () => {
    expect(getErrorMessage(new Error('Custom'))).toBe('Custom')
  })

  it('handles non-error values', () => {
    expect(getErrorMessage('oops')).toBe('Что-то пошло не так, попробуйте ещё раз')
  })
})
