export type MessageDirection = 'incoming' | 'outgoing'

export type MessageStatus = 'pending' | 'sent' | 'delivered' | 'read' | 'failed'

export interface Message {
  id: string
  text: string
  direction: MessageDirection
  timestamp: number
  status?: MessageStatus
}

export interface Chat {
  id: string
  title: string
  phone?: string
  messages: Message[]
  unreadCount: number
  updatedAt: number
}

export interface ChatDraft {
  id: string
  title: string
  phone?: string
}

export type ChatsMap = Record<string, Chat>
