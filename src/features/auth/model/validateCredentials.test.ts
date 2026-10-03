import { describe, expect, it } from 'vitest'
import { hasErrors, normalizeCredentials, validateCredentials } from './validateCredentials'

const validCredentials = {
  apiUrl: 'https://api.green-api.com/v3',
  idInstance: '3100000001',
  apiTokenInstance: 'token',
}

describe('validateCredentials', () => {
  it('accepts valid credentials', () => {
    expect(hasErrors(validateCredentials(validCredentials))).toBe(false)
  })

  it('requires idInstance to contain only digits', () => {
    const errors = validateCredentials({ ...validCredentials, idInstance: '31abc' })

    expect(errors.idInstance).toBe('idInstance состоит только из цифр')
  })

  it('reports every empty field', () => {
    const errors = validateCredentials({ apiUrl: '', idInstance: '', apiTokenInstance: '' })

    expect(Object.keys(errors)).toEqual(['apiUrl', 'idInstance', 'apiTokenInstance'])
  })
})

describe('normalizeCredentials', () => {
  it('trims values and removes a trailing slash from apiUrl', () => {
    expect(
      normalizeCredentials({
        apiUrl: ' https://api.green-api.com/v3/ ',
        idInstance: ' 3100000001 ',
        apiTokenInstance: ' token ',
      }),
    ).toEqual(validCredentials)
  })
})
