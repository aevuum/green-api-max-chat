import type { Message, MessageStatus } from '@/entities/chat'
import type {
  MessageData,
  MessageWebhook,
  OutgoingMessageStatus,
  OutgoingMessageStatusWebhook,
  WebhookBody,
} from '@/shared/api'

export type ChatEvent =
  | { type: 'message'; chatId: string; message: Message; chatTitle?: string }
  | { type: 'status'; chatId: string; messageId: string; status: MessageStatus }

type WebhookParser = (body: WebhookBody) => ChatEvent | null

const STATUS_MAP: Record<OutgoingMessageStatus, MessageStatus> = {
  pending: 'pending',
  sent: 'sent',
  delivered: 'delivered',
  read: 'read',
  failed: 'failed',
  noAccount: 'failed',
  notInGroup: 'failed',
}

const toMilliseconds = (seconds: number) => seconds * 1000

const extractText = (messageData: MessageData): string | null => {
  if ('textMessageData' in messageData) {
    return messageData.textMessageData.textMessage
  }

  if ('extendedTextMessageData' in messageData) {
    return messageData.extendedTextMessageData.text
  }

  return null
}

const createMessageParser =
  (direction: Message['direction']): WebhookParser =>
  (body) => {
    const { idMessage, timestamp, senderData, messageData } = body as MessageWebhook
    const text = extractText(messageData)

    if (text === null) {
      return null
    }

    return {
      type: 'message',
      chatId: senderData.chatId,
      chatTitle: senderData.chatName || senderData.senderName || undefined,
      message: {
        id: idMessage,
        text,
        direction,
        timestamp: toMilliseconds(timestamp),
        status: direction === 'outgoing' ? 'sent' : undefined,
      },
    }
  }

const parseOutgoingStatus: WebhookParser = (body) => {
  const { chatId, idMessage, status } = body as OutgoingMessageStatusWebhook
  const mappedStatus = STATUS_MAP[status]

  return mappedStatus
    ? { type: 'status', chatId, messageId: idMessage, status: mappedStatus }
    : null
}

const WEBHOOK_PARSERS: Partial<Record<string, WebhookParser>> = {
  incomingMessageReceived: createMessageParser('incoming'),
  outgoingMessageReceived: createMessageParser('outgoing'),
  outgoingMessageStatus: parseOutgoingStatus,
}

export const parseNotification = (body: WebhookBody): ChatEvent | null =>
  WEBHOOK_PARSERS[body.typeWebhook]?.(body) ?? null
