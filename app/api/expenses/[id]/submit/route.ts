/**
 * EXPENSE SUBMIT API ROUTE
 * 
 * This file handles expense submission for approval using the simplified schema.
 * Uses the new 5-table architecture with JSON data for type-specific information.
 * 
 * Dependencies: @supabase/supabase-js, expense service
 * Used by: Expense submission components
 * 
 * @author ExpenseFlow Team
 * @since 2024-01-01
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/database.types'
import { submitExpense, getExpenseById } from '@/app/services/expense-service'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient<Database>(supabaseUrl, supabaseKey)

// POST /api/expenses/[id]/submit - Submit expense for approval
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get user from auth
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const expenseId = params.id

    // Get the expense to verify ownership and status
    const expense = await getExpenseById(expenseId)
    
    if (!expense) {
      return NextResponse.json(
        { error: 'Expense not found' },
        { status: 404 }
      )
    }

    // Verify ownership
    if (expense.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Verify expense is in draft status
    if (expense.status !== 'draft') {
      return NextResponse.json(
        { error: 'Only draft expenses can be submitted' },
        { status: 400 }
      )
    }

    // Get user profile to check approval limits
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('approval_limit, role')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      )
    }

    // Check if user can approve their own expense (admin/manager)
    const canSelfApprove = profile.role === 'admin' || profile.role === 'manager'
    const approvalLimit = profile.approval_limit || 0

    // Submit the expense
    const success = await submitExpense(expenseId, user.id)

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to submit expense' },
        { status: 500 }
      )
    }

    // If user can self-approve and amount is within limit, auto-approve
    if (canSelfApprove && expense.total_amount <= approvalLimit) {
      const { data: { user: approver } } = await supabase.auth.getUser()
      
      if (approver) {
        const { error: approveError } = await supabase
          .from('expenses')
          .update({
            status: 'approved',
            approved_at: new Date().toISOString(),
            approver_id: approver.id,
            approval_notes: 'Auto-approved within approval limit'
          })
          .eq('id', expenseId)

        if (!approveError) {
          // Create approval record
          await supabase
            .from('approvals')
            .insert({
              expense_id: expenseId,
              approver_id: approver.id,
              action: 'approved',
              notes: 'Auto-approved within approval limit'
            })

          return NextResponse.json({ 
            message: 'Expense submitted and auto-approved',
            status: 'approved'
          })
        }
      }
    }

    return NextResponse.json({ 
      message: 'Expense submitted for approval',
      status: 'submitted'
    })
  } catch (error) {
    console.error('Error in POST /api/expenses/[id]/submit:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 