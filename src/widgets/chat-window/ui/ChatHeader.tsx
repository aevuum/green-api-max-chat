import type { Chat } from '@/entities/chat'
import { formatPhone } from '@/shared/lib/phone'
import { Avatar, Button } from '@/shared/ui'
import { BackIcon } from '@/shared/ui/icons'
import styles from './ChatHeader.module.css'

interface ChatHeaderProps {
  chat: Chat
  onBack: () => void
}

export const ChatHeader = ({ chat, onBack }: ChatHeaderProps) => {
  const subtitle = chat.phone ? formatPhone(chat.phone) : 'MAX'
  const hasDistinctSubtitle = subtitle !== chat.title

  return (
    <header className={styles.header}>
      <Button
        variant="ghost"
        isIcon
        className={styles.back}
        onClick={onBack}
        aria-label="Назад к списку чатов"
      >
        <BackIcon />
      </Button>
      <Avatar name={chat.title} seed={chat.id} size={40} />
      <div className={styles.info}>
        <h2 className={styles.title}>{chat.title}</h2>
        {hasDistinctSubtitle && <span className={styles.subtitle}>{subtitle}</span>}
      </div>
    </header>
  )
}
