import { describe, expect, it } from 'vitest'
import {
  addMessage,
  markChatAsRead,
  sortChatsByActivity,
  updateMessage,
  upsertChat,
} from './chatsModel'
import type { ChatsMap, Message } from './types'

const incoming = (id: string, timestamp: number): Message => ({
  id,
  text: `message ${id}`,
  direction: 'incoming',
  timestamp,
})

describe('chatsModel', () => {
  it('creates a chat once and keeps it on repeated upsert', () => {
    const chats = upsertChat({}, { id: '1', title: 'Alice' }, 100)
    const sameChats = upsertChat(chats, { id: '1', title: 'Alice' }, 200)

    expect(sameChats).toBe(chats)
    expect(chats['1']).toMatchObject({ title: 'Alice', updatedAt: 100, messages: [] })
  })

  it('fills in the phone for a chat created from an incoming message', () => {
    const chats = upsertChat({}, { id: '1', title: 'Alice' })
    const updated = upsertChat(chats, { id: '1', title: '+7 999', phone: '7999' })

    expect(updated['1']).toMatchObject({ title: '+7 999', phone: '7999' })
  })

  it('creates a chat for messages from unknown senders', () => {
    const chats = addMessage({}, '1', incoming('a', 10), {
      isChatActive: false,
      fallbackTitle: 'Bob',
    })

    expect(chats['1']).toMatchObject({ title: 'Bob', unreadCount: 1, updatedAt: 10 })
  })

  it('ignores duplicated messages', () => {
    const chats = addMessage({}, '1', incoming('a', 10), { isChatActive: true })

    expect(addMessage(chats, '1', incoming('a', 10), { isChatActive: true })).toBe(chats)
  })

  it('keeps messages ordered by timestamp', () => {
    let chats: ChatsMap = {}
    chats = addMessage(chats, '1', incoming('late', 30), { isChatActive: true })
    chats = addMessage(chats, '1', incoming('early', 10), { isChatActive: true })
    chats = addMessage(chats, '1', incoming('middle', 20), { isChatActive: true })

    expect(chats['1']?.messages.map(({ id }) => id)).toEqual(['early', 'middle', 'late'])
  })

  it('does not count messages in the active chat as unread', () => {
    const chats = addMessage({}, '1', incoming('a', 10), { isChatActive: true })

    expect(chats['1']?.unreadCount).toBe(0)
  })

  it('updates a message by id', () => {
    const chats = addMessage({}, '1', incoming('a', 10), { isChatActive: true })

    const updated = updateMessage(chats, '1', 'a', { id: 'b', status: 'sent' })

    expect(updated['1']?.messages[0]).toMatchObject({ id: 'b', status: 'sent' })
  })

  it('resets the unread counter', () => {
    const chats = addMessage({}, '1', incoming('a', 10), { isChatActive: false })

    expect(markChatAsRead(chats, '1')['1']?.unreadCount).toBe(0)
  })

  it('sorts chats by the latest activity', () => {
    const withOldChat = upsertChat({}, { id: 'old', title: 'Old' }, 1)
    const chats = upsertChat(withOldChat, { id: 'new', title: 'New' }, 2)

    expect(sortChatsByActivity(chats).map(({ id }) => id)).toEqual(['new', 'old'])
  })
})
