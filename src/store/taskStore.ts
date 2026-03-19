import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Task, TaskStatus } from '../types'

const SAMPLE_TASKS: Task[] = [
  {
    id: '1',
    title: 'Set up React project',
    description: 'Initialize the Vite + React + TypeScript project',
    status: 'done',
    assigneeId: 'intern1',
    creatorId: 'mentor1',
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    priority: 'high',
    tags: ['setup'],
  },
  {
    id: '2',
    title: 'Build Kanban Board',
    description: 'Implement drag-and-drop Kanban with DnD kit',
    status: 'inprogress',
    assigneeId: 'intern1',
    creatorId: 'mentor1',
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    priority: 'high',
    tags: ['feature'],
  },
  {
    id: '3',
    title: 'Add dark mode',
    description: 'Implement dark mode toggle with localStorage persistence',
    status: 'todo',
    assigneeId: 'intern1',
    creatorId: 'mentor1',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    priority: 'medium',
    tags: ['ui'],
  },
  {
    id: '4',
    title: 'Write unit tests',
    description: 'Add Vitest + RTL tests for all components',
    status: 'blocked',
    assigneeId: 'intern1',
    creatorId: 'mentor1',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    priority: 'medium',
    tags: ['testing'],
  },
]

interface TaskState {
  tasks: Task[]
  addTask: (task: Task) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  moveTask: (id: string, newStatus: TaskStatus) => void
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      tasks: SAMPLE_TASKS,
      addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
          ),
        })),
      deleteTask: (id) =>
        set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),
      moveTask: (id, newStatus) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id
              ? { ...t, status: newStatus, updatedAt: new Date().toISOString() }
              : t
          ),
        })),
    }),
    { name: 'task-storage' }
  )
)