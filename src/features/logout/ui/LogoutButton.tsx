import { useSessionStore } from '@/entities/session'
import { Button } from '@/shared/ui'
import { LogoutIcon } from '@/shared/ui/icons'

export const LogoutButton = () => {
  const signOut = useSessionStore((state) => state.signOut)

  return (
    <Button variant="ghost" isIcon onClick={signOut} title="Выйти" aria-label="Выйти">
      <LogoutIcon />
    </Button>
  )
}
