import { useChatStore } from '@/entities/chat'
import { useGreenApiClient } from '@/entities/session'
import { useAsyncAction } from '@/shared/lib/hooks'
import { formatPhone, isValidPhone, normalizePhone } from '@/shared/lib/phone'

export const useCreateChat = () => {
  const client = useGreenApiClient()
  const openChat = useChatStore((state) => state.openChat)

  return useAsyncAction(async (rawPhone: string) => {
    const phone = normalizePhone(rawPhone)

    if (!isValidPhone(phone)) {
      throw new Error('Введите номер в международном формате, например +7 999 123-45-67')
    }

    const { exist, chatId } = await client.checkAccount(Number(phone))

    if (!exist || !chatId) {
      throw new Error('Этот номер не зарегистрирован в MAX')
    }

    openChat({ id: chatId, title: formatPhone(phone), phone })

    return chatId
  })
}
