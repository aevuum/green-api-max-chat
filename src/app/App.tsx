import { selectIsAuthorized, useSessionStore } from '@/entities/session'
import { LoginPage } from '@/pages/login'
import { MessengerPage } from '@/pages/messenger'

export const App = () => {
  const isAuthorized = useSessionStore(selectIsAuthorized)

  return isAuthorized ? <MessengerPage /> : <LoginPage />
}
