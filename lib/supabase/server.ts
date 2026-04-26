import { createClient as createBrowserClient } from './client'

// 在 App Router 中直接使用浏览器客户端
// 对于开发环境，这已经足够了
export async function createClient() {
  return createBrowserClient()
}

/**
 * 如果需要 Service Role Key 进行管理操作
 * 在 Next.js API Routes 或 Server Actions 中使用
 */
export function getServiceClient() {
  const { createClient } = require('@supabase/supabase-js')
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}