const timeFormatter = new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit' })
const dateFormatter = new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: '2-digit' })
const dayFormatter = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long' })

const DAY_IN_MS = 24 * 60 * 60 * 1000

export const isSameDay = (left: number | Date, right: number | Date): boolean => {
  const leftDate = new Date(left)
  const rightDate = new Date(right)

  return (
    leftDate.getFullYear() === rightDate.getFullYear() &&
    leftDate.getMonth() === rightDate.getMonth() &&
    leftDate.getDate() === rightDate.getDate()
  )
}

export const formatTime = (timestamp: number): string => timeFormatter.format(timestamp)

export const formatShortDate = (timestamp: number, now = Date.now()): string =>
  isSameDay(timestamp, now) ? formatTime(timestamp) : dateFormatter.format(timestamp)

export const formatDayLabel = (timestamp: number, now = Date.now()): string => {
  if (isSameDay(timestamp, now)) {
    return 'Сегодня'
  }

  if (isSameDay(timestamp, now - DAY_IN_MS)) {
    return 'Вчера'
  }

  return dayFormatter.format(timestamp)
}
