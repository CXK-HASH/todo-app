# 待办清单 (Todo List) Web应用

一个现代化的待办清单应用，使用 Next.js 14 (App Router)、Supabase 和 Tailwind CSS 构建。

## 功能特性

- ✅ **添加任务** - 输入框 + 添加按钮
- ✅ **标记完成** - 复选框切换任务状态
- ✅ **删除任务** - 删除按钮移除任务
- ✅ **数据持久化** - 使用 Supabase PostgreSQL 数据库
- ✅ **实时更新** - 数据变更立即反映
- ✅ **响应式设计** - 适配各种设备屏幕

## 技术栈

- **前端框架**: Next.js 14 (App Router)
- **样式**: Tailwind CSS
- **数据库**: Supabase (PostgreSQL)
- **部署**: Vercel
- **语言**: TypeScript

## 快速开始

### 1. 克隆项目
```bash
git clone <repository-url>
cd todo-app
```

### 2. 安装依赖
```bash
npm install
```

### 3. 配置环境变量
复制 `.env.example` 为 `.env.local` 并填写你的 Supabase 配置：
```bash
cp .env.example .env.local
```

在 `.env.local` 中设置：
```env
NEXT_PUBLIC_SUPABASE_URL=你的Supabase项目URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的Supabase匿名密钥
```

### 4. 设置 Supabase 数据库

1. 访问 [Supabase](https://supabase.com) 并创建新项目
2. 在 SQL 编辑器中运行 `supabase/migrations/001_create_todos_table.sql`
3. 获取项目 URL 和匿名密钥，填入环境变量

### 5. 运行开发服务器
```bash
npm run dev
```
访问 http://localhost:3000

## 部署到 Vercel

### 方法1: Vercel CLI
```bash
npm i -g vercel
vercel
```

### 方法2: GitHub 集成
1. 将代码推送到 GitHub 仓库
2. 在 Vercel 中导入项目
3. 配置环境变量
4. 点击部署

### 方法3: Vercel 网页界面
1. 访问 [Vercel](https://vercel.com)
2. 点击 "New Project"
3. 导入你的 Git 仓库
4. 配置环境变量
5. 点击 "Deploy"

## 项目结构

```
todo-app/
├── app/                    # Next.js App Router 页面
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 主页
├── components/            # React 组件
│   ├── AddTodoForm.tsx    # 添加任务表单
│   ├── TodoItem.tsx       # 单个任务项
│   └── TodoList.tsx       # 任务列表
├── lib/                   # 工具函数和配置
│   ├── supabase/          # Supabase 客户端配置
│   └── todo.ts            # 数据访问层
├── supabase/              # 数据库迁移文件
│   └── migrations/
├── public/                # 静态资源
└── 配置文件
```

## 数据库表结构

```sql
CREATE TABLE todos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 开发说明

### 添加新功能
1. 在 `lib/todo.ts` 中添加新的数据访问函数
2. 创建相应的 React 组件
3. 在页面中集成组件

### 样式定制
- 修改 `app/globals.css` 中的全局样式
- 使用 Tailwind CSS 类名在组件中定制样式
- 在 `tailwind.config.ts` 中扩展主题

### 数据库变更
1. 在 `supabase/migrations/` 中创建新的 SQL 迁移文件
2. 在 Supabase 控制台中运行迁移
3. 更新 `lib/supabase/types.ts` 中的类型定义

## 许可证

MIT