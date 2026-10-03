import { describe, expect, it, vi } from 'vitest'
import type { HttpClient, HttpRequestOptions } from '../http'
import { GreenApiClient } from './GreenApiClient'

const BASE_URL = 'https://api.green-api.com/v3/waInstance3100000001'

const createClient = (response: unknown = {}) => {
  const request = vi
    .fn<(url: string, options?: HttpRequestOptions) => Promise<unknown>>()
    .mockResolvedValue(response)
  const http = { request } as HttpClient
  const client = new GreenApiClient(
    {
      apiUrl: 'https://api.green-api.com/v3/',
      idInstance: '3100000001',
      apiTokenInstance: 'token',
    },
    http,
  )

  return { client, request }
}

describe('GreenApiClient', () => {
  it('sends a text message with POST', async () => {
    const { client, request } = createClient({ idMessage: '42' })

    const response = await client.sendMessage({ chatId: '10000000', message: 'Hi' })

    expect(response).toEqual({ idMessage: '42' })
    expect(request).toHaveBeenCalledWith(`${BASE_URL}/sendMessage/token`, {
      method: 'POST',
      body: { chatId: '10000000', message: 'Hi' },
    })
  })

  it('passes receiveTimeout as a query parameter', async () => {
    const { client, request } = createClient(null)
    const controller = new AbortController()

    await client.receiveNotification(5, controller.signal)

    expect(request).toHaveBeenCalledWith(`${BASE_URL}/receiveNotification/token?receiveTimeout=5`, {
      signal: controller.signal,
    })
  })

  it('deletes a notification by receipt id', async () => {
    const { client, request } = createClient({ result: true })

    await client.deleteNotification(123)

    expect(request).toHaveBeenCalledWith(`${BASE_URL}/deleteNotification/token/123`, {
      method: 'DELETE',
    })
  })

  it('checks an account by phone number', async () => {
    const { client, request } = createClient({ exist: true, chatId: '1' })

    await client.checkAccount(79991234567)

    expect(request).toHaveBeenCalledWith(`${BASE_URL}/checkAccount/token`, {
      method: 'POST',
      body: { phoneNumber: 79991234567 },
    })
  })
})
