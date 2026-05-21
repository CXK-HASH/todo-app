'use client'

import { useState, useEffect } from 'react'
import { getTodos, updateTodo, deleteTodo, addTodo, getCategories } from '@/lib/todo'
import { Todo, Category } from '@/lib/supabase/types'

// 本地默认的颜色映射（fallback）
const LOCAL_CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  '工作': { bg: 'bg-blue-100', text: 'text-blue-700' },
  '学习': { bg: 'bg-green-100', text: 'text-green-700' },
  '生活': { bg: 'bg-orange-100', text: 'text-orange-700' },
}

const DEFAULT_COLOR = { bg: 'bg-gray-100', text: 'text-gray-600' }

// 根据 hex 颜色映射到 Tailwind 颜色类名
function hexToTailwind(hex: string | undefined): { bg: string; text: string } {
  if (!hex) return DEFAULT_COLOR
  const map: Record<string, { bg: string; text: string }> = {
    '#3B82F6': { bg: 'bg-blue-100', text: 'text-blue-700' },
    '#22C55E': { bg: 'bg-green-100', text: 'text-green-700' },
    '#F97316': { bg: 'bg-orange-100', text: 'text-orange-700' },
    '#6B7280': { bg: 'bg-gray-100', text: 'text-gray-600' },
    '#EF4444': { bg: 'bg-red-100', text: 'text-red-700' },
    '#A855F7': { bg: 'bg-purple-100', text: 'text-purple-700' },
    '#EC4899': { bg: 'bg-pink-100', text: 'text-pink-700' },
    '#14B8A6': { bg: 'bg-teal-100', text: 'text-teal-700' },
    '#EAB308': { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  }
  return map[hex.toUpperCase()] || DEFAULT_COLOR
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [newTitle, setNewTitle] = useState('')
  const [newCategoryId, setNewCategoryId] = useState<string | null>(null)
  const [filterCategoryId, setFilterCategoryId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const loadData = async () => {
    try {
      const [todosData, categoriesData] = await Promise.all([
        getTodos(),
        getCategories(),
      ])
      setTodos(todosData)
      setCategories(categoriesData)
      // 默认选中第一个分类
      if (categoriesData.length > 0 && !newCategoryId) {
        setNewCategoryId(categoriesData[0].id)
      }
    } catch (err) {
      console.error('Failed to load data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleAdd = async () => {
    if (!newTitle.trim() || isSubmitting) return
    setIsSubmitting(true)
    const selectedCategory = categories.find(c => c.id === newCategoryId)
    const result = await addTodo(newTitle.trim(), newCategoryId, selectedCategory?.name || '默认')
    setIsSubmitting(false)
    if (result) {
      setNewTitle('')
      loadData()
    }
  }

  const handleToggle = async (id: string, completed: boolean) => {
    await updateTodo(id, { completed })
    loadData()
  }

  const handleDelete = async (id: string) => {
    await deleteTodo(id)
    loadData()
  }

  const getColor = (categoryId: string | null) => {
    if (!categoryId) return DEFAULT_COLOR
    const cat = categories.find(c => c.id === categoryId)
    if (!cat) return DEFAULT_COLOR
    return hexToTailwind(cat.color)
  }

  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return '默认'
    const cat = categories.find(c => c.id === categoryId)
    return cat?.name || '默认'
  }

  const filteredTodos = filterCategoryId
    ? todos.filter((todo) => todo.category_id === filterCategoryId)
    : todos

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
            <select
              value={newCategoryId || ''}
              onChange={(e) => setNewCategoryId(e.target.value || null)}
              className="px-3 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
              ))}
            </select>
            <button
              type="submit"
              disabled={!newTitle.trim() || isSubmitting}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? '添加中...' : '添加'}
            </button>
          </div>
        </form>

        {/* 分类筛选按钮 */}
        <div className="flex gap-2 mb-4 flex-wrap">
          <button
            onClick={() => setFilterCategoryId(null)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filterCategoryId === null
                ? 'bg-gray-800 text-white'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            全部
          </button>
          {categories.map((cat) => {
            const color = hexToTailwind(cat.color)
            return (
              <button
                key={cat.id}
                onClick={() => setFilterCategoryId(filterCategoryId === cat.id ? null : cat.id)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  filterCategoryId === cat.id
                    ? `${color.bg} ${color.text} ring-2 ring-offset-1`
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                {cat.icon} {cat.name}
              </button>
            )
          })}
        </div>

        {/* 任务列表 */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">我的任务</h2>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              {filterCategoryId
                ? `${getCategoryName(filterCategoryId)}: ${filteredTodos.length}`
                : `${todos.length} 个任务`}
            </span>
          </div>
          
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-500">加载中...</p>
            </div>
          ) : filteredTodos.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <p className="text-gray-500 text-lg">
                {filterCategoryId ? `没有「${getCategoryName(filterCategoryId)}」类的任务` : '还没有待办事项'}
              </p>
              <p className="text-gray-400 text-sm mt-2">
                {filterCategoryId ? '换个分类看看吧' : '添加你的第一个任务吧！'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTodos.map((todo) => {
                const color = getColor(todo.category_id)
                return (
                <div key={todo.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={(e) => handleToggle(todo.id, e.target.checked)}
                      className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 shrink-0"
                    />
                    <div className="flex items-center space-x-2 min-w-0">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${color.bg} ${color.text} shrink-0`}>
                        {getCategoryName(todo.category_id)}
                      </span>
                      <span className={`text-lg truncate ${todo.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                        {todo.title}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(todo.id)}
                    className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors shrink-0 ml-2"
                  >
                    删除
                  </button>
                </div>
                )})}
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
