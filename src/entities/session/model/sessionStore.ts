import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { GreenApiCredentials } from '@/shared/api'

interface SessionState {
  credentials: GreenApiCredentials | null
  signIn: (credentials: GreenApiCredentials) => void
  signOut: () => void
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      credentials: null,
      signIn: (credentials) => set({ credentials }),
      signOut: () => set({ credentials: null }),
    }),
    {
      name: 'max-chat:session',
      partialize: ({ credentials }) => ({ credentials }),
    },
  ),
)

export const selectIsAuthorized = (state: SessionState) => state.credentials !== null

export const selectIdInstance = (state: SessionState) => state.credentials?.idInstance ?? null
