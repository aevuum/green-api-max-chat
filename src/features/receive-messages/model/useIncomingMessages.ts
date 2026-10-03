import { useEffect, useState } from 'react'
import { useChatStore } from '@/entities/chat'
import { useGreenApiClient } from '@/entities/session'
import type { WebhookBody } from '@/shared/api'
import { RECEIVE_NOTIFICATION_TIMEOUT_SECONDS } from '@/shared/config'
import { NotificationPoller } from './NotificationPoller'
import { parseNotification } from './parseNotification'

const applyNotification = (body: WebhookBody) => {
  const event = parseNotification(body)

  if (!event) {
    return
  }

  const { addMessage, updateMessage } = useChatStore.getState()

  if (event.type === 'message') {
    addMessage(event.chatId, event.message, event.chatTitle)
  } else {
    updateMessage(event.chatId, event.messageId, { status: event.status })
  }
}

export const useIncomingMessages = () => {
  const client = useGreenApiClient()
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    const poller = new NotificationPoller(client, {
      receiveTimeoutSeconds: RECEIVE_NOTIFICATION_TIMEOUT_SECONDS,
      onNotification: applyNotification,
      onConnectionChange: setIsOnline,
    })

    poller.start()

    return () => poller.stop()
  }, [client])

  return { isOnline }
}
