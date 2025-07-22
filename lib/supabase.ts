/**
 * SUPABASE CLIENT CONFIGURATION
 * 
 * This file sets up a singleton Supabase client using the SSR package.
 * Uses @supabase/ssr for better session handling and cookie compatibility.
 * 
 * Dependencies: @supabase/ssr, @/lib/config
 * Used by: All components and services requiring database access
 * 
 * @author ExpenseFlow Team
 * @since 2024-01-01
 */

import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './database.types'
import type { SupabaseClient } from '@supabase/supabase-js'
import { getOAuthCallbackUrl, getSupabaseUrl, validateConfig } from './config'
import Logger from '@/app/utils/logger'

let supabaseInstance: SupabaseClient<Database> | null = null;

// Validate configuration on module load
validateConfig();

// Singleton pattern to ensure only one client instance exists
export const getSupabaseClient = () => {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  try {
    const supabaseUrl = getSupabaseUrl()
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase configuration. Please check your environment variables.')
    }

    Logger.debug('Creating Supabase client', {
      url: supabaseUrl,
      environment: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV
    })

    supabaseInstance = createBrowserClient<Database>(
      supabaseUrl,
      supabaseAnonKey
    );

    Logger.info('Supabase client created successfully')
    return supabaseInstance;
  } catch (error) {
    Logger.error('Failed to create Supabase client', { error })
    throw error;
  }
};

// Reset the instance (useful for testing or when we need a fresh client)
export const resetSupabaseClient = () => {
  Logger.debug('Resetting Supabase client instance')
  supabaseInstance = null;
};

// Helper function for Google OAuth sign in
export const signInWithGoogle = async () => {
  const supabase = getSupabaseClient();
  const redirectTo = getOAuthCallbackUrl();
  
  Logger.auth.info('Initiating Google OAuth sign in', {
    redirectTo,
    environment: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV
  });
  
  // Let Supabase handle the entire OAuth flow
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      queryParams: {
        access_type: 'offline',
        prompt: 'select_account'
      }
    }
  });

  if (error) {
    Logger.auth.error('Google OAuth sign in failed', { error })
    throw error;
  }
  if (!data.url) {
    Logger.auth.error('No OAuth URL returned')
    throw new Error('No OAuth URL returned');
  }

  Logger.auth.info('OAuth URL received, redirecting', { url: data.url })
  // Redirect to the OAuth URL
  window.location.href = data.url;
};

// Type definitions
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export const signOut = async () => {
  Logger.auth.info('Signing out')
  const supabase = getSupabaseClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    Logger.auth.error('Sign out failed', { error })
    throw error;
  }
  Logger.auth.info('Signed out successfully')
};

export const getCurrentUser = async () => {
  Logger.auth.debug('Getting current user')
  const supabase = getSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (session?.user) {
    Logger.auth.debug('Current user found', {
      userId: session.user.id,
      email: session.user.email
    })
  } else {
    Logger.auth.debug('No current user found')
  }
  return session?.user || null
}

// Database Functions
export const getUserSubmissions = async (userId: string) => {
  Logger.debug('Fetching user submissions', { userId })
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
    Logger.error('Error fetching user submissions', { error })
    return []
  }

  Logger.debug('User submissions fetched', { count: data?.length })
  return data
}

export const createExpenseSubmission = async (submission: any) => {
  Logger.debug('Creating expense submission', submission)
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('expense_submissions')
    .insert(submission)
    .select()
    .single()

  if (error) {
    Logger.error('Error creating expense submission', { error })
    return null
  }

  Logger.debug('Expense submission created', { id: data?.id })
  return data
}

export const updateExpenseSubmission = async (id: string, updates: any) => {
  Logger.debug('Updating expense submission', { id, updates })
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('expense_submissions')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    Logger.error('Error updating expense submission', { error })
    return null
  }

  Logger.debug('Expense submission updated', { id: data?.id })
  return data
}

// File upload helper
export const uploadFile = async (bucket: string, path: string, file: File) => {
  Logger.debug('Uploading file', { bucket, path, fileName: file.name })
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file)

  if (error) {
    Logger.error('Error uploading file', { error })
    return null
  }

  Logger.debug('File uploaded successfully', { path: data?.path })
  return data
}

export const getPublicUrl = (bucket: string, path: string) => {
  const supabase = getSupabaseClient()
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)

  return data.publicUrl
}