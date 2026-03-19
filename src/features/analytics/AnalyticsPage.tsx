import React, { useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { useTaskStore } from '../../store/taskStore'
import { useStandupStore } from '../../store/standupStore'
import { useAuthStore } from '../../store/authStore'
import { Card } from '../../components/Card'

const STATUS_COLORS = {
  todo: '#94a3b8',
  inprogress: '#3b82f6',
  blocked: '#ef4444',
  done: '#22c55e',
}

const STATUS_LABELS = {
  todo: 'To Do',
  inprogress: 'In Progress',
  blocked: 'Blocked',
  done: 'Done',
}

export const AnalyticsPage: React.FC = () => {
  const { tasks } = useTaskStore()
  const { standups } = useStandupStore()
  const { user } = useAuthStore()

  const userTasks = tasks.filter((t) => t.assigneeId === user?.id || user?.role === 'mentor')

  const statusData = useMemo(() => {
    return Object.entries(STATUS_LABELS).map(([status, label]) => ({
      name: label,
      value: userTasks.filter((t) => t.status === status).length,
      fill: STATUS_COLORS[status as keyof typeof STATUS_COLORS],
    }))
  }, [userTasks])

  const completionRate = userTasks.length
    ? Math.round((userTasks.filter((t) => t.status === 'done').length / userTasks.length) * 100)
    : 0

  const priorityData = useMemo(() => {
    return ['high', 'medium', 'low'].map((p) => ({
      name: p.charAt(0).toUpperCase() + p.slice(1),
      total: userTasks.filter((t) => t.priority === p).length,
      done: userTasks.filter((t) => t.priority === p && t.status === 'done').length,
    }))
  }, [userTasks])

  const weeklyActivity = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (6 - i))
      return d
    })
    return days.map((day) => ({
      day: day.toLocaleDateString('en-US', { weekday: 'short' }),
      tasks: userTasks.filter((t) => {
        const updated = new Date(t.updatedAt)
        return updated.toDateString() === day.toDateString() && t.status === 'done'
      }).length,
      standups: standups.filter((s) => {
        const date = new Date(s.date)
        return date.toDateString() === day.toDateString() && s.userId === user?.id
      }).length,
    }))
  }, [userTasks, standups, user])

  const streak = useMemo(() => {
    let count = 0
    for (let i = 0; i < 30; i++) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const hasStandup = standups.some(
        (s) => s.userId === user?.id && new Date(s.date).toDateString() === d.toDateString()
      )
      if (hasStandup) count++
      else break
    }
    return count
  }, [standups, user])

  const stats = [
    { label: 'Total Tasks', value: userTasks.length, emoji: '📋' },
    { label: 'Completed', value: userTasks.filter((t) => t.status === 'done').length, emoji: '✅' },
    { label: 'Completion Rate', value: `${completionRate}%`, emoji: '📊' },
    { label: 'Standup Streak', value: `${streak} days`, emoji: '🔥' },
  ]

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Progress Analytics</h1>

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="text-center">
            <div className="text-3xl">{stat.emoji}</div>
            <div className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-base font-semibold text-gray-900 dark:text-white">
            Tasks by Status
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h2 className="mb-4 text-base font-semibold text-gray-900 dark:text-white">
            Weekly Activity
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyActivity} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="tasks" name="Tasks Done" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="standups" name="Standups" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="lg:col-span-2">
          <h2 className="mb-4 text-base font-semibold text-gray-900 dark:text-white">
            Tasks by Priority
          </h2>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={priorityData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="total" name="Total" fill="#94a3b8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="done" name="Done" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  )
}