import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { LoginPage } from '../features/auth/LoginPage'
import { KanbanBoard } from '../features/tasks/KanbanBoard'
import { StandupPage } from '../features/standups/StandupPage'
import { AnalyticsPage } from '../features/analytics/AnalyticsPage'
import { Navbar } from '../components/Navbar'

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuthStore()
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

export const AppRouter: React.FC = () => {
  const { user } = useAuthStore()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {user && <Navbar />}
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/board" replace /> : <LoginPage />} />
        <Route path="/board" element={<ProtectedRoute><KanbanBoard /></ProtectedRoute>} />
        <Route path="/standups" element={<ProtectedRoute><StandupPage /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to={user ? '/board' : '/login'} replace />} />
      </Routes>
    </div>
  )
}