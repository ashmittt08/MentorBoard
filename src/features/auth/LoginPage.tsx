import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '../../store/authStore'
import type { User } from '../../types'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  role: z.enum(['intern', 'mentor']),
})

type LoginFormData = z.infer<typeof loginSchema>

const MOCK_USERS: User[] = [
  { id: 'intern1', name: 'Alex Chen', email: 'intern@mentorboard.dev', role: 'intern' },
  { id: 'intern2', name: 'Jamie Park', email: 'intern2@mentorboard.dev', role: 'intern' },
  { id: 'mentor1', name: 'Sam Rivera', email: 'mentor@mentorboard.dev', role: 'mentor' },
]

export const LoginPage: React.FC = () => {
  const { login } = useAuthStore()
  const navigate = useNavigate()
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: 'intern@mentorboard.dev', role: 'intern' },
  })

  const selectedRole = watch('role')

  const onSubmit = (data: LoginFormData) => {
    const user = MOCK_USERS.find((u) => u.email === data.email && u.role === data.role)
    if (user) {
      login(user)
      navigate('/board')
    }
  }

  const quickLogin = (user: User) => {
    login(user)
    navigate('/board')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-3 text-5xl">🎯</div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">MentorBoard</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Internship Collaboration Dashboard</p>
        </div>
        <Card className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                {...register('email')}
                type="email"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                placeholder="intern@mentorboard.dev"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Role
              </label>
              <div className="flex gap-3">
                {(['intern', 'mentor'] as const).map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setValue('role', role)}
                    className={`flex-1 rounded-lg border-2 py-2 text-sm font-medium capitalize transition-all ${
                      selectedRole === role
                        ? 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:text-gray-400'
                    }`}
                  >
                    {role === 'intern' ? '👨‍💻 Intern' : '🧑‍🏫 Mentor'}
                  </button>
                ))}
              </div>
              {errors.role && (
                <p className="mt-1 text-xs text-red-500">{errors.role.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full" size="lg">
              Sign In
            </Button>
          </form>
          <div className="mt-6">
            <p className="mb-3 text-center text-xs text-gray-500 dark:text-gray-400">
              Quick login with demo accounts:
            </p>
            <div className="flex flex-col gap-2">
              {MOCK_USERS.map((user) => (
                <button
                  key={user.id}
                  onClick={() => quickLogin(user)}
                  className="flex items-center gap-3 rounded-lg border border-gray-200 px-3 py-2 text-left text-sm hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 dark:bg-blue-900/40 dark:text-blue-400">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{user.name}</div>
                    <div className="text-xs text-gray-500">{user.email} · {user.role}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}