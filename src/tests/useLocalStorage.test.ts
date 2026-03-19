import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { useLocalStorage } from '../hooks/useLocalStorage'

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns initial value when no stored value', () => {
    const { result } = renderHook(() => useLocalStorage('test', 'default'))
    expect(result.current[0]).toBe('default')
  })

  it('stores and retrieves a value', () => {
    const { result } = renderHook(() => useLocalStorage('test', ''))
    act(() => {
      result.current[1]('hello')
    })
    expect(result.current[0]).toBe('hello')
    expect(localStorage.getItem('test')).toBe('"hello"')
  })
})