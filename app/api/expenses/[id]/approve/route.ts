/**
 * EXPENSE APPROVAL API ROUTE
 * 
 * This file handles expense approval/rejection using the simplified schema.
 * Uses the new 5-table architecture with JSON data for type-specific information.
 * 
 * Dependencies: @supabase/supabase-js, expense service
 * Used by: Expense approval components
 * 
 * @author ExpenseFlow Team
 * @since 2024-01-01
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/database.types'
import { approveExpense, getExpenseById } from '@/app/services/expense-service'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient<Database>(supabaseUrl, supabaseKey)

// POST /api/expenses/[id]/approve - Approve or reject expense
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

    // Get the expense to verify status
    const expense = await getExpenseById(expenseId)
    
    if (!expense) {
      return NextResponse.json(
        { error: 'Expense not found' },
        { status: 404 }
      )
    }

    // Verify expense is submitted for approval
    if (expense.status !== 'submitted') {
      return NextResponse.json(
        { error: 'Expense is not submitted for approval' },
        { status: 400 }
      )
    }

    // Get user profile to check approval permissions
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, approval_limit')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      )
    }

    // Check if user has approval permissions
    const canApprove = profile.role === 'admin' || profile.role === 'manager'
    if (!canApprove) {
      return NextResponse.json(
        { error: 'Insufficient permissions to approve expenses' },
        { status: 403 }
      )
    }

    // Check approval limit for managers
    if (profile.role === 'manager' && profile.approval_limit) {
      if (expense.total_amount > profile.approval_limit) {
        return NextResponse.json(
          { error: 'Expense amount exceeds your approval limit' },
          { status: 403 }
        )
      }
    }

    // Parse request body
    const body = await request.json()
    const { action, notes } = body

    // Validate action
    if (!action || !['approved', 'rejected'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be "approved" or "rejected"' },
        { status: 400 }
      )
    }

    // Approve or reject the expense
    const success = await approveExpense(expenseId, user.id, action, notes)

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to process approval' },
        { status: 500 }
      )
    }

    // Send notification to expense owner
    try {
      await supabase
        .from('notifications')
        .insert({
          user_id: expense.user_id,
          title: `Expense ${action}`,
          message: `Your expense "${expense.title}" has been ${action}${notes ? `: ${notes}` : ''}`,
          type: action === 'approved' ? 'success' : 'warning'
        })
    } catch (notificationError) {
      console.error('Failed to send notification:', notificationError)
      // Don't fail the request if notification fails
    }

    return NextResponse.json({ 
      message: `Expense ${action} successfully`,
      status: action
    })
  } catch (error) {
    console.error('Error in POST /api/expenses/[id]/approve:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 