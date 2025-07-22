/**
 * SUPABASE CLIENT CONFIGURATION
 * 
 * This file sets up a singleton Supabase client using the SSR package.
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
import type { SupabaseClient } from '@supabase/supabase-js'
import { getSupabaseUrl, validateConfig } from './config'
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
      meta: {
        url: supabaseUrl,
        environment: process.env.NODE_ENV,
        vercelEnv: process.env.VERCEL_ENV
      }
    })

    supabaseInstance = createBrowserClient<Database>(
      supabaseUrl,
      supabaseAnonKey
    );

    Logger.info('Supabase client created successfully')
    return supabaseInstance;
  } catch (error) {
    Logger.error('Failed to create Supabase client', { meta: { error } })
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
  if (typeof window === 'undefined') {
    return { data: null, error: new Error('Cannot sign in during server-side rendering') }
  }

  const supabase = getSupabaseClient();
  
  Logger.auth.info('Initiating Google OAuth sign in', {
    meta: {
      environment: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV
    }
  });
  
  // Let Supabase handle the entire OAuth flow automatically
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/`, // Just redirect to home page
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    }
  });

  if (error) {
    Logger.auth.error('Google OAuth sign in failed', { meta: { error } })
    throw error;
  }
  if (!data.url) {
    Logger.auth.error('No OAuth URL returned')
    throw new Error('No OAuth URL returned');
  }

  Logger.auth.info('OAuth URL received, redirecting', { meta: { url: data.url } })
  // Redirect to the OAuth URL
  window.location.href = data.url;
};

// Type definitions
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];
export type Expense = Database['public']['Tables']['expenses']['Row'];

export interface ExpenseSubmission extends Expense {
  readonly id: string;
  user_id: string;
  created_at: string;
  type: 'travel' | 'maintenance' | 'requisition';
  // Base expense fields inherited from Expense type
}

export const signOut = async () => {
  Logger.auth.info('Signing out')
  const supabase = getSupabaseClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    Logger.auth.error('Sign out failed', { meta: { error } })
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
      meta: {
        userId: session.user.id,
        email: session.user.email
      }
    })
  } else {
    Logger.auth.debug('No current user found')
  }
  return session?.user || null
}

/**
 * Retrieves all expense submissions for a specific user, ordered by creation date.
 * Logs the operation and returns an array of submissions or an empty array on error.
 * @param userId - The ID of the user whose submissions to fetch
 * @returns Promise<ExpenseSubmission[]>
 */
export const getUserSubmissions = async (userId: string): Promise<ExpenseSubmission[]> => {
  Logger.db.debug('Fetching user submissions', { meta: { userId } });
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    Logger.db.error('Error fetching user submissions', { 
      message: error.message, 
      meta: { 
        code: error.code,
        userId 
      } 
    });
    return [];
  }

  Logger.db.debug('User submissions fetched', { meta: { userId, count: data?.length ?? 0 } });
  return (data ?? []) as ExpenseSubmission[];
};

export const createExpenseSubmission = async (submission: Partial<ExpenseSubmission>) => {
  Logger.db.debug('Creating expense submission', { meta: submission })
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('expenses')
    .insert(submission)
    .select()
    .single()

  if (error) {
    Logger.db.error('Error creating expense submission', { 
      message: error.message,
      meta: { code: error.code }
    })
    return null
  }

  Logger.db.debug('Expense submission created', { meta: { id: data?.id } })
  return data as ExpenseSubmission
}

export const updateExpenseSubmission = async (id: string, updates: Partial<ExpenseSubmission>) => {
  Logger.db.debug('Updating expense submission', { meta: { id, updates } })
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('expenses')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    Logger.db.error('Error updating expense submission', { 
      message: error.message,
      meta: { code: error.code }
    })
    return null
  }

  Logger.db.debug('Expense submission updated', { meta: { id: data?.id } })
  return data as ExpenseSubmission
}

// File upload helper
export const uploadFile = async (bucket: string, path: string, file: File) => {
  Logger.debug('Uploading file', { meta: { bucket, path, fileName: file.name } })
  const supabase = getSupabaseClient()
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file)

  if (error) {
    Logger.error('Error uploading file', { 
      message: error.message,
      meta: { name: error.name }
    })
    return null
  }

  Logger.debug('File uploaded successfully', { meta: { path: data?.path } })
  return data
}

export const getPublicUrl = (bucket: string, path: string) => {
  const supabase = getSupabaseClient()
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)

  return data.publicUrl
}