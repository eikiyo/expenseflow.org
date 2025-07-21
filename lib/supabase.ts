import { createClient } from '@supabase/supabase-js'
import { supabaseConfig } from '../config'

if (!supabaseConfig.url || !supabaseConfig.anonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
}

const supabaseUrl = supabaseConfig.url
const supabaseAnonKey = supabaseConfig.anonKey

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Types for our database tables
export interface ExpenseUser {
  id: string
  email: string
  full_name: string
  employee_id: string
  role: 'employee' | 'manager' | 'finance' | 'admin'
  department?: string
  manager_id?: string
  phone?: string
  address?: string
  monthly_budget: number
  single_transaction_limit: number
  profile_picture_url?: string
  is_active: boolean
}

// Hardcoded test user
const TEST_USER: ExpenseUser = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  email: 'test@example.com',
  full_name: 'Test User',
  employee_id: 'EMP-2024-001',
  role: 'manager',
  department: 'Engineering',
  monthly_budget: 50000,
  single_transaction_limit: 10000,
  is_active: true
}

// Auth helper functions
export const signInWithEmail = async (email: string, password: string) => {
  // For testing: accept any email with password "123"
  if (password === '123') {
    // Create a fake session
    const fakeSession = {
      user: {
        id: TEST_USER.id,
        email: email || TEST_USER.email,
        user_metadata: {
          full_name: TEST_USER.full_name
        }
      },
      access_token: 'fake_token'
    }

    // Store the fake session
    await supabase.auth.setSession(fakeSession as any)
    return { data: fakeSession, error: null }
  }

  // For non-test cases, use actual Supabase auth
  return supabase.auth.signInWithPassword({ email, password })
}

export const signOut = async () => {
  return supabase.auth.signOut()
}

export const getCurrentUser = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.user
}

// Database helper functions
export const getUserProfile = async (userId: string): Promise<ExpenseUser | null> => {
  // For testing: return hardcoded user
  if (userId === TEST_USER.id) {
    return TEST_USER
  }

  const { data, error } = await supabase
    .from('expense_users')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching user profile:', error)
    return null
  }

  return data
}

export const getUserSubmissions = async (userId: string) => {
  const { data, error } = await supabase
    .from('expense_submissions')
    .select(`
      *,
      travel_expenses(*),
      maintenance_expenses(*),
      requisition_expenses(*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching user submissions:', error)
    return []
  }

  return data
}

export const createExpenseSubmission = async (submission: any) => {
  const { data, error } = await supabase
    .from('expense_submissions')
    .insert(submission)
    .select()
    .single()

  if (error) {
    console.error('Error creating expense submission:', error)
    return null
  }

  return data
}

export const updateExpenseSubmission = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from('expense_submissions')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating expense submission:', error)
    return null
  }

  return data
}

// File upload helper
export const uploadFile = async (bucket: string, path: string, file: File) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file)

  if (error) {
    console.error('Error uploading file:', error)
    return null
  }

  return data
}

export const getPublicUrl = (bucket: string, path: string) => {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)

  return data.publicUrl
} 