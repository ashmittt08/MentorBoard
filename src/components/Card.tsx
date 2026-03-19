import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800 ${className}`}>
    {children}
  </div>
)