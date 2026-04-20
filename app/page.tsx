import TodoList from '@/components/TodoList'
import AddTodoForm from '@/components/AddTodoForm'
import { getTodos } from '@/lib/todo'

export default async function Home() {
  const todos = await getTodos()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* 标题区域 */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">待办清单</h1>
          <p className="text-gray-600">管理你的每日任务，保持高效</p>
        </div>

        {/* 添加任务表单 */}
        <div className="mb-8">
          <AddTodoForm onTodoAdded={() => {}} />
        </div>

        {/* 任务列表 */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">我的任务</h2>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              {todos.length} 个任务
            </span>
          </div>
          
          <TodoList 
            todos={todos} 
            onTodosChange={() => {}} 
          />
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