import type { GreenApiClient, WebhookBody } from '@/shared/api'
import { delay } from '@/shared/lib/async'

type NotificationSource = Pick<GreenApiClient, 'receiveNotification' | 'deleteNotification'>

export interface NotificationPollerOptions {
  onNotification: (body: WebhookBody) => void
  onConnectionChange?: (isOnline: boolean) => void
  receiveTimeoutSeconds: number
  retryDelayMs?: number
}

export class NotificationPoller {
  private readonly source: NotificationSource
  private readonly options: NotificationPollerOptions
  private controller: AbortController | null = null

  constructor(source: NotificationSource, options: NotificationPollerOptions) {
    this.source = source
    this.options = options
  }

  start(): void {
    if (this.controller) {
      return
    }

    this.controller = new AbortController()
    void this.poll(this.controller.signal)
  }

  stop(): void {
    this.controller?.abort()
    this.controller = null
  }

  private async poll(signal: AbortSignal): Promise<void> {
    const { onConnectionChange, retryDelayMs = 3000 } = this.options

    while (!signal.aborted) {
      try {
        await this.processNext(signal)
        onConnectionChange?.(true)
      } catch (error) {
        if (signal.aborted) {
          return
        }

        console.error('Failed to receive notification', error)
        onConnectionChange?.(false)
        await delay(retryDelayMs, signal)
      }
    }
  }

  private async processNext(signal: AbortSignal): Promise<void> {
    const notification = await this.source.receiveNotification(
      this.options.receiveTimeoutSeconds,
      signal,
    )

    if (!notification) {
      return
    }

    // A malformed payload must not block the queue, so it is logged and still deleted.
    try {
      this.options.onNotification(notification.body)
    } catch (error) {
      console.error('Failed to handle notification', error)
    }

    await this.source.deleteNotification(notification.receiptId)
  }
}
