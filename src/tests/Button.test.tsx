import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Button } from '../components/Button'

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Click me</Button>)
    fireEvent.click(screen.getByText('Click me'))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('is disabled when loading', () => {
    render(<Button loading>Loading</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('applies variant classes', () => {
    render(<Button variant="danger">Delete</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-red-600')
  })
})