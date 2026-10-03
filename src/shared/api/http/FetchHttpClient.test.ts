import { afterEach, describe, expect, it, vi } from 'vitest'
import { FetchHttpClient } from './FetchHttpClient'
import { HttpError, NetworkError } from './HttpError'

const stubFetch = (implementation: () => Promise<Response>) => {
  const fetchMock = vi.fn<typeof fetch>(implementation)
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

describe('FetchHttpClient', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('serializes the body and parses a JSON response', async () => {
    const fetchMock = stubFetch(async () => new Response('{"ok":true}', { status: 200 }))

    const result = await new FetchHttpClient().request('/url', { method: 'POST', body: { a: 1 } })

    expect(result).toEqual({ ok: true })
    expect(fetchMock).toHaveBeenCalledWith(
      '/url',
      expect.objectContaining({ method: 'POST', body: '{"a":1}' }),
    )
  })

  it('resolves with null when the API has nothing to return', async () => {
    stubFetch(async () => new Response('null', { status: 200 }))

    await expect(new FetchHttpClient().request('/url')).resolves.toBeNull()
  })

  it('throws HttpError with the response status', async () => {
    stubFetch(async () => new Response('{"message":"Unauthorized"}', { status: 401 }))

    await expect(new FetchHttpClient().request('/url')).rejects.toEqual(
      new HttpError(401, 'Unauthorized'),
    )
  })

  it('wraps transport failures into NetworkError', async () => {
    stubFetch(() => Promise.reject(new TypeError('Failed to fetch')))

    await expect(new FetchHttpClient().request('/url')).rejects.toBeInstanceOf(NetworkError)
  })
})
