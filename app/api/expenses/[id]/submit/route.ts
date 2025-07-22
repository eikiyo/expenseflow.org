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

    // Get user profile to check approval permissions
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, single_transaction_limit')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'User profile not found or query failed' },
        { status: 404 }
      )
    }

    // Check if user can approve their own expense (admin/manager)
    const canSelfApprove = profile.role === 'admin' || profile.role === 'manager'
    const approvalLimit = profile.single_transaction_limit || 0

    // Submit the expense
    const { data: updatedExpense, error: submitError } = await supabase
      .from('expense_submissions')
      .update({
        status: 'submitted',
        // submitted_at and submitter_id are not valid columns in the new schema
      })
      .eq('id', expenseId)
      .select()
      .single()

    if (submitError) {
      console.error('Error submitting expense:', submitError)
      return NextResponse.json(
        { error: 'Failed to submit expense' },
        { status: 500 }
      )
    }

    // If the user can self-approve and the expense is within their limit,
    // create an approval record automatically.
    if (canSelfApprove && expense.total_amount <= approvalLimit) {
      const { error: approvalError } = await supabase
        .from('expense_approvals')
        .insert({
          submission_id: expenseId,
          approver_id: user.id,
          status: 'approved',
          comments: 'Self-approved by manager/admin during submission.'
        })

      if (approvalError) {
        console.error('Error creating self-approval:', approvalError)
        // Don't fail the request, but log the error
      } else {
        // Update the expense status to 'approved'
        await supabase
          .from('expense_submissions')
          .update({ status: 'approved' })
          .eq('id', expenseId)
      }
    }

    return NextResponse.json({
      message: 'Expense submitted successfully',
      expense: updatedExpense
    })
  } catch (error) {
    console.error('Error in POST /api/expenses/[id]/submit:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 