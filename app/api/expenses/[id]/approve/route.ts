/**
 * EXPENSE APPROVAL API ROUTE
 * 
 * This file handles expense approval operations.
 * Provides endpoints for approving or rejecting expenses.
 * 
 * Dependencies: Next.js, Supabase
 * Used by: Approval components and services
 * 
 * @author ExpenseFlow Team
 * @since 2024-01-01
 */

import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import type { Database } from '@/lib/database.types'

// POST /api/expenses/[id]/approve - Approve or reject an expense
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

    // Get the approval data from the request
    const { action, comment } = await request.json()
    if (!action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      )
    }

    // Get the expense and check if the user is authorized to approve it
    const { data: expense, error: fetchError } = await supabase
      .from('expenses')
      .select(`
        *,
        profiles!expenses_approver_id_fkey (
          role,
          manager_id
        )
      `)
      .eq('id', params.id)
      .single()

    if (fetchError || !expense) {
      return NextResponse.json(
        { error: 'Expense not found' },
        { status: 404 }
      )
    }

    // Check if the user is authorized to approve this expense
    const { data: approver } = await supabase
      .from('profiles')
      .select('role, expense_limit')
      .eq('id', user.id)
      .single()

    if (!approver) {
      return NextResponse.json(
        { error: 'Approver profile not found' },
        { status: 404 }
      )
    }

    // Check if the user has sufficient approval authority
    if (
      approver.role !== 'admin' &&
      expense.totalAmount > (approver.expense_limit || 0)
    ) {
      return NextResponse.json(
        { error: 'Insufficient approval authority' },
        { status: 403 }
      )
    }

    // Update the expense status
    const status = action === 'approve' ? 'approved' : 'rejected'
    const { data, error } = await supabase
      .from('expenses')
      .update({
        status,
        updated_at: new Date().toISOString(),
        approver_id: user.id,
        comments: [
          ...(expense.comments || []),
          {
            userId: user.id,
            content: comment || `Expense ${status}`,
            createdAt: new Date().toISOString()
          }
        ]
      })
      .eq('id', params.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error processing expense approval:', error)
    return NextResponse.json(
      { error: 'Failed to process approval' },
      { status: 500 }
    )
  }
} 