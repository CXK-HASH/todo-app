'use client'

import { useState } from 'react'
import { addTodo } from '@/lib/todo'

interface AddTodoFormProps {
  onTodoAdded: () => void
}

export default function AddTodoForm({ onTodoAdded }: AddTodoFormProps) {
  const [title, setTitle] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || isSubmitting) return

    setIsSubmitting(true)
    const success = await addTodo(title.trim())
    setIsSubmitting(false)

    if (success) {
      setTitle('')
      onTodoAdded()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex gap-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="输入新的待办事项..."
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
          disabled={isSubmitting}
        />
        <button
          type="submit"
          disabled={!title.trim() || isSubmitting}
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? '添加中...' : '添加'}
        </button>
      </div>
    </form>
  )
}