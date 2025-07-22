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
import { getOAuthCallbackUrl, validateConfig } from './config'

let supabaseInstance: SupabaseClient<Database> | null = null;

// Validate configuration on module load
validateConfig();

// Singleton pattern to ensure only one client instance exists
export const getSupabaseClient = () => {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  try {
    supabaseInstance = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    console.log('✅ Supabase browser client created successfully');
    return supabaseInstance;
  } catch (error) {
    console.error('❌ Failed to create Supabase client:', error);
    throw error;
  }
};

// Reset the instance (useful for testing or when we need a fresh client)
export const resetSupabaseClient = () => {
  supabaseInstance = null;
};

// Helper function for Google OAuth sign in
export const signInWithGoogle = async () => {
  const supabase = getSupabaseClient();
  const redirectTo = getOAuthCallbackUrl();
  
  console.log('🔄 Initiating Google OAuth sign in...', {
    redirectTo,
    environment: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV
  });
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      skipBrowserRedirect: false,
      queryParams: {
        prompt: 'select_account' // Always show account selector
      }
    }
  });

  if (error) {
    console.error('❌ OAuth initiation failed:', error);
    throw error;
  }

  console.log('✅ OAuth initiated successfully:', {
    provider: 'google',
    url: data.url,
    redirectTo
  });

  return data;
};

// Type definitions
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

// Get user profile from database
export async function getUserProfile(userId: string): Promise<Profile | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}

// Create user profile in database
export async function createUserProfile(user: any): Promise<Profile | null> {
  const supabase = getSupabaseClient();
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
    .single();

  if (error) throw error;
  return data;
}

// Update user profile in database
export async function updateUserProfile(
  userId: string,
  updates: Partial<Profile>
): Promise<Profile | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export const signOut = async () => {
  const supabase = getSupabaseClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

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