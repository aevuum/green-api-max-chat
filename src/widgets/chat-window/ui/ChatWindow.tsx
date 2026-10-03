import { selectActiveChat, useChatStore } from '@/entities/chat'
import { ChatBubbleIcon } from '@/shared/ui/icons'
import { ChatHeader } from './ChatHeader'
import styles from './ChatWindow.module.css'

export const ChatWindow = () => {
  const chat = useChatStore(selectActiveChat)
  const selectChat = useChatStore((state) => state.selectChat)

  if (!chat) {
    return (
      <section className={styles.placeholder}>
        <span className={styles.placeholderIcon}>
          <ChatBubbleIcon width={32} height={32} />
        </span>
        <p>Выберите чат или создайте новый</p>
      </section>
    )
  }

  return (
    <section className={styles.window} aria-label={`Чат с ${chat.title}`}>
      <ChatHeader chat={chat} onBack={() => selectChat(null)} />
      <div className={styles.messages} />
    </section>
  )
}
