import type { HttpClient, HttpRequestOptions } from './HttpClient'
import { HttpError, NetworkError } from './HttpError'

const parseBody = async (response: Response): Promise<unknown> => {
  const text = await response.text()

  if (!text) {
    return null
  }

  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

const extractErrorMessage = (body: unknown, fallback: string): string => {
  if (typeof body === 'string' && body.trim()) {
    return body
  }

  if (body && typeof body === 'object' && 'message' in body && typeof body.message === 'string') {
    return body.message
  }

  return fallback
}

const isAbortError = (error: unknown): boolean =>
  error instanceof DOMException && error.name === 'AbortError'

export class FetchHttpClient implements HttpClient {
  async request<TResponse>(
    url: string,
    { method = 'GET', body, signal }: HttpRequestOptions = {},
  ): Promise<TResponse> {
    const hasBody = body !== undefined
    let response: Response

    try {
      response = await fetch(url, {
        method,
        signal,
        headers: hasBody ? { 'Content-Type': 'application/json' } : undefined,
        body: hasBody ? JSON.stringify(body) : undefined,
      })
    } catch (error) {
      if (isAbortError(error)) {
        throw error
      }
      throw new NetworkError()
    }

    const payload = await parseBody(response)

    if (!response.ok) {
      throw new HttpError(response.status, extractErrorMessage(payload, response.statusText))
    }

    return payload as TResponse
  }
}
