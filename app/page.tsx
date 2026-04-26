'use client'

import { useState, useEffect } from 'react'
import { getTodos, updateTodo, deleteTodo, addTodo } from '@/lib/todo'
import { Todo } from '@/lib/supabase/types'

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTitle, setNewTitle] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const loadTodos = async () => {
    try {
      const data = await getTodos()
      setTodos(data)
    } catch (err) {
      console.error('Failed to load todos:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadTodos()
  }, [])

  const handleAdd = async () => {
    if (!newTitle.trim() || isSubmitting) return
    setIsSubmitting(true)
    const result = await addTodo(newTitle.trim())
    setIsSubmitting(false)
    if (result) {
      setNewTitle('')
      loadTodos()
    }
  }

  const handleToggle = async (id: string, completed: boolean) => {
    await updateTodo(id, { completed })
    loadTodos()
  }

  const handleDelete = async (id: string) => {
    await deleteTodo(id)
    loadTodos()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* 标题区域 */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">待办清单</h1>
          <p className="text-gray-600">管理你的每日任务，保持高效</p>
        </div>

        {/* 添加任务表单 */}
        <form 
          onSubmit={(e) => { e.preventDefault(); handleAdd() }} 
          className="mb-8"
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="输入新的待办事项..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              disabled={isSubmitting}
            />
            <button
              type="submit"
              disabled={!newTitle.trim() || isSubmitting}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? '添加中...' : '添加'}
            </button>
          </div>
        </form>

        {/* 任务列表 */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">我的任务</h2>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              {todos.length} 个任务
            </span>
          </div>
          
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-500">加载中...</p>
            </div>
          ) : todos.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📝</div>
              <p className="text-gray-500 text-lg">还没有待办事项</p>
              <p className="text-gray-400 text-sm mt-2">添加你的第一个任务吧！</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todos.map((todo) => (
                <div key={todo.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={(e) => handleToggle(todo.id, e.target.checked)}
                      className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className={`text-lg ${todo.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                      {todo.title}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDelete(todo.id)}
                    className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                  >
                    删除
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 页脚说明 */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>✅ 点击复选框标记完成 • 🗑️ 点击删除按钮移除任务</p>
          <p className="mt-1">数据实时保存到 Supabase 数据库</p>
        </div>
      </div>
    </div>
  )
}