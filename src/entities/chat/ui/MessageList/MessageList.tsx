import { Fragment, useLayoutEffect, useRef } from 'react'
import { formatDayLabel, isSameDay } from '@/shared/lib/date'
import type { Message } from '../../model/types'
import { MessageBubble } from '../MessageBubble/MessageBubble'
import styles from './MessageList.module.css'

interface MessageListProps {
  messages: Message[]
  emptyText?: string
}

export const MessageList = ({ messages, emptyText = 'Сообщений пока нет' }: MessageListProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const lastMessageId = messages.at(-1)?.id

  useLayoutEffect(() => {
    const container = containerRef.current

    if (container) {
      container.scrollTop = container.scrollHeight
    }
  }, [lastMessageId])

  return (
    <div ref={containerRef} className={styles.list} role="log" aria-live="polite">
      {messages.length === 0 && <p className={styles.badge}>{emptyText}</p>}

      {messages.map((message, index) => {
        const previous = messages[index - 1]
        const startsNewDay = !previous || !isSameDay(previous.timestamp, message.timestamp)

        return (
          <Fragment key={message.id}>
            {startsNewDay && <p className={styles.badge}>{formatDayLabel(message.timestamp)}</p>}
            <MessageBubble message={message} />
          </Fragment>
        )
      })}
    </div>
  )
}
