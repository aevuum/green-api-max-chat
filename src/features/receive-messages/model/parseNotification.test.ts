import { describe, expect, it } from 'vitest'
import type { WebhookBody } from '@/shared/api'
import { parseNotification } from './parseNotification'

const senderData = { chatId: '100000123', sender: '100000123', senderName: 'Green API' }

describe('parseNotification', () => {
  it('parses an incoming text message', () => {
    const body: WebhookBody = {
      typeWebhook: 'incomingMessageReceived',
      idMessage: 'abc',
      timestamp: 1588091580,
      senderData,
      messageData: { typeMessage: 'textMessage', textMessageData: { textMessage: 'Hi!' } },
    }

    expect(parseNotification(body)).toEqual({
      type: 'message',
      chatId: '100000123',
      chatTitle: 'Green API',
      message: {
        id: 'abc',
        text: 'Hi!',
        direction: 'incoming',
        timestamp: 1588091580000,
        status: undefined,
      },
    })
  })

  it('parses an extended text message sent from the phone as outgoing', () => {
    const body: WebhookBody = {
      typeWebhook: 'outgoingMessageReceived',
      idMessage: 'def',
      timestamp: 1,
      senderData,
      messageData: {
        typeMessage: 'extendedTextMessage',
        extendedTextMessageData: { text: 'https://green-api.com' },
      },
    }

    expect(parseNotification(body)).toMatchObject({
      type: 'message',
      message: { text: 'https://green-api.com', direction: 'outgoing', status: 'sent' },
    })
  })

  it('maps delivery statuses', () => {
    const body: WebhookBody = {
      typeWebhook: 'outgoingMessageStatus',
      idMessage: 'abc',
      chatId: '100000123',
      status: 'noAccount',
      timestamp: 1,
    }

    expect(parseNotification(body)).toEqual({
      type: 'status',
      chatId: '100000123',
      messageId: 'abc',
      status: 'failed',
    })
  })

  it('skips non-text messages', () => {
    const body: WebhookBody = {
      typeWebhook: 'incomingMessageReceived',
      idMessage: 'img',
      timestamp: 1,
      senderData,
      messageData: { typeMessage: 'imageMessage' },
    }

    expect(parseNotification(body)).toBeNull()
  })

  it('skips messages already tracked by the app and unrelated webhooks', () => {
    expect(parseNotification({ typeWebhook: 'outgoingAPIMessageReceived' })).toBeNull()
    expect(parseNotification({ typeWebhook: 'stateInstanceChanged' })).toBeNull()
  })
})
