import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

/** GET /api/tasks?category=xxx — 获取任务列表，可按分类名称筛选 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')

  const supabase = getSupabase()
  let query = supabase.from('todos').select('*')

  if (category) {
    query = query.eq('category', category)
  }

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

/** POST /api/tasks — 创建任务，请求体: { title, category_id? } */
export async function POST(request: Request) {
  const body = await request.json()
  const { title, category_id } = body

  if (!title || !title.trim()) {
    return NextResponse.json({ error: '标题不能为空' }, { status: 400 })
  }

  const supabase = getSupabase()

  // 获取分类名称
  let categoryName = '默认'
  if (category_id) {
    const { data: cat } = await supabase
      .from('categories')
      .select('name')
      .eq('id', category_id)
      .single()

    if (cat) categoryName = cat.name
  }

  const { data, error } = await supabase
    .from('todos')
    .insert([{
      title: title.trim(),
      completed: false,
      category: categoryName,
      category_id: category_id || null,
    }])
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
