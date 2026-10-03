import { useChatStore } from '@/entities/chat'
import { useSessionStore } from '@/entities/session'
import { Button } from '@/shared/ui'
import { LogoutIcon } from '@/shared/ui/icons'

export const LogoutButton = () => {
  const signOut = useSessionStore((state) => state.signOut)
  const resetChats = useChatStore((state) => state.reset)

  const handleLogout = () => {
    resetChats()
    signOut()
  }

  return (
    <Button variant="ghost" isIcon onClick={handleLogout} title="Выйти" aria-label="Выйти">
      <LogoutIcon />
    </Button>
  )
}
