/**
 * SUPABASE CLIENT CONFIGURATION
 * 
 * This file sets up unified Supabase clients using the SSR package.
 * Uses @supabase/ssr for better session handling and cookie compatibility.
 * 
 * Dependencies: @supabase/ssr
 * Used by: All components and services requiring database access
 * 
 * @author ExpenseFlow Team
 * @since 2024-01-01
 */

import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './database.types'

// Client-side Supabase client with error checking
export const getSupabaseClient = () => {
  try {
    const client = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    console.log('✅ Supabase browser client created successfully');
    return client;
  } catch (error) {
    console.error('❌ Failed to create Supabase client:', error);
    throw error;
  }
}

export interface ExpenseUser {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  department?: string
  role: 'user' | 'manager' | 'admin'
  manager_id?: string
  expense_limit?: number
}

// Get user profile from database
export async function getUserProfile(userId: string): Promise<ExpenseUser | null> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data
}

// Create user profile in database
export async function createUserProfile(user: any): Promise<ExpenseUser | null> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('profiles')
    .insert({
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name || user.email,
      avatar_url: user.user_metadata?.avatar_url,
      role: 'user'
    })
    .select()
    .single()

  if (error) throw error
  return data
}

// Update user profile in database
export async function updateUserProfile(
  userId: string,
  updates: Partial<ExpenseUser>
): Promise<ExpenseUser | null> {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}

// Clean Auth Functions - Google Only
export const signInWithGoogle = async () => {
  // Only access window in client-side
  if (typeof window === 'undefined') {
    return { data: null, error: new Error('Cannot sign in during server-side rendering') }
  }

  // Determine the correct redirect URL based on environment
  const currentOrigin = window.location.origin;
  const redirectUrl = `${currentOrigin}/auth/callback`;
  
  console.log('🔗 OAuth redirect URL:', redirectUrl);

  const supabase = getSupabaseClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    }
  })
  
  return { data, error }
}

export const signOut = async () => {
  const supabase = getSupabaseClient()
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  const supabase = getSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session?.user || null
}

// Database Functions
export const getUserSubmissions = async (userId: string) => {
  const supabase = getSupabaseClient()
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
  const supabase = getSupabaseClient()
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
  const supabase = getSupabaseClient()
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
  const supabase = getSupabaseClient()
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
  const supabase = getSupabaseClient()
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)

  return data.publicUrl
}