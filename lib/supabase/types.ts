export type Todo = {
  id: string
  title: string
  completed: boolean
  category: string
  category_id: string | null
  created_at: string
  updated_at: string
}

export type Category = {
  id: string
  name: string
  color: string
  icon: string
  created_at: string
}
