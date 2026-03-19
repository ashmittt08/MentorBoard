export type UserRole = 'intern' | 'mentor'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
}

export type TaskStatus = 'todo' | 'inprogress' | 'blocked' | 'done'

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  assigneeId: string
  creatorId: string
  createdAt: string
  updatedAt: string
  dueDate?: string
  priority: 'low' | 'medium' | 'high'
  tags: string[]
}

export interface Comment {
  id: string
  taskId: string
  authorId: string
  content: string
  createdAt: string
  parentId?: string
}

export interface Standup {
  id: string
  userId: string
  date: string
  yesterday: string
  today: string
  blockers: string
  mood: 'great' | 'good' | 'okay' | 'struggling'
  createdAt: string
}