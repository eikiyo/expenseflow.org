/**
 * EXPENSE SUBMISSION API ROUTE
 * 
 * This file handles expense submission for approval.
 * Validates expense data and routes to appropriate approvers.
 * 
 * Dependencies: Next.js, Supabase
 * Used by: Expense submission components
 * 
 * @author ExpenseFlow Team
 * @since 2024-01-01
 */

import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { validateExpense } from '@/app/utils/validation'
import type { Database } from '@/lib/database.types'

// POST /api/expenses/[id]/submit - Submit an expense for approval
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies })
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get the expense
    const { data: expense, error: fetchError } = await supabase
      .from('expenses')
      .select('*, profiles!expenses_userId_fkey (manager_id)')
      .eq('id', params.id)
      .eq('userId', user.id)
      .single()

    if (fetchError || !expense) {
      return NextResponse.json(
        { error: 'Expense not found' },
        { status: 404 }
      )
    }

    if (expense.status !== 'draft') {
      return NextResponse.json(
        { error: 'Only draft expenses can be submitted' },
        { status: 400 }
      )
    }

    // Validate the expense data
    const validationResult = validateExpense(expense)
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Invalid expense data',
          details: validationResult.error
        },
        { status: 400 }
      )
    }

    // Get the appropriate approver based on amount and user's manager
    const { data: managers } = await supabase
      .from('profiles')
      .select('id, role, expense_limit')
      .eq('role', 'manager')
      .order('expense_limit', { ascending: false })

    if (!managers) {
      return NextResponse.json(
        { error: 'No approvers found' },
        { status: 500 }
      )
    }

    // Find the appropriate approver based on expense amount
    const approver = managers.find(m => 
      m.expense_limit && m.expense_limit >= expense.totalAmount
    )

    // If no manager has sufficient limit, route to admin
    const { data: admin } = await supabase
      .from('profiles')
      .select('id')
      .eq('role', 'admin')
      .single()

    const approverId = approver?.id || admin?.id

    if (!approverId) {
      return NextResponse.json(
        { error: 'No eligible approver found' },
        { status: 500 }
      )
    }

    // Update the expense status and set the approver
    const { data, error } = await supabase
      .from('expenses')
      .update({
        status: 'submitted',
        approver_id: approverId,
        submitted_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error submitting expense:', error)
    return NextResponse.json(
      { error: 'Failed to submit expense' },
      { status: 500 }
    )
  }
} 