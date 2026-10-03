import { FetchHttpClient, type HttpClient } from '../http'
import type {
  CheckAccountResponse,
  DeleteNotificationResponse,
  GetStateInstanceResponse,
  GreenApiCredentials,
  Notification,
  SendMessageRequest,
  SendMessageResponse,
} from './types'

export class GreenApiClient {
  private readonly credentials: GreenApiCredentials
  private readonly http: HttpClient

  constructor(credentials: GreenApiCredentials, http: HttpClient = new FetchHttpClient()) {
    this.credentials = credentials
    this.http = http
  }

  getStateInstance(signal?: AbortSignal): Promise<GetStateInstanceResponse> {
    return this.http.request(this.buildUrl('getStateInstance'), { signal })
  }

  checkAccount(phoneNumber: number): Promise<CheckAccountResponse> {
    return this.http.request(this.buildUrl('checkAccount'), {
      method: 'POST',
      body: { phoneNumber },
    })
  }

  sendMessage(payload: SendMessageRequest): Promise<SendMessageResponse> {
    return this.http.request(this.buildUrl('sendMessage'), { method: 'POST', body: payload })
  }

  receiveNotification(receiveTimeout: number, signal?: AbortSignal): Promise<Notification | null> {
    const url = `${this.buildUrl('receiveNotification')}?receiveTimeout=${receiveTimeout}`
    return this.http.request(url, { signal })
  }

  deleteNotification(receiptId: number): Promise<DeleteNotificationResponse> {
    return this.http.request(`${this.buildUrl('deleteNotification')}/${receiptId}`, {
      method: 'DELETE',
    })
  }

  private buildUrl(method: string): string {
    const { apiUrl, idInstance, apiTokenInstance } = this.credentials
    const baseUrl = apiUrl.trim().replace(/\/+$/, '')

    return `${baseUrl}/waInstance${idInstance}/${method}/${apiTokenInstance}`
  }
}
