-- 给 todos 表添加 category 字段
ALTER TABLE todos ADD COLUMN IF NOT EXISTS category TEXT DEFAULT '默认';

-- 更新示例数据，设置分类
UPDATE todos SET category = '学习' WHERE title = '学习 Next.js';
UPDATE todos SET category = '工作' WHERE title = '配置 Supabase';
UPDATE todos SET category = '工作' WHERE title = '部署到 Vercel';
