import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '待办清单 - Todo App',
  description: '使用 Next.js 和 Supabase 构建的现代化待办清单应用',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  )
}