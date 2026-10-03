import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { addMessage, markChatAsRead, updateMessage, upsertChat } from './chatsModel'
import type { ChatDraft, ChatsMap, Message } from './types'

interface ChatState {
  chats: ChatsMap
  activeChatId: string | null
  openChat: (draft: ChatDraft) => void
  selectChat: (chatId: string | null) => void
  addMessage: (chatId: string, message: Message, fallbackTitle?: string) => void
  updateMessage: (chatId: string, messageId: string, patch: Partial<Message>) => void
  reset: () => void
}

const INITIAL_STATE = {
  chats: {},
  activeChatId: null,
} satisfies Pick<ChatState, 'chats' | 'activeChatId'>

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,

      openChat: (draft) =>
        set(({ chats }) => ({
          chats: markChatAsRead(upsertChat(chats, draft), draft.id),
          activeChatId: draft.id,
        })),

      selectChat: (chatId) =>
        set(({ chats }) => ({
          chats: chatId ? markChatAsRead(chats, chatId) : chats,
          activeChatId: chatId,
        })),

      addMessage: (chatId, message, fallbackTitle) =>
        set(({ chats, activeChatId }) => ({
          chats: addMessage(chats, chatId, message, {
            isChatActive: chatId === activeChatId,
            fallbackTitle,
          }),
        })),

      updateMessage: (chatId, messageId, patch) =>
        set(({ chats }) => ({ chats: updateMessage(chats, chatId, messageId, patch) })),

      reset: () => set(INITIAL_STATE),
    }),
    {
      name: 'max-chat:chats',
      partialize: ({ chats }) => ({ chats }),
    },
  ),
)

export const selectActiveChat = (state: ChatState) =>
  state.activeChatId ? (state.chats[state.activeChatId] ?? null) : null
