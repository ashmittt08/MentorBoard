import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Task, TaskStatus } from '../../types'
import { useAuthStore } from '../../store/authStore'
import { useTaskStore } from '../../store/taskStore'
import { Button } from '../../components/Button'

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().max(500).optional(),
  priority: z.enum(['low', 'medium', 'high']),
  status: z.enum(['todo', 'inprogress', 'blocked', 'done']),
  dueDate: z.string().optional(),
  tags: z.string().optional(),
})

type TaskFormData = z.infer<typeof taskSchema>

interface TaskFormProps {
  task?: Task
  onClose: () => void
}

export const TaskForm: React.FC<TaskFormProps> = ({ task, onClose }) => {
  const { user } = useAuthStore()
  const { addTask, updateTask } = useTaskStore()

  const { register, handleSubmit, formState: { errors } } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: task
      ? {
          title: task.title,
          description: task.description,
          priority: task.priority,
          status: task.status,
          dueDate: task.dueDate,
          tags: task.tags.join(', '),
        }
      : { priority: 'medium', status: 'todo' },
  })

  const onSubmit = (data: TaskFormData) => {
    const tags = data.tags ? data.tags.split(',').map((t) => t.trim()).filter(Boolean) : []

    if (task) {
      updateTask(task.id, {
        title: data.title,
        description: data.description || '',
        priority: data.priority,
        status: data.status as TaskStatus,
        dueDate: data.dueDate,
        tags,
      })
    } else {
      addTask({
        id: `task-${Date.now()}`,
        title: data.title,
        description: data.description || '',
        priority: data.priority,
        status: data.status as TaskStatus,
        dueDate: data.dueDate,
        tags,
        assigneeId: user?.id || '',
        creatorId: user?.id || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    }
    onClose()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Title *
        </label>
        <input
          {...register('title')}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          placeholder="Task title..."
        />
        {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Description
        </label>
        <textarea
          {...register('description')}
          rows={3}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          placeholder="Optional description..."
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Priority
          </label>
          <select
            {...register('priority')}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Status
          </label>
          <select
            {...register('status')}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          >
            <option value="todo">To Do</option>
            <option value="inprogress">In Progress</option>
            <option value="blocked">Blocked</option>
            <option value="done">Done</option>
          </select>
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Due Date
        </label>
        <input
          {...register('dueDate')}
          type="date"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Tags (comma-separated)
        </label>
        <input
          {...register('tags')}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          placeholder="feature, bug, ui..."
        />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          {task ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  )
}