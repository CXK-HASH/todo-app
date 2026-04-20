-- 创建 todos 表
CREATE TABLE IF NOT EXISTS todos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 创建 updated_at 自动更新的触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_todos_updated_at BEFORE UPDATE ON todos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 启用行级安全
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- 创建允许匿名访问的策略（用于演示）
CREATE POLICY "允许匿名用户完全访问 todos" ON todos
  FOR ALL USING (true);

-- 添加一些示例数据（可选）
INSERT INTO todos (title, completed) VALUES
  ('学习 Next.js', true),
  ('配置 Supabase', false),
  ('部署到 Vercel', false)
ON CONFLICT DO NOTHING;