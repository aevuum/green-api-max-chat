import { HttpError, NetworkError } from '@/shared/api'

const HTTP_ERROR_MESSAGES: Record<number, string> = {
  400: 'Некорректный запрос. Проверьте введённые данные',
  401: 'Неверный idInstance или apiTokenInstance',
  403: 'Доступ запрещён: проверьте idInstance и apiTokenInstance',
  404: 'Инстанс не найден. Проверьте apiUrl и idInstance',
  429: 'Слишком много запросов, попробуйте чуть позже',
  466: 'Исчерпан лимит запросов по тарифу инстанса',
}

const FALLBACK_MESSAGE = 'Что-то пошло не так, попробуйте ещё раз'

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof HttpError) {
    return HTTP_ERROR_MESSAGES[error.status] ?? `Ошибка сервера GREEN-API (${error.status})`
  }

  if (error instanceof NetworkError) {
    return 'Не удалось связаться с GREEN-API. Проверьте подключение и apiUrl'
  }

  if (error instanceof Error && error.message) {
    return error.message
  }

  return FALLBACK_MESSAGE
}
