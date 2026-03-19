import React from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import type { Task, TaskStatus } from '../../types'
import { TaskCard } from './TaskCard'

interface KanbanColumnProps {
  id: TaskStatus
  title: string
  tasks: Task[]
  color: string
  onEdit?: (task: Task) => void
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({ id, title, tasks, color, onEdit }) => {
  const { setNodeRef, isOver } = useDroppable({ id })

  return (
    <div
      ref={setNodeRef}
      className={`flex min-h-[400px] flex-col rounded-xl p-3 transition-colors ${
        isOver ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-gray-50 dark:bg-gray-900/50'
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`h-2.5 w-2.5 rounded-full ${color}`} />
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{title}</h3>
        </div>
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-400">
          {tasks.length}
        </span>
      </div>
      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-2">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onEdit={onEdit} />
          ))}
        </div>
      </SortableContext>
      {tasks.length === 0 && (
        <div className="flex flex-1 items-center justify-center text-xs text-gray-400 dark:text-gray-600">
          Drop tasks here
        </div>
      )}
    </div>
  )
}