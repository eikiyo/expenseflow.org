/**
 * EXPENSE SERVICE
 * 
 * This file handles all expense-related database operations using the simplified schema.
 * Uses the new 5-table architecture with JSON data for type-specific information.
 * 
 * Dependencies: @supabase/supabase-js, expense types
 * Used by: All expense components and API routes
 * 
 * @author ExpenseFlow Team
 * @since 2024-01-01
 */

import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/database.types'
import type { 
  ExpenseRecord, 
  AttachmentRecord, 
  ApprovalRecord,
  ExpenseFormData
} from '@/app/types/expense'
import { convertExpenseFormToRecord, convertExpenseRecordToForm } from '@/app/types/expense'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient<Database>(supabaseUrl, supabaseKey)

// Save expense to database
export async function saveExpense(
  formData: ExpenseFormData,
  userId: string
): Promise<ExpenseRecord | null> {
  try {
    const expenseRecord = convertExpenseFormToRecord(formData, userId)
    
    const { data, error } = await supabase
      .from('expenses')
      .insert({
        ...expenseRecord,
        expense_data: expenseRecord.expense_data as any
      })
      .select()
      .single()

    if (error) {
      console.error('Error saving expense:', error)
      return null
    }

    return data as unknown as ExpenseRecord
  } catch (error) {
    console.error('Error in saveExpense:', error)
    return null
  }
}

// Get expense by ID
export async function getExpenseById(id: string): Promise<ExpenseRecord | null> {
  try {
    const { data, error } = await supabase
      .from('expenses')
      .select(`
        *,
        profiles!expenses_user_id_fkey (
          id,
          full_name,
          email,
          role
        ),
        profiles!expenses_approver_id_fkey (
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

    return data as unknown as ExpenseRecord
  } catch (error) {
    console.error('Error in getExpenseById:', error)
    return null
  }
}

// Get user expenses
export async function getUserExpenses(
  userId: string,
  status?: 'draft' | 'submitted' | 'approved' | 'rejected',
  type?: 'travel' | 'maintenance' | 'requisition'
): Promise<ExpenseRecord[]> {
  try {
    let query = supabase
      .from('expenses')
      .select(`
        *,
        profiles!expenses_user_id_fkey (
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
      query = query.eq('type', type)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching user expenses:', error)
      return []
    }

    return data as unknown as ExpenseRecord[]
  } catch (error) {
    console.error('Error in getUserExpenses:', error)
    return []
  }
}

// Get expenses for approval (for managers/admins)
export async function getExpensesForApproval(
  approverId: string
): Promise<ExpenseRecord[]> {
  try {
    const { data, error } = await supabase
      .from('expenses')
      .select(`
        *,
        profiles!expenses_user_id_fkey (
          id,
          full_name,
          email,
          role,
          department
        )
      `)
      .eq('status', 'submitted')
      .order('submitted_at', { ascending: true })

    if (error) {
      console.error('Error fetching expenses for approval:', error)
      return []
    }

    return data as unknown as ExpenseRecord[]
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
      .from('expenses')
      .update({
        status: 'submitted',
        submitted_at: new Date().toISOString()
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
  notes?: string
): Promise<boolean> {
  try {
    // Start a transaction
    const { error: expenseError } = await supabase
      .from('expenses')
      .update({
        status: action,
        approved_at: new Date().toISOString(),
        approver_id: approverId,
        approval_notes: notes
      })
      .eq('id', expenseId)

    if (expenseError) {
      console.error('Error updating expense status:', expenseError)
      return false
    }

    // Create approval record
    const { error: approvalError } = await supabase
      .from('approvals')
      .insert({
        expense_id: expenseId,
        approver_id: approverId,
        action,
        notes
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
): Promise<AttachmentRecord | null> {
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

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('expense-attachments')
      .getPublicUrl(fileName)

    // Create attachment record
    const { data, error } = await supabase
      .from('attachments')
      .insert({
        expense_id: expenseId,
        filename: file.name,
        file_path: fileName,
        file_size: file.size,
        content_type: file.type
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
): Promise<AttachmentRecord[]> {
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
): Promise<ApprovalRecord[]> {
  try {
    const { data, error } = await supabase
      .from('approvals')
      .select(`
        *,
        profiles!approvals_approver_id_fkey (
          id,
          full_name,
          email,
          role
        )
      `)
      .eq('expense_id', expenseId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching approvals:', error)
      return []
    }

    return data as ApprovalRecord[]
  } catch (error) {
    console.error('Error in getExpenseApprovals:', error)
    return []
  }
}

// Update expense
export async function updateExpense(
  expenseId: string,
  updates: Partial<ExpenseRecord>
): Promise<ExpenseRecord | null> {
  try {
    const { data, error } = await supabase
      .from('expenses')
      .update({
        ...updates,
        expense_data: updates.expense_data as any
      })
      .eq('id', expenseId)
      .select()
      .single()

    if (error) {
      console.error('Error updating expense:', error)
      return null
    }

    return data as unknown as ExpenseRecord
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
      .from('expenses')
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
      .from('expenses')
      .select('status, total_amount, type')
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
        acc[exp.type] = (acc[exp.type] || 0) + exp.total_amount
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