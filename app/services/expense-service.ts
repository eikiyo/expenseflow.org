/**
 * EXPENSE DATA SERVICE
 * 
 * This file handles all expense data operations with the Supabase backend.
 * Provides functions for CRUD operations on expenses.
 * 
 * Dependencies: @supabase/supabase-js
 * Used by: Expense components and providers
 * 
 * @author ExpenseFlow Team
 * @since 2024-01-01
 */

import { getSupabaseClient } from '@/lib/supabase'
import type { 
  TravelExpense, 
  MaintenanceExpense, 
  RequisitionExpense,
  ExpenseFormData
} from '../types/expense'

type Expense = TravelExpense | MaintenanceExpense | RequisitionExpense

// Interface for expense status updates
interface ExpenseStatusUpdate {
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected'
  updated_at: string
  comments?: Array<{
    content: string
    createdAt: string
  }>
}

// Saves or updates an expense in the database
export async function saveExpense(expense: Expense): Promise<Expense> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('expenses')
    .upsert({
      ...expense,
      updated_at: new Date().toISOString()
    })
    .select()
    .single()

  if (error) throw error
  return data
}

// Retrieves an expense by ID
export async function getExpenseById(id: string): Promise<Expense | null> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

// Gets all expenses for a user
export async function getUserExpenses(userId: string): Promise<Expense[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('userId', userId)
    .order('updated_at', { ascending: false })

  if (error) throw error
  return data || []
}

// Gets all expenses pending approval
export async function getPendingApprovals(approverId: string): Promise<Expense[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('status', 'submitted')
    .eq('approver_id', approverId)
    .order('submitted_at', { ascending: true })

  if (error) throw error
  return data || []
}

// Submits an expense for approval
export async function submitExpense(id: string): Promise<Expense> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('expenses')
    .update({
      status: 'submitted',
      submitted_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

// Updates expense status (approve/reject)
export async function updateExpenseStatus(
  id: string, 
  status: 'approved' | 'rejected',
  comment?: string
): Promise<Expense> {
  const supabase = getSupabaseClient();
  const updates: ExpenseStatusUpdate = {
    status,
    updated_at: new Date().toISOString()
  }

  if (comment) {
    const { data: currentExpense } = await supabase
      .from('expenses')
      .select('comments')
      .eq('id', id)
      .single()

    updates.comments = [...(currentExpense?.comments || []), {
      content: comment,
      createdAt: new Date().toISOString()
    }]
  }

  const { data, error } = await supabase
    .from('expenses')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

// Deletes a draft expense
export async function deleteDraftExpense(id: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', id)
    .eq('status', 'draft')

  if (error) throw error
  return true
} 