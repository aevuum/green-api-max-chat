import clsx from 'clsx'
import { useChatStore } from '@/entities/chat'
import { ChatWindow } from '@/widgets/chat-window'
import { Sidebar } from '@/widgets/sidebar'
import styles from './MessengerPage.module.css'

export const MessengerPage = () => {
  const hasActiveChat = useChatStore((state) => state.activeChatId !== null)

  return (
    <main className={clsx(styles.layout, hasActiveChat && styles.chatOpened)}>
      <Sidebar />
      <ChatWindow />
    </main>
  )
}
