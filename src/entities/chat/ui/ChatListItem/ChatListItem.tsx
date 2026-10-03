import clsx from 'clsx'
import { formatShortDate } from '@/shared/lib/date'
import { Avatar } from '@/shared/ui'
import type { Chat } from '../../model/types'
import styles from './ChatListItem.module.css'

interface ChatListItemProps {
  chat: Chat
  isActive: boolean
  onSelect: (chatId: string) => void
}

export const ChatListItem = ({ chat, isActive, onSelect }: ChatListItemProps) => {
  const lastMessage = chat.messages.at(-1)
  const preview = lastMessage
    ? `${lastMessage.direction === 'outgoing' ? 'Вы: ' : ''}${lastMessage.text}`
    : 'Нет сообщений'

  return (
    <button
      type="button"
      className={clsx(styles.item, isActive && styles.active)}
      onClick={() => onSelect(chat.id)}
      aria-current={isActive || undefined}
    >
      <Avatar name={chat.title} seed={chat.id} />
      <span className={styles.content}>
        <span className={styles.row}>
          <span className={styles.title}>{chat.title}</span>
          {lastMessage && (
            <time className={styles.time}>{formatShortDate(lastMessage.timestamp)}</time>
          )}
        </span>
        <span className={styles.row}>
          <span className={styles.preview}>{preview}</span>
          {chat.unreadCount > 0 && (
            <span className={styles.badge} aria-label={`Непрочитанных: ${chat.unreadCount}`}>
              {chat.unreadCount}
            </span>
          )}
        </span>
      </span>
    </button>
  )
}
