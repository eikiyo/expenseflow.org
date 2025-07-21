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
  created_at?: string
  updated_at?: string
}

// Clean Auth Functions - Google Only
export const signInWithGoogle = async () => {
  // Only access window in client-side
  if (typeof window === 'undefined') {
    return { data: null, error: new Error('Cannot sign in during server-side rendering') }
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    }
  })
  
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.user || null
}

// Database Functions
export const getUserProfile = async (userId: string): Promise<ExpenseUser | null> => {
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

export const createUserProfile = async (user: any): Promise<ExpenseUser | null> => {
  // Create user profile from Google OAuth data
  const userProfile = {
    id: user.id,
    email: user.email,
    full_name: user.user_metadata?.full_name || user.user_metadata?.name || 'Unknown User',
    employee_id: `EMP-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
    role: 'employee' as const,
    monthly_budget: 5000,
    single_transaction_limit: 1000,
    profile_picture_url: user.user_metadata?.avatar_url,
    is_active: true
  }

  const { data, error } = await supabase
    .from('expense_users')
    .insert(userProfile)
    .select()
    .single()

  if (error) {
    console.error('Error creating user profile:', error)
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