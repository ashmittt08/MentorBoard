import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { LoginPage } from '../features/auth/LoginPage'

// Mock zustand store
vi.mock('../store/authStore', () => ({
  useAuthStore: () => ({
    user: null,
    login: vi.fn(),
  }),
}))

describe('LoginPage', () => {
  it('renders login form', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    )
    expect(screen.getByText('MentorBoard')).toBeInTheDocument()
    expect(screen.getByText('Sign In')).toBeInTheDocument()
  })

  it('shows quick login demo accounts', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    )
    expect(screen.getByText('Alex Chen')).toBeInTheDocument()
    expect(screen.getByText('Sam Rivera')).toBeInTheDocument()
  })
})