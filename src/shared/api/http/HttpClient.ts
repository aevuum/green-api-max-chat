export type HttpMethod = 'GET' | 'POST' | 'DELETE'

export interface HttpRequestOptions {
  method?: HttpMethod
  body?: unknown
  signal?: AbortSignal
}

export interface HttpClient {
  request<TResponse>(url: string, options?: HttpRequestOptions): Promise<TResponse>
}
