import { afterEach, describe, expect, it, vi } from 'vitest'
import type { GreenApiClient, Notification, WebhookBody } from '@/shared/api'
import { NotificationPoller } from './NotificationPoller'

const notification = (receiptId: number): Notification => ({
  receiptId,
  body: { typeWebhook: 'incomingMessageReceived' },
})

type NotificationSource = Pick<GreenApiClient, 'receiveNotification' | 'deleteNotification'>

const waitForAbort = (signal?: AbortSignal) =>
  new Promise<null>((resolve) => signal?.addEventListener('abort', () => resolve(null)))

const createSource = (queue: Array<Notification | Error>) => {
  const receiveNotification = vi.fn<NotificationSource['receiveNotification']>(
    async (_timeout, signal) => {
      const next = queue.shift()

      if (next instanceof Error) {
        throw next
      }

      return next ?? waitForAbort(signal)
    },
  )
  const deleteNotification = vi.fn<NotificationSource['deleteNotification']>(async () => ({
    result: true,
  }))

  return { receiveNotification, deleteNotification }
}

describe('NotificationPoller', () => {
  let poller: NotificationPoller | undefined

  afterEach(() => {
    poller?.stop()
    vi.restoreAllMocks()
  })

  it('handles and deletes every received notification', async () => {
    const source = createSource([notification(1), notification(2)])
    const handled: WebhookBody[] = []
    poller = new NotificationPoller(source, {
      receiveTimeoutSeconds: 5,
      onNotification: (body) => handled.push(body),
    })

    poller.start()

    await vi.waitFor(() => expect(source.deleteNotification).toHaveBeenCalledTimes(2))
    expect(source.deleteNotification).toHaveBeenNthCalledWith(1, 1)
    expect(source.deleteNotification).toHaveBeenNthCalledWith(2, 2)
    expect(handled).toHaveLength(2)
  })

  it('deletes a notification even when its handler throws', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
    const source = createSource([notification(7)])
    poller = new NotificationPoller(source, {
      receiveTimeoutSeconds: 5,
      retryDelayMs: 0,
      onNotification: () => {
        throw new Error('Broken payload')
      },
    })

    poller.start()

    await vi.waitFor(() => expect(source.deleteNotification).toHaveBeenCalledWith(7))
  })

  it('reports connection problems and recovers after them', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
    const source = createSource([new Error('Network'), notification(1)])
    const onConnectionChange = vi.fn<(isOnline: boolean) => void>()
    poller = new NotificationPoller(source, {
      receiveTimeoutSeconds: 5,
      retryDelayMs: 0,
      onNotification: () => undefined,
      onConnectionChange,
    })

    poller.start()

    await vi.waitFor(() => expect(source.deleteNotification).toHaveBeenCalledWith(1))
    expect(onConnectionChange).toHaveBeenNthCalledWith(1, false)
    expect(onConnectionChange).toHaveBeenCalledWith(true)
  })

  it('stops polling after stop()', async () => {
    const source = createSource([])
    poller = new NotificationPoller(source, {
      receiveTimeoutSeconds: 5,
      onNotification: () => undefined,
    })

    poller.start()
    poller.stop()
    const callsAfterStop = source.receiveNotification.mock.calls.length
    await new Promise((resolve) => setTimeout(resolve, 20))

    expect(source.receiveNotification).toHaveBeenCalledTimes(callsAfterStop)
  })
})
