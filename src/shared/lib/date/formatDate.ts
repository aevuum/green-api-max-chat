const timeFormatter = new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit' })
const dateFormatter = new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: '2-digit' })

const isSameDay = (left: Date, right: Date): boolean =>
  left.getFullYear() === right.getFullYear() &&
  left.getMonth() === right.getMonth() &&
  left.getDate() === right.getDate()

export const formatTime = (timestamp: number): string => timeFormatter.format(timestamp)

export const formatShortDate = (timestamp: number, now = new Date()): string =>
  isSameDay(new Date(timestamp), now) ? formatTime(timestamp) : dateFormatter.format(timestamp)
