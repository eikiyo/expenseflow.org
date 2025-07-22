/**
 * EXPENSE SERVICE
 * 
 * This file handles all expense-related database operations using the new unified schema.
 * Uses the expense_submissions, expense_approvals, and attachments tables.
 * 
 * Dependencies: @supabase/supabase-js, database types
 * Used by: All expense components and API routes
 * 
 * @author ExpenseFlow Team
 * @since 2024-01-01
 */

import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient<Database>(supabaseUrl, supabaseKey)

// Types based on the actual database schema
export type ExpenseSubmission = Database['public']['Tables']['expense_submissions']['Row']
export type ExpenseSubmissionInsert = Database['public']['Tables']['expense_submissions']['Insert']
export type ExpenseSubmissionUpdate = Database['public']['Tables']['expense_submissions']['Update']

export type ExpenseApproval = Database['public']['Tables']['expense_approvals']['Row']
export type ExpenseApprovalInsert = Database['public']['Tables']['expense_approvals']['Insert']

export type Attachment = Database['public']['Tables']['attachments']['Row']
export type AttachmentInsert = Database['public']['Tables']['attachments']['Insert']

// Save expense to database
export async function saveExpense(
  expenseData: ExpenseSubmissionInsert
): Promise<ExpenseSubmission | null> {
  try {
    const { data, error } = await supabase
      .from('expense_submissions')
      .insert(expenseData)
      .select()
      .single()

    if (error) {
      console.error('Error saving expense:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error in saveExpense:', error)
    return null
  }
}

// Get expense by ID
export async function getExpenseById(id: string): Promise<ExpenseSubmission | null> {
  try {
    const { data, error } = await supabase
      .from('expense_submissions')
      .select(`
        *,
        profiles!expense_submissions_user_id_fkey (
          id,
          full_name,
          email,
          role
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching expense:', error)
      return null
    }

    return data as ExpenseSubmission & { profiles: any }
  } catch (error) {
    console.error('Error in getExpenseById:', error)
    return null
  }
}

// Get user expenses
export async function getUserExpenses(
  userId: string,
  status?: string,
  type?: string
): Promise<ExpenseSubmission[]> {
  try {
    let query = supabase
      .from('expense_submissions')
      .select(`
        *,
        profiles!expense_submissions_user_id_fkey (
          id,
          full_name,
          email,
          role
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    if (type) {
      query = query.eq('expense_type', type)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching user expenses:', error)
      return []
    }

    return data as ExpenseSubmission[]
  } catch (error) {
    console.error('Error in getUserExpenses:', error)
    return []
  }
}

// Get expenses for approval (for managers/admins)
export async function getExpensesForApproval(): Promise<ExpenseSubmission[]> {
  try {
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
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error fetching expenses for approval:', error)
      return []
    }

    return data as ExpenseSubmission[]
  } catch (error) {
    console.error('Error in getExpensesForApproval:', error)
    return []
  }
}

// Submit expense for approval
export async function submitExpense(
  expenseId: string,
  userId: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('expense_submissions')
      .update({
        status: 'submitted'
      })
      .eq('id', expenseId)
      .eq('user_id', userId)

    if (error) {
      console.error('Error submitting expense:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error in submitExpense:', error)
    return false
  }
}

// Approve or reject expense
export async function approveExpense(
  expenseId: string,
  approverId: string,
  action: 'approved' | 'rejected',
  comments?: string
): Promise<boolean> {
  try {
    // Update expense status
    const { error: expenseError } = await supabase
      .from('expense_submissions')
      .update({
        status: action
      })
      .eq('id', expenseId)

    if (expenseError) {
      console.error('Error updating expense status:', expenseError)
      return false
    }

    // Create approval record
    const { error: approvalError } = await supabase
      .from('expense_approvals')
      .insert({
        submission_id: expenseId,
        approver_id: approverId,
        status: action,
        comments
      })

    if (approvalError) {
      console.error('Error creating approval record:', approvalError)
      return false
    }

    return true
  } catch (error) {
    console.error('Error in approveExpense:', error)
    return false
  }
}

// Upload attachment
export async function uploadAttachment(
  expenseId: string,
  file: File
): Promise<Attachment | null> {
  try {
    // Upload file to storage
    const fileName = `${expenseId}/${Date.now()}-${file.name}`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('expense-attachments')
      .upload(fileName, file)

    if (uploadError) {
      console.error('Error uploading file:', uploadError)
      return null
    }

    // Create attachment record
    const { data, error } = await supabase
      .from('attachments')
      .insert({
        expense_id: expenseId,
        file_name: file.name,
        file_path: fileName,
        file_size: file.size,
        file_type: file.type
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating attachment record:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error in uploadAttachment:', error)
    return null
  }
}

// Get expense attachments
export async function getExpenseAttachments(
  expenseId: string
): Promise<Attachment[]> {
  try {
    const { data, error } = await supabase
      .from('attachments')
      .select('*')
      .eq('expense_id', expenseId)
      .order('uploaded_at', { ascending: false })

    if (error) {
      console.error('Error fetching attachments:', error)
      return []
    }

    return data
  } catch (error) {
    console.error('Error in getExpenseAttachments:', error)
    return []
  }
}

// Delete attachment
export async function deleteAttachment(
  attachmentId: string,
  expenseId: string
): Promise<boolean> {
  try {
    // Get attachment details
    const { data: attachment, error: fetchError } = await supabase
      .from('attachments')
      .select('*')
      .eq('id', attachmentId)
      .eq('expense_id', expenseId)
      .single()

    if (fetchError || !attachment) {
      console.error('Error fetching attachment:', fetchError)
      return false
    }

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('expense-attachments')
      .remove([attachment.file_path])

    if (storageError) {
      console.error('Error deleting from storage:', storageError)
      return false
    }

    // Delete record
    const { error: deleteError } = await supabase
      .from('attachments')
      .delete()
      .eq('id', attachmentId)

    if (deleteError) {
      console.error('Error deleting attachment record:', deleteError)
      return false
    }

    return true
  } catch (error) {
    console.error('Error in deleteAttachment:', error)
    return false
  }
}

// Get expense approvals
export async function getExpenseApprovals(
  expenseId: string
): Promise<ExpenseApproval[]> {
  try {
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
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching approvals:', error)
      return []
    }

    return data as ExpenseApproval[]
  } catch (error) {
    console.error('Error in getExpenseApprovals:', error)
    return []
  }
}

// Update expense
export async function updateExpense(
  expenseId: string,
  updates: ExpenseSubmissionUpdate
): Promise<ExpenseSubmission | null> {
  try {
    const { data, error } = await supabase
      .from('expense_submissions')
      .update(updates)
      .eq('id', expenseId)
      .select()
      .single()

    if (error) {
      console.error('Error updating expense:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error in updateExpense:', error)
    return null
  }
}

// Delete expense (only if draft)
export async function deleteExpense(
  expenseId: string,
  userId: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('expense_submissions')
      .delete()
      .eq('id', expenseId)
      .eq('user_id', userId)
      .eq('status', 'draft')

    if (error) {
      console.error('Error deleting expense:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error in deleteExpense:', error)
    return false
  }
}

// Get expense statistics
export async function getExpenseStats(userId: string) {
  try {
    const { data, error } = await supabase
      .from('expense_submissions')
      .select('status, total_amount, expense_type')
      .eq('user_id', userId)

    if (error) {
      console.error('Error fetching expense stats:', error)
      return null
    }

    const stats = {
      total: data.reduce((sum, exp) => sum + exp.total_amount, 0),
      byStatus: data.reduce((acc, exp) => {
        acc[exp.status] = (acc[exp.status] || 0) + exp.total_amount
        return acc
      }, {} as Record<string, number>),
      byType: data.reduce((acc, exp) => {
        acc[exp.expense_type] = (acc[exp.expense_type] || 0) + exp.total_amount
        return acc
      }, {} as Record<string, number>),
      count: data.length
    }

    return stats
  } catch (error) {
    console.error('Error in getExpenseStats:', error)
    return null
  }
} 