import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useDarkMode } from '../hooks/useDarkMode'
import { Button } from './Button'

export const Navbar: React.FC = () => {
  const { user, logout } = useAuthStore()
  const { isDark, toggleDarkMode } = useDarkMode()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900/95">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-blue-600 dark:text-blue-400">
          <span className="text-2xl">🎯</span>
          MentorBoard
        </Link>
        {user && (
          <div className="hidden items-center gap-1 md:flex">
            <Link to="/board" className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
              Board
            </Link>
            <Link to="/standups" className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
              Standups
            </Link>
            <Link to="/analytics" className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
              Analytics
            </Link>
          </div>
        )}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleDarkMode}
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? '☀️' : '🌙'}
          </button>
          {user && (
            <>
              <span className="hidden text-sm text-gray-600 dark:text-gray-400 md:inline">
                {user.name} ({user.role})
              </span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}