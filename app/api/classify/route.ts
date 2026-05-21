import { NextResponse } from 'next/server'

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY

export async function POST(request: Request) {
  const { title } = await request.json()

  if (!title || !title.trim()) {
    return NextResponse.json({ error: '标题不能为空' }, { status: 400 })
  }

  if (!DEEPSEEK_API_KEY) {
    return NextResponse.json({ error: '未配置 DeepSeek API Key' }, { status: 500 })
  }

  const prompt = `你是一个待办事项分类助手。请根据任务内容判断它最合适的分类。

可选的分类有：
- 工作：工作任务、会议、项目、汇报、代码、文档、客户
- 学习：看书、上课、考试、背单词、练习
- 生活：购物、吃饭、运动、家务、娱乐、出行
- 默认：其他不确定的分类

请只返回分类名称，不要包含其他文字。

任务内容: "${title.trim()}"`

  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: '你是一个分类助手，只返回分类名称，不要输出其他内容。' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 10,
        temperature: 0.1,
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error(`DeepSeek API 错误 (${response.status}):`, errText)
      return NextResponse.json({ category: '默认' })
    }

    const data = await response.json()
    const result = data.choices?.[0]?.message?.content?.trim() || '默认'
    const validCategories = ['工作', '学习', '生活', '默认']
    const category = validCategories.includes(result) ? result : '默认'

    return NextResponse.json({ category })
  } catch (err) {
    console.error('AI 分类请求失败:', err)
    return NextResponse.json({ category: '默认' })
  }
}
