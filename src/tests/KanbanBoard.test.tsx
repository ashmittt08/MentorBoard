import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { KanbanBoard } from '../features/tasks/KanbanBoard'

vi.mock('../store/taskStore', () => ({
  useTaskStore: () => ({
    tasks: [
      {
        id: '1',
        title: 'Test Task',
        description: 'A test task',
        status: 'todo',
        priority: 'medium',
        tags: [],
        assigneeId: 'intern1',
        creatorId: 'mentor1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    moveTask: vi.fn(),
    deleteTask: vi.fn(),
  }),
}))

vi.mock('../store/authStore', () => ({
  useAuthStore: () => ({
    user: { id: 'intern1', name: 'Alex', role: 'intern', email: 'intern@test.com' },
  }),
}))

describe('KanbanBoard', () => {
  it('renders all four columns', () => {
    render(
      <MemoryRouter>
        <KanbanBoard />
      </MemoryRouter>
    )
    expect(screen.getByText('To Do')).toBeInTheDocument()
    expect(screen.getByText('In Progress')).toBeInTheDocument()
    expect(screen.getByText('Blocked')).toBeInTheDocument()
    expect(screen.getByText('Done')).toBeInTheDocument()
  })

  it('renders task title', () => {
    render(
      <MemoryRouter>
        <KanbanBoard />
      </MemoryRouter>
    )
    expect(screen.getByText('Test Task')).toBeInTheDocument()
  })
})