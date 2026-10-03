import { selectIdInstance, useSessionStore } from '@/entities/session'
import { LogoutButton } from '@/features/logout'
import styles from './MessengerPage.module.css'

export const MessengerPage = () => {
  const idInstance = useSessionStore(selectIdInstance)

  return (
    <main className={styles.page}>
      <span>Инстанс {idInstance}</span>
      <LogoutButton />
    </main>
  )
}
