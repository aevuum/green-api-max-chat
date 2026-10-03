const MIN_PHONE_LENGTH = 10
const MAX_PHONE_LENGTH = 15

export const normalizePhone = (input: string): string => {
  const digits = input.replace(/\D/g, '')

  if (digits.length === 11 && digits.startsWith('8')) {
    return `7${digits.slice(1)}`
  }

  if (digits.length === 10 && digits.startsWith('9')) {
    return `7${digits}`
  }

  return digits
}

export const isValidPhone = (phone: string): boolean =>
  /^\d+$/.test(phone) && phone.length >= MIN_PHONE_LENGTH && phone.length <= MAX_PHONE_LENGTH

export const formatPhone = (phone: string): string => {
  const russianNumber = phone.match(/^7(\d{3})(\d{3})(\d{2})(\d{2})$/)

  if (russianNumber) {
    const [, code, first, second, third] = russianNumber
    return `+7 ${code} ${first}-${second}-${third}`
  }

  return `+${phone}`
}
