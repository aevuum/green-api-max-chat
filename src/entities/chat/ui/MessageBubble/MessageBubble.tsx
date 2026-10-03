import clsx from 'clsx'
import { formatTime } from '@/shared/lib/date'
import type { Message } from '../../model/types'
import styles from './MessageBubble.module.css'
import { MessageStatusIcon } from './MessageStatusIcon'

interface MessageBubbleProps {
  message: Message
}

export const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isOutgoing = message.direction === 'outgoing'

  return (
    <div className={clsx(styles.row, isOutgoing && styles.rowOutgoing)}>
      <div className={clsx(styles.bubble, isOutgoing ? styles.outgoing : styles.incoming)}>
        <p className={styles.text}>{message.text}</p>
        <span className={styles.meta}>
          <time dateTime={new Date(message.timestamp).toISOString()}>
            {formatTime(message.timestamp)}
          </time>
          {isOutgoing && message.status && <MessageStatusIcon status={message.status} />}
        </span>
      </div>
    </div>
  )
}
