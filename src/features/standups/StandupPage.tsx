import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useStandupStore } from '../../store/standupStore'
import { useAuthStore } from '../../store/authStore'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import type { Standup } from '../../types'

const standupSchema = z.object({
  yesterday: z.string().min(1, 'Required').max(500),
  today: z.string().min(1, 'Required').max(500),
  blockers: z.string().max(500),
  mood: z.enum(['great', 'good', 'okay', 'struggling']),
})

type StandupFormData = z.infer<typeof standupSchema>

const moodEmojis: Record<Standup['mood'], string> = {
  great: '🚀',
  good: '😊',
  okay: '😐',
  struggling: '😓',
}

const moodColors: Record<Standup['mood'], string> = {
  great: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  good: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  okay: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  struggling: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
}

export const StandupPage: React.FC = () => {
  const { standups, addStandup } = useStandupStore()
  const { user } = useAuthStore()
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<StandupFormData>({
    resolver: zodResolver(standupSchema),
    defaultValues: { mood: 'good', blockers: 'None' },
  })

  const selectedMood = watch('mood')

  const todayStandup = standups.find(
    (s) =>
      s.userId === user?.id &&
      new Date(s.date).toDateString() === new Date().toDateString()
  )

  const onSubmit = (data: StandupFormData) => {
    if (!user) return
    addStandup({
      id: `standup-${Date.now()}`,
      userId: user.id,
      date: new Date().toISOString(),
      yesterday: data.yesterday,
      today: data.today,
      blockers: data.blockers || 'None',
      mood: data.mood,
      createdAt: new Date().toISOString(),
    })
    reset({ mood: 'good', blockers: 'None' })
  }

  return (
    <div className="mx-auto max-w-3xl p-4 md:p-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Daily Standup</h1>

      {!todayStandup ? (
        <Card className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Today's Update
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                What did you do yesterday?
              </label>
              <textarea
                {...register('yesterday')}
                rows={2}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                placeholder="Completed the login page..."
              />
              {errors.yesterday && <p className="mt-1 text-xs text-red-500">{errors.yesterday.message}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                What will you do today?
              </label>
              <textarea
                {...register('today')}
                rows={2}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                placeholder="Work on the Kanban board..."
              />
              {errors.today && <p className="mt-1 text-xs text-red-500">{errors.today.message}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Blockers
              </label>
              <input
                {...register('blockers')}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                placeholder="None"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                How are you feeling?
              </label>
              <div className="flex gap-3">
                {(['great', 'good', 'okay', 'struggling'] as const).map((mood) => (
                  <label key={mood} className="cursor-pointer">
                    <input
                      {...register('mood')}
                      type="radio"
                      value={mood}
                      className="sr-only"
                    />
                    <div className={`flex flex-col items-center rounded-xl border-2 px-3 py-2 transition-all ${
                      selectedMood === mood
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
                    }`}>
                      <span className="text-2xl">{moodEmojis[mood]}</span>
                      <span className="mt-1 text-xs capitalize text-gray-600 dark:text-gray-400">{mood}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <Button type="submit" className="w-full">
              Submit Standup
            </Button>
          </form>
        </Card>
      ) : (
        <Card className="mb-8 border-l-4 border-green-500">
          <div className="flex items-center gap-2">
            <span className="text-2xl">✅</span>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Standup submitted today!</p>
              <p className="text-sm text-gray-500">Come back tomorrow for the next update.</p>
            </div>
          </div>
        </Card>
      )}

      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Standup History
        </h2>
        {standups.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">No standups yet.</p>
        ) : (
          <div className="space-y-4">
            {standups.map((standup) => (
              <Card key={standup.id} className="border-l-4 border-blue-500">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="mb-3 flex items-center gap-2">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${moodColors[standup.mood]}`}>
                        {moodEmojis[standup.mood]} {standup.mood}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(standup.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Yesterday</p>
                        <p className="text-sm text-gray-800 dark:text-gray-200">{standup.yesterday}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Today</p>
                        <p className="text-sm text-gray-800 dark:text-gray-200">{standup.today}</p>
                      </div>
                      {standup.blockers && standup.blockers !== 'None' && (
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-red-500">Blockers</p>
                          <p className="text-sm text-gray-800 dark:text-gray-200">{standup.blockers}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}