/**
 * SUPABASE CLIENT CONFIGURATION
 * 
 * This file sets up a singleton Supabase client using the SSR package.
 * Uses @supabase/ssr for better session handling and cookie compatibility.
 * Updated for simplified 5-table architecture.
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
import { getSupabaseUrl, validateConfig, getBaseUrl } from './config'
import Logger from '@/app/utils/logger'

/**
 * Holds the singleton Supabase client instance.
 * Ensures only one client is created during the app lifecycle.
 */
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
      redirectTo: `${getBaseUrl()}/`, // Use configured base URL for consistency
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

// Type definitions for simplified schema
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];
export type Expense = Database['public']['Tables']['expense_submissions']['Row'];
export type Attachment = Database['public']['Tables']['attachments']['Row'];
export type Approval = Database['public']['Tables']['expense_approvals']['Row'];

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
 * Retrieves all expenses for a specific user, ordered by creation date.
 * Uses the simplified expenses table with JSON data.
 * @param userId - The ID of the user whose expenses to fetch
 * @param status - Optional status filter
 * @param type - Optional type filter
 * @returns Promise<Expense[]>
 */
export const getUserExpenses = async (
  userId: string,
  status?: 'draft' | 'submitted' | 'approved' | 'rejected',
  type?: 'travel' | 'maintenance' | 'requisition'
): Promise<Expense[]> => {
  Logger.db.debug('Fetching user expenses', { meta: { userId, status, type } });
  const supabase = getSupabaseClient();
  
  let query = supabase
    .from('expense_submissions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  if (type) {
    query = query.eq('type', type);
  }

  const { data, error } = await query;

  if (error) {
    Logger.db.error('Error fetching user expenses', { 
      message: error.message, 
      meta: { 
        code: error.code,
        userId 
      } 
    });
    return [];
  }

  Logger.db.debug('User expenses fetched', { meta: { userId, count: data?.length ?? 0 } });
  return (data ?? []) as Expense[];
};

/**
 * Creates a new expense in the simplified expenses table.
 * @param expense - The expense data to insert
 * @returns Promise<Expense | null>
 */
export const createExpense = async (expense: Database['public']['Tables']['expense_submissions']['Insert']) => {
  Logger.db.debug('Creating expense', { meta: expense })
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('expense_submissions')
    .insert(expense)
    .select()
    .single()

  if (error) {
    Logger.db.error('Error creating expense', { 
      message: error.message,
      meta: { code: error.code }
    })
    return null
  }

  Logger.db.debug('Expense created', { meta: { id: data?.id } })
  return data as Expense
}

/**
 * Updates an existing expense in the simplified expenses table.
 * @param id - The expense ID to update
 * @param updates - The updates to apply
 * @returns Promise<Expense | null>
 */
export const updateExpense = async (id: string, updates: Partial<Expense>) => {
  Logger.db.debug('Updating expense', { meta: { id, updates } })
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('expense_submissions')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    Logger.db.error('Error updating expense', { 
      message: error.message,
      meta: { code: error.code }
    })
    return null
  }

  Logger.db.debug('Expense updated', { meta: { id: data?.id } })
  return data as Expense
}

/**
 * Gets expenses pending approval for managers/admins.
 * @param approverId - The ID of the approver
 * @returns Promise<Expense[]>
 */
export const getExpensesForApproval = async (approverId: string): Promise<Expense[]> => {
  Logger.db.debug('Fetching expenses for approval', { meta: { approverId } });
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from('expense_submissions')
    .select(`
      *,
      profiles!expense_submissions_user_id_fkey (
        id,
        full_name,
        email,
        role,
        department
      )
    `)
    .eq('status', 'submitted')
    .order('created_at', { ascending: true });

  if (error) {
    Logger.db.error('Error fetching expenses for approval', { 
      message: error.message, 
      meta: { 
        code: error.code,
        approverId 
      } 
    });
    return [];
  }

  Logger.db.debug('Expenses for approval fetched', { meta: { approverId, count: data?.length ?? 0 } });
  return (data ?? []) as Expense[];
};

/**
 * Gets expense attachments for a specific expense.
 * @param expenseId - The expense ID
 * @returns Promise<Attachment[]>
 */
export const getExpenseAttachments = async (expenseId: string): Promise<Attachment[]> => {
  Logger.db.debug('Fetching expense attachments', { meta: { expenseId } });
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from('attachments')
    .select('*')
    .eq('expense_id', expenseId)
    .order('uploaded_at', { ascending: false });

  if (error) {
    Logger.db.error('Error fetching expense attachments', { 
      message: error.message, 
      meta: { 
        code: error.code,
        expenseId 
      } 
    });
    return [];
  }

  Logger.db.debug('Expense attachments fetched', { meta: { expenseId, count: data?.length ?? 0 } });
  return (data ?? []) as Attachment[];
};

/**
 * Gets approval history for a specific expense.
 * @param expenseId - The expense ID
 * @returns Promise<Approval[]>
 */
export const getExpenseApprovals = async (expenseId: string): Promise<Approval[]> => {
  Logger.db.debug('Fetching expense approvals', { meta: { expenseId } });
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from('expense_approvals')
    .select(`
      *,
      profiles!expense_approvals_approver_id_fkey (
        id,
        full_name,
        email,
        role
      )
    `)
    .eq('submission_id', expenseId)
    .order('created_at', { ascending: false });

  if (error) {
    Logger.db.error('Error fetching expense approvals', { 
      message: error.message, 
      meta: { 
        code: error.code,
        expenseId 
      } 
    });
    return [];
  }

  Logger.db.debug('Expense approvals fetched', { meta: { expenseId, count: data?.length ?? 0 } });
  return (data ?? []) as Approval[];
};

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