import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useChatStore } from '@/entities/chat'
import { useSessionStore } from '@/entities/session'
import { GreenApiClient } from '@/shared/api'
import { MessageComposer } from './MessageComposer'

const CHAT_ID = '10000000'

const getMessages = () => useChatStore.getState().chats[CHAT_ID]?.messages ?? []

describe('MessageComposer', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    useChatStore.getState().reset()
    useChatStore.getState().openChat({ id: CHAT_ID, title: 'Alice' })
    useSessionStore.getState().signIn({
      apiUrl: 'https://api.green-api.com/v3',
      idInstance: '3100000001',
      apiTokenInstance: 'token',
    })
  })

  it('sends a trimmed message on Enter and marks it as sent', async () => {
    const sendMessage = vi
      .spyOn(GreenApiClient.prototype, 'sendMessage')
      .mockResolvedValue({ idMessage: 'server-id' })
    render(<MessageComposer chatId={CHAT_ID} />)

    await userEvent.type(screen.getByLabelText('Текст сообщения'), '  Привет  {Enter}')

    expect(sendMessage).toHaveBeenCalledWith({ chatId: CHAT_ID, message: 'Привет' })
    expect(getMessages()).toEqual([
      expect.objectContaining({ id: 'server-id', text: 'Привет', status: 'sent' }),
    ])
    expect(screen.getByLabelText('Текст сообщения')).toHaveValue('')
  })

  it('keeps the message with a failed status when the request fails', async () => {
    vi.spyOn(GreenApiClient.prototype, 'sendMessage').mockRejectedValue(new Error('Network'))
    render(<MessageComposer chatId={CHAT_ID} />)

    await userEvent.type(screen.getByLabelText('Текст сообщения'), 'Привет{Enter}')

    expect(getMessages()).toEqual([expect.objectContaining({ status: 'failed' })])
  })

  it('inserts a new line on Shift+Enter instead of sending', async () => {
    const sendMessage = vi.spyOn(GreenApiClient.prototype, 'sendMessage')
    render(<MessageComposer chatId={CHAT_ID} />)

    await userEvent.type(screen.getByLabelText('Текст сообщения'), 'a{Shift>}{Enter}{/Shift}b')

    expect(sendMessage).not.toHaveBeenCalled()
    expect(screen.getByLabelText('Текст сообщения')).toHaveValue('a\nb')
  })
})
