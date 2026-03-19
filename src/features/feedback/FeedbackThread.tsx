import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFeedbackStore } from '../../store/feedbackStore'
import { useAuthStore } from '../../store/authStore'
import { Button } from '../../components/Button'
import type { Comment } from '../../types'

const commentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty').max(500),
})

type CommentFormData = z.infer<typeof commentSchema>

interface FeedbackThreadProps {
  taskId: string
  parentId?: string
}

const CommentItem: React.FC<{ comment: Comment; onReply: (id: string) => void }> = ({
  comment,
  onReply,
}) => {
  const { user } = useAuthStore()
  const { deleteComment, comments } = useFeedbackStore()
  const replies = comments.filter((c) => c.parentId === comment.id)

  return (
    <div className="group">
      <div className="flex gap-2">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
          {comment.authorId.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <div className="rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-800">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {comment.authorId}
              </span>
              <span className="text-xs text-gray-400">
                {new Date(comment.createdAt).toLocaleString()}
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-800 dark:text-gray-200">{comment.content}</p>
          </div>
          <div className="mt-1 flex gap-3">
            <button
              onClick={() => onReply(comment.id)}
              className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              Reply
            </button>
            {user?.id === comment.authorId && (
              <button
                onClick={() => deleteComment(comment.id)}
                className="text-xs text-red-500 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Delete
              </button>
            )}
          </div>
          {replies.length > 0 && (
            <div className="mt-2 ml-4 space-y-2 border-l-2 border-gray-200 pl-3 dark:border-gray-700">
              {replies.map((reply) => (
                <CommentItem key={reply.id} comment={reply} onReply={onReply} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export const FeedbackThread: React.FC<FeedbackThreadProps> = ({ taskId }) => {
  const { comments, addComment } = useFeedbackStore()
  const { user } = useAuthStore()
  const [replyingTo, setReplyingTo] = useState<string | undefined>()
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
  })

  const rootComments = comments.filter((c) => c.taskId === taskId && !c.parentId)

  const onSubmit = (data: CommentFormData) => {
    if (!user) return
    addComment({
      id: `comment-${Date.now()}`,
      taskId,
      authorId: user.id,
      content: data.content,
      createdAt: new Date().toISOString(),
      parentId: replyingTo,
    })
    reset()
    setReplyingTo(undefined)
  }

  return (
    <div className="mt-2 rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900">
      <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        Feedback Thread
      </h4>
      <div className="space-y-3">
        {rootComments.length === 0 && (
          <p className="text-xs text-gray-400">No feedback yet. Start the conversation!</p>
        )}
        {rootComments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onReply={(id) => setReplyingTo(id === replyingTo ? undefined : id)}
          />
        ))}
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-3">
        {replyingTo && (
          <div className="mb-2 flex items-center gap-2">
            <span className="text-xs text-blue-600 dark:text-blue-400">
              Replying to comment
            </span>
            <button
              type="button"
              onClick={() => setReplyingTo(undefined)}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              Cancel
            </button>
          </div>
        )}
        <div className="flex gap-2">
          <input
            {...register('content')}
            placeholder={replyingTo ? 'Write a reply...' : 'Add feedback...'}
            className="flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
          <Button type="submit" size="sm">
            Send
          </Button>
        </div>
        {errors.content && (
          <p className="mt-1 text-xs text-red-500">{errors.content.message}</p>
        )}
      </form>
    </div>
  )
}