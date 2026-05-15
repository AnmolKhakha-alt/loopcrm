import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type User = {
  id: string
  email: string
  full_name: string | null
  business_name: string | null
  phone: string | null
  created_at: string
}

export type Customer = {
  id: string
  user_id: string
  name: string
  phone: string
  product: string | null
  purchase_date: string | null
  notes: string | null
  last_contact: string | null
  next_followup: string | null
  status: 'active' | 'pending' | 'inactive'
  created_at: string
  updated_at: string
}

export type Reminder = {
  id: string
  user_id: string
  customer_id: string
  title: string
  due_date: string
  completed: boolean
  created_at: string
}

export type Activity = {
  id: string
  user_id: string
  customer_id: string | null
  type: 'call' | 'whatsapp' | 'note' | 'visit'
  description: string
  created_at: string
}

export type MessageTemplate = {
  id: string
  user_id: string
  name: string
  message: string
  category: string
  created_at: string
}