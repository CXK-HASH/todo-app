'use client'

import { Todo } from '@/lib/supabase/types'
import { useState } from 'react'

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string, completed: boolean) => void
  onDelete: (id: string) => void
}

export default function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    await onDelete(todo.id)
    setIsDeleting(false)
  }

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={(e) => onToggle(todo.id, e.target.checked)}
          className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
        />
        <span
          className={`text-lg ${todo.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}
        >
          {todo.title}
        </span>
      </div>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isDeleting ? '删除中...' : '删除'}
      </button>
    </div>
  )
}