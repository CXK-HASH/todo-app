# 部署指南

## 步骤1: 设置 Supabase 数据库

### 1.1 创建 Supabase 项目
1. 访问 [Supabase](https://supabase.com) 并注册/登录
2. 点击 "New project"
3. 填写项目名称 (如: `todo-app`)
4. 设置数据库密码
5. 选择区域 (建议选择离你近的区域)
6. 点击 "Create new project"

### 1.2 配置数据库表
1. 项目创建完成后，进入左侧菜单的 **SQL Editor**
2. 点击 **New query**
3. 复制 `supabase/migrations/001_create_todos_table.sql` 的内容
4. 粘贴到编辑器中
5. 点击 **Run** 执行 SQL

### 1.3 获取 API 密钥
1. 进入左侧菜单的 **Settings** → **API**
2. 复制以下信息：
   - **Project URL** → 填入 `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → 填入 `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 步骤2: 部署到 Vercel

### 方法A: 通过 Vercel 网页界面 (推荐)
1. **推送代码到 GitHub**
   ```bash
   git remote add origin https://github.com/你的用户名/todo-app.git
   git push -u origin master
   ```

2. **在 Vercel 部署**
   - 访问 [Vercel](https://vercel.com)
   - 点击 "New Project"
   - 导入你的 GitHub 仓库
   - 点击 "Import"

3. **配置环境变量**
   - 在项目设置页面，点击 **Environment Variables**
   - 添加以下变量：
     ```
     NEXT_PUBLIC_SUPABASE_URL=你的Supabase项目URL
     NEXT_PUBLIC_SUPABASE_ANON_KEY=你的Supabase匿名密钥
     ```
   - 点击 **Save**

4. **部署**
   - 点击 **Deploy**
   - 等待部署完成
   - 访问提供的 URL 查看应用

### 方法B: 通过 Vercel CLI
1. **安装 Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **登录 Vercel**
   ```bash
   vercel login
   ```

3. **部署项目**
   ```bash
   cd todo-app
   vercel
   ```
   
   按照提示操作：
   - 选择默认设置
   - 添加环境变量
   - 确认部署

4. **生产环境部署**
   ```bash
   vercel --prod
   ```

## 步骤3: 验证部署

### 3.1 测试应用功能
1. 访问你的 Vercel 应用 URL
2. 测试以下功能：
   - ✅ 添加新任务
   - ✅ 标记任务为完成
   - ✅ 删除任务
   - ✅ 刷新页面验证数据持久化

### 3.2 检查数据库
1. 回到 Supabase 控制台
2. 进入 **Table Editor**
3. 选择 `todos` 表
4. 确认数据正确保存

## 故障排除

### 问题1: 环境变量未设置
**症状**: 应用无法连接到数据库
**解决**: 
1. 在 Vercel 项目设置中检查环境变量
2. 确保变量名正确
3. 重新部署应用

### 问题2: 数据库连接错误
**症状**: 无法添加或显示任务
**解决**:
1. 检查 Supabase 项目 URL 和密钥
2. 确认数据库表已创建
3. 检查网络连接

### 问题3: 构建失败
**症状**: Vercel 部署失败
**解决**:
1. 检查 `package.json` 中的依赖
2. 确保 TypeScript 配置正确
3. 查看构建日志中的具体错误

### 问题4: CORS 错误
**症状**: 浏览器控制台显示 CORS 错误
**解决**:
1. 在 Supabase 的 **Authentication** → **URL Configuration** 中
2. 添加你的 Vercel 域名到 **Site URL** 和 **Redirect URLs**

## 后续步骤

### 1. 添加身份验证
- 使用 Supabase Auth 添加用户登录
- 每个用户只能看到自己的任务

### 2. 添加更多功能
- 任务分类/标签
- 截止日期提醒
- 任务优先级
- 搜索和过滤

### 3. 性能优化
- 添加数据缓存
- 实现无限滚动
- 优化数据库查询

### 4. 监控和分析
- 添加 Google Analytics
- 设置错误监控 (Sentry)
- 数据库性能监控

## 支持

如有问题，请：
1. 检查本文档
2. 查看项目 README
3. 在 GitHub 创建 Issue
4. 参考官方文档：
   - [Next.js 文档](https://nextjs.org/docs)
   - [Supabase 文档](https://supabase.com/docs)
   - [Vercel 文档](https://vercel.com/docs)