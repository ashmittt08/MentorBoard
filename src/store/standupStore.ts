import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Standup } from '../types'

interface StandupState {
  standups: Standup[]
  addStandup: (standup: Standup) => void
}

export const useStandupStore = create<StandupState>()(
  persist(
    (set) => ({
      standups: [],
      addStandup: (standup) =>
        set((state) => ({ standups: [standup, ...state.standups] })),
    }),
    { name: 'standup-storage' }
  )
)