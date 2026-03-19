import React, { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Task } from '../../types'
import { useAuthStore } from '../../store/authStore'
import { useTaskStore } from '../../store/taskStore'
import { FeedbackThread } from '../feedback/FeedbackThread'

interface TaskCardProps {
  task: Task
  onEdit?: (task: Task) => void
}

const priorityColors = {
  low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit }) => {
  const { user } = useAuthStore()
  const { deleteTask } = useTaskStore()
  const [showFeedback, setShowFeedback] = useState(false)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={`group rounded-lg border bg-white p-3 shadow-sm dark:bg-gray-800 dark:border-gray-700 ${
          isDragging ? 'shadow-xl ring-2 ring-blue-500' : 'border-gray-200'
        }`}
      >
        <div className="flex items-start justify-between gap-2">
          <div
            {...attributes}
            {...listeners}
            className="mt-0.5 cursor-grab text-gray-400 active:cursor-grabbing"
            aria-label="Drag task"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white leading-tight">
              {task.title}
            </p>
            {task.description && (
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                {task.description}
              </p>
            )}
          </div>
          <div className="flex shrink-0 gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onEdit && (
              <button
                onClick={() => onEdit(task)}
                className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-blue-600 dark:hover:bg-gray-700"
                aria-label="Edit task"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}
            {(user?.role === 'mentor' || user?.id === task.creatorId) && (
              <button
                onClick={() => deleteTask(task.id)}
                className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-red-600 dark:hover:bg-gray-700"
                aria-label="Delete task"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2 flex-wrap">
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${priorityColors[task.priority]}`}>
            {task.priority}
          </span>
          {task.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-400">
              {tag}
            </span>
          ))}
          {task.dueDate && (
            <span className="ml-auto text-xs text-gray-400">
              📅 {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>
        <button
          onClick={() => setShowFeedback(!showFeedback)}
          className="mt-2 flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          💬 {showFeedback ? 'Hide' : 'Show'} feedback
        </button>
      </div>
      {showFeedback && <FeedbackThread taskId={task.id} />}
    </>
  )
}