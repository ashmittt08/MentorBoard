import React, { useState, useCallback } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  closestCorners,
} from '@dnd-kit/core'
import type { Task, TaskStatus } from '../../types'
import { useTaskStore } from '../../store/taskStore'
import { KanbanColumn } from './KanbanColumn'
import { TaskCard } from './TaskCard'
import { TaskForm } from './TaskForm'
import { Modal } from '../../components/Modal'
import { Button } from '../../components/Button'

const COLUMNS: { id: TaskStatus; title: string; color: string }[] = [
  { id: 'todo', title: 'To Do', color: 'bg-gray-400' },
  { id: 'inprogress', title: 'In Progress', color: 'bg-blue-500' },
  { id: 'blocked', title: 'Blocked', color: 'bg-red-500' },
  { id: 'done', title: 'Done', color: 'bg-green-500' },
]

export const KanbanBoard: React.FC = () => {
  const { tasks, moveTask } = useTaskStore()
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [showNewTaskModal, setShowNewTaskModal] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id)
    if (task) setActiveTask(task)
  }, [tasks])

  const handleDragOver = useCallback((_event: DragOverEvent) => {
    // Handled in dragEnd for simplicity; could do live preview here
  }, [])

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)

    if (!over) return

    const taskId = active.id as string
    const task = tasks.find((t) => t.id === taskId)
    if (!task) return

    // Check if dropped over a column or another task
    const overColumn = COLUMNS.find((c) => c.id === over.id)
    if (overColumn) {
      if (task.status !== overColumn.id) {
        // Optimistic UI: moveTask updates local state immediately without waiting
        moveTask(taskId, overColumn.id)
      }
      return
    }

    // Dropped over another task - move to same column
    const overTask = tasks.find((t) => t.id === over.id)
    if (overTask && task.status !== overTask.status) {
      moveTask(taskId, overTask.status)
    }
  }, [tasks, moveTask])

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Task Board</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{tasks.length} total tasks</p>
        </div>
        <Button onClick={() => setShowNewTaskModal(true)}>
          + New Task
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {COLUMNS.map((col) => (
            <KanbanColumn
              key={col.id}
              id={col.id}
              title={col.title}
              color={col.color}
              tasks={tasks.filter((t) => t.status === col.id)}
              onEdit={setEditingTask}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask && (
            <div className="rotate-2 opacity-90">
              <TaskCard task={activeTask} />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      <Modal
        isOpen={showNewTaskModal}
        onClose={() => setShowNewTaskModal(false)}
        title="Create New Task"
      >
        <TaskForm onClose={() => setShowNewTaskModal(false)} />
      </Modal>

      <Modal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        title="Edit Task"
      >
        {editingTask && (
          <TaskForm task={editingTask} onClose={() => setEditingTask(null)} />
        )}
      </Modal>
    </div>
  )
}