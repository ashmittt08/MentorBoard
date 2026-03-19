import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Comment } from '../types'

interface FeedbackState {
  comments: Comment[]
  addComment: (comment: Comment) => void
  deleteComment: (id: string) => void
}

export const useFeedbackStore = create<FeedbackState>()(
  persist(
    (set) => ({
      comments: [],
      addComment: (comment) =>
        set((state) => ({ comments: [...state.comments, comment] })),
      deleteComment: (id) =>
        set((state) => ({ comments: state.comments.filter((c) => c.id !== id) })),
    }),
    { name: 'feedback-storage' }
  )
)