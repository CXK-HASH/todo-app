'use client'

import { Todo } from '@/lib/supabase/types'
import TodoItem from './TodoItem'
import { updateTodo, deleteTodo } from '@/lib/todo'

interface TodoListProps {
  todos: Todo[]
  onTodosChange: () => void
}

export default function TodoList({ todos, onTodosChange }: TodoListProps) {
  const handleToggle = async (id: string, completed: boolean) => {
    await updateTodo(id, { completed })
    onTodosChange()
  }

  const handleDelete = async (id: string) => {
    await deleteTodo(id)
    onTodosChange()
  }

  if (todos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📝</div>
        <p className="text-gray-500 text-lg">还没有待办事项</p>
        <p className="text-gray-400 text-sm mt-2">添加你的第一个任务吧！</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />
      ))}
    </div>
  )
}