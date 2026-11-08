import { create } from 'zustand'

interface AuthStore {
  isLoading: boolean
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  isLoading: false,
  setLoading: (isLoading) => set({ isLoading }),
}))
