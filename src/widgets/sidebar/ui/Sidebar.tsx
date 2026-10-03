import { useMemo } from 'react'
import { ChatListItem, sortChatsByActivity, useChatStore } from '@/entities/chat'
import { selectIdInstance, useSessionStore } from '@/entities/session'
import { CreateChatForm } from '@/features/create-chat'
import { LogoutButton } from '@/features/logout'
import { Logo } from '@/shared/ui'
import styles from './Sidebar.module.css'

export const Sidebar = () => {
  const idInstance = useSessionStore(selectIdInstance)
  const chats = useChatStore((state) => state.chats)
  const activeChatId = useChatStore((state) => state.activeChatId)
  const selectChat = useChatStore((state) => state.selectChat)

  const sortedChats = useMemo(() => sortChatsByActivity(chats), [chats])

  return (
    <aside className={styles.sidebar}>
      <header className={styles.header}>
        <Logo size={36} />
        <div className={styles.heading}>
          <h1 className={styles.title}>Чаты</h1>
          <span className={styles.instance}>Инстанс {idInstance}</span>
        </div>
        <LogoutButton />
      </header>

      <CreateChatForm />

      {sortedChats.length > 0 ? (
        <nav className={styles.list} aria-label="Список чатов">
          {sortedChats.map((chat) => (
            <ChatListItem
              key={chat.id}
              chat={chat}
              isActive={chat.id === activeChatId}
              onSelect={selectChat}
            />
          ))}
        </nav>
      ) : (
        <p className={styles.empty}>Введите номер телефона получателя, чтобы начать новый чат</p>
      )}
    </aside>
  )
}
