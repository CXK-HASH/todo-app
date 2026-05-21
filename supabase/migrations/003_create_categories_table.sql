-- 创建 categories 表
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  color TEXT NOT NULL DEFAULT '#3B82F6',
  icon TEXT DEFAULT '📋',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 给 todos 表添加 category_id 字段（先保留旧的 category 字段做迁移过渡）
ALTER TABLE todos ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES categories(id) ON DELETE SET NULL;

-- 插入默认分类数据
INSERT INTO categories (name, color, icon) VALUES
  ('工作', '#3B82F6', '💼'),
  ('学习', '#22C55E', '📚'),
  ('生活', '#F97316', '🏠'),
  ('默认', '#6B7280', '📋')
ON CONFLICT (name) DO NOTHING;

-- 将现有的 category 文本映射到 category_id
UPDATE todos t
SET category_id = c.id
FROM categories c
WHERE t.category = c.name
  AND t.category_id IS NULL;

-- 迁移完成后新的字段也有了旧数据，可以安全删除旧的 category 列
-- 但为了兼容性，先保留 category 列后续再删

-- 启用行级安全
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- 创建策略允许匿名完全访问
DROP POLICY IF EXISTS "允许匿名用户完全访问 categories" ON categories;
CREATE POLICY "允许匿名用户完全访问 categories" ON categories
  FOR ALL USING (true);
