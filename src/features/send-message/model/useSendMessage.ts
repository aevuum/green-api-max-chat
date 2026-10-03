import { useCallback } from 'react'
import { useChatStore } from '@/entities/chat'
import { useGreenApiClient } from '@/entities/session'

const createLocalId = () => `local-${crypto.randomUUID()}`

export const useSendMessage = (chatId: string) => {
  const client = useGreenApiClient()
  const addMessage = useChatStore((state) => state.addMessage)
  const updateMessage = useChatStore((state) => state.updateMessage)

  return useCallback(
    async (text: string) => {
      const localId = createLocalId()

      addMessage(chatId, {
        id: localId,
        text,
        direction: 'outgoing',
        timestamp: Date.now(),
        status: 'pending',
      })

      try {
        const { idMessage } = await client.sendMessage({ chatId, message: text })
        updateMessage(chatId, localId, { id: idMessage, status: 'sent' })
      } catch {
        updateMessage(chatId, localId, { status: 'failed' })
      }
    },
    [chatId, client, addMessage, updateMessage],
  )
}
