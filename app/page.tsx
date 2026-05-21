'use client'

import { useState, useEffect, useCallback } from 'react'
import { getTodos, updateTodo, deleteTodo, addTodo, getCategories } from '@/lib/todo'
import { Todo, Category } from '@/lib/supabase/types'

const DEFAULT_COLOR = { bg: 'bg-gray-100', text: 'text-gray-600' }

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
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [filterCategoryId, setFilterCategoryId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [aiCategoryName, setAiCategoryName] = useState<string | null>(null)
  const [lastAiTitle, setLastAiTitle] = useState('')

  const loadData = useCallback(async () => {
    try {
      const [todosData, categoriesData] = await Promise.all([
        getTodos(),
        getCategories(),
      ])
      setTodos(todosData)
      setCategories(categoriesData)
    } catch (err) {
      console.error('加载数据失败:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  useEffect(() => {
    // 分类列表加载后，默认选中第一个非"默认"的分类
    if (categories.length > 0 && !selectedCategoryId) {
      const first = categories.find(c => c.name !== '默认') || categories[0]
      setSelectedCategoryId(first.id)
    }
  }, [categories, selectedCategoryId])

  const handleAdd = async () => {
    if (!newTitle.trim() || isSubmitting) return
    setIsSubmitting(true)

    // AI 自动分类（输入变化时重新分类）
    if (newTitle.trim() !== lastAiTitle) {
      try {
        const res = await fetch('/api/classify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: newTitle.trim() }),
        })
        const data = await res.json()
        if (data?.category) {
          setAiCategoryName(data.category)
          setLastAiTitle(newTitle.trim())
          // 自动选中 AI 推荐的分类
          const aiCat = categories.find(c => c.name === data.category)
          if (aiCat) setSelectedCategoryId(aiCat.id)
        }
      } catch {
        // AI 分类失败，保持用户选择
      }
    }

    const cat = categories.find(c => c.id === categoryId)
    const result = await addTodo(newTitle.trim(), categoryId, cat?.name || '默认')
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
    return cat ? hexToTailwind(cat.color) : DEFAULT_COLOR
  }

  const getCategoryInfo = (categoryId: string | null) => {
    if (!categoryId) return { name: '默认', icon: '📋' }
    const cat = categories.find(c => c.id === categoryId)
    return cat ? { name: cat.name, icon: cat.icon } : { name: '默认', icon: '📋' }
  }

  const filteredTodos = filterCategoryId
    ? todos.filter((todo) => todo.category_id === filterCategoryId)
    : todos

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 标题 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">待办清单</h1>
          <p className="text-gray-500">管理你的每日任务，保持高效</p>
        </div>

        <div className="flex gap-6">
          {/* ========== 左侧分类筛选栏 ========== */}
          <div className="w-48 shrink-0">
            <div className="bg-white rounded-xl shadow-lg p-4 sticky top-8">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center justify-between">
                分类筛选
                <span className="text-[10px] text-purple-400 font-normal normal-case">🤖 AI</span>
              </h3>
              <div className="space-y-1">
                {/* 全部 */}
                <button
                  onClick={() => setFilterCategoryId(null)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterCategoryId === null
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  📋 全部
                </button>

                {/* 每个分类 */}
                {categories.map((cat) => {
                  const active = filterCategoryId === cat.id
                  const color = hexToTailwind(cat.color)
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setFilterCategoryId(active ? null : cat.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        active
                          ? `${color.bg} ${color.text}`
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {cat.icon} {cat.name}
                    </button>
                  )
                })}
              </div>

              {/* 任务统计 */}
              <div className="mt-5 pt-4 border-t border-gray-100">
                <div className="text-xs text-gray-400 space-y-1">
                  {filterCategoryId ? (
                    <p>{filteredTodos.length} 条结果</p>
                  ) : (
                    categories.map(cat => (
                      <p key={cat.id} className="flex justify-between">
                        <span>{cat.icon} {cat.name}</span>
                        <span>{todos.filter(t => t.category_id === cat.id).length}</span>
                      </p>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ========== 右侧主内容 ========== */}
          <div className="flex-1 min-w-0">
            {/* 添加任务表单 */}
            <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
              <form onSubmit={(e) => { e.preventDefault(); handleAdd() }} className="flex gap-3">
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="输入新的待办事项..."
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-900"
                  disabled={isSubmitting}
                />
                <select
                  value={selectedCategoryId || ''}
                  onChange={(e) => setSelectedCategoryId(e.target.value || null)}
                  className="px-3 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                  ))}
                </select>
                <button
                  type="submit"
                  disabled={!newTitle.trim() || isSubmitting}
                  className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
                >
                  {isSubmitting ? '添加中...' : '添加'}
                </button>
              </form>
              {/* AI 分类提示 */}
              {aiCategoryName && newTitle.trim() && (
                <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 font-medium">
                    🤖 AI分类
                  </span>
                  <span>检测为：<strong>{aiCategoryName}</strong></span>
                  <span className="text-gray-300">·</span>
                  <span className="text-gray-400">可下拉手动更改</span>
                </div>
              )}
            </div>

            {/* 任务列表 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-semibold text-gray-800">
                  {filterCategoryId ? getCategoryInfo(filterCategoryId).icon + ' ' + getCategoryInfo(filterCategoryId).name : '所有任务'}
                </h2>
                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                  {filterCategoryId ? `${filteredTodos.length} 条` : `${todos.length} 个任务`}
                </span>
              </div>

              {isLoading ? (
                <div className="text-center py-16">
                  <div className="animate-spin h-8 w-8 border-3 border-blue-500 border-t-transparent rounded-full mx-auto mb-3"></div>
                  <p className="text-gray-400 text-sm">加载中...</p>
                </div>
              ) : filteredTodos.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-5xl mb-3">📭</div>
                  <p className="text-gray-500">
                    {filterCategoryId ? `「${getCategoryInfo(filterCategoryId).name}」类暂时没有任务` : '还没有待办事项'}
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    {filterCategoryId ? '换个分类看看吧' : '在上面输入框添加你的第一个任务吧！'}
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredTodos.map((todo) => {
                    const catInfo = getCategoryInfo(todo.category_id)
                    const color = getColor(todo.category_id)
                    return (
                      <div
                        key={todo.id}
                        className="flex items-center justify-between p-3.5 rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <input
                            type="checkbox"
                            checked={todo.completed}
                            onChange={(e) => handleToggle(todo.id, e.target.checked)}
                            className="h-4 w-4 text-blue-600 rounded focus:ring-blue-400 shrink-0"
                          />
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${color.bg} ${color.text} shrink-0 flex items-center gap-1`}>
                            {catInfo.icon} {catInfo.name}
                          </span>
                          <span className={`text-base truncate ${todo.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                            {todo.title}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDelete(todo.id)}
                          className="px-2.5 py-1 text-xs text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors shrink-0 ml-2 opacity-0 hover:opacity-100"
                        >
                          删除
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-gray-400 text-xs">
          ✅ 勾选完成任务 · 🗑️ 悬停点击删除 · 📊 左侧分类筛选
        </div>
      </div>
    </div>
  )
}
