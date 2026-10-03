import type { Chat, ChatDraft, ChatsMap, Message } from './types'

const createChat = ({ id, title, phone }: ChatDraft, createdAt: number): Chat => ({
  id,
  title,
  phone,
  messages: [],
  unreadCount: 0,
  updatedAt: createdAt,
})

const insertByTimestamp = (messages: Message[], message: Message): Message[] => {
  const index = messages.findLastIndex((current) => current.timestamp <= message.timestamp)
  return [...messages.slice(0, index + 1), message, ...messages.slice(index + 1)]
}

export const upsertChat = (chats: ChatsMap, draft: ChatDraft, now = Date.now()): ChatsMap => {
  const existing = chats[draft.id]

  if (!existing) {
    return { ...chats, [draft.id]: createChat(draft, now) }
  }

  if (existing.phone || !draft.phone) {
    return chats
  }

  return { ...chats, [draft.id]: { ...existing, title: draft.title, phone: draft.phone } }
}

interface AddMessageOptions {
  isChatActive: boolean
  fallbackTitle?: string
}

export const addMessage = (
  chats: ChatsMap,
  chatId: string,
  message: Message,
  { isChatActive, fallbackTitle }: AddMessageOptions,
): ChatsMap => {
  const chat = chats[chatId] ?? createChat({ id: chatId, title: fallbackTitle ?? chatId }, 0)

  if (chat.messages.some(({ id }) => id === message.id)) {
    return chats
  }

  const isUnread = message.direction === 'incoming' && !isChatActive

  return {
    ...chats,
    [chatId]: {
      ...chat,
      messages: insertByTimestamp(chat.messages, message),
      unreadCount: isUnread ? chat.unreadCount + 1 : chat.unreadCount,
      updatedAt: Math.max(chat.updatedAt, message.timestamp),
    },
  }
}

export const updateMessage = (
  chats: ChatsMap,
  chatId: string,
  messageId: string,
  patch: Partial<Message>,
): ChatsMap => {
  const chat = chats[chatId]

  if (!chat?.messages.some(({ id }) => id === messageId)) {
    return chats
  }

  return {
    ...chats,
    [chatId]: {
      ...chat,
      messages: chat.messages.map((message) =>
        message.id === messageId ? { ...message, ...patch } : message,
      ),
    },
  }
}

export const markChatAsRead = (chats: ChatsMap, chatId: string): ChatsMap => {
  const chat = chats[chatId]

  if (!chat || chat.unreadCount === 0) {
    return chats
  }

  return { ...chats, [chatId]: { ...chat, unreadCount: 0 } }
}

export const sortChatsByActivity = (chats: ChatsMap): Chat[] =>
  Object.values(chats).sort((left, right) => right.updatedAt - left.updatedAt)
