import clsx from 'clsx'
import { useChatStore } from '@/entities/chat'
import { useIncomingMessages } from '@/features/receive-messages'
import { ChatWindow } from '@/widgets/chat-window'
import { Sidebar } from '@/widgets/sidebar'
import styles from './MessengerPage.module.css'

export const MessengerPage = () => {
  const hasActiveChat = useChatStore((state) => state.activeChatId !== null)
  const { isOnline } = useIncomingMessages()

  return (
    <main className={clsx(styles.layout, hasActiveChat && styles.chatOpened)}>
      <Sidebar isOnline={isOnline} />
      <ChatWindow />
    </main>
  )
}
