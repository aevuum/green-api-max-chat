import type { GreenApiCredentials } from '@/shared/api'

export type CredentialsErrors = Partial<Record<keyof GreenApiCredentials, string>>

const DIGITS_ONLY = /^\d+$/

const isValidUrl = (value: string): boolean => {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:'
  } catch {
    return false
  }
}

export const normalizeCredentials = (values: GreenApiCredentials): GreenApiCredentials => ({
  apiUrl: values.apiUrl.trim().replace(/\/+$/, ''),
  idInstance: values.idInstance.trim(),
  apiTokenInstance: values.apiTokenInstance.trim(),
})

export const validateCredentials = (values: GreenApiCredentials): CredentialsErrors => {
  const errors: CredentialsErrors = {}

  if (!isValidUrl(values.apiUrl)) {
    errors.apiUrl = 'Укажите корректный apiUrl, например https://api.green-api.com/v3'
  }

  if (!values.idInstance) {
    errors.idInstance = 'Введите idInstance'
  } else if (!DIGITS_ONLY.test(values.idInstance)) {
    errors.idInstance = 'idInstance состоит только из цифр'
  }

  if (!values.apiTokenInstance) {
    errors.apiTokenInstance = 'Введите apiTokenInstance'
  }

  return errors
}

export const hasErrors = (errors: CredentialsErrors): boolean => Object.keys(errors).length > 0
