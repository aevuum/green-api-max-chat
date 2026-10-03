import { useMemo } from 'react'
import { GreenApiClient } from '@/shared/api'
import { useSessionStore } from '../model/sessionStore'

export const useGreenApiClient = (): GreenApiClient => {
  const credentials = useSessionStore((state) => state.credentials)
  const client = useMemo(
    () => (credentials ? new GreenApiClient(credentials) : null),
    [credentials],
  )

  if (!client) {
    throw new Error('useGreenApiClient must be used inside an authorized session')
  }

  return client
}
