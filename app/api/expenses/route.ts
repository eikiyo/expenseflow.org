/**
 * EXPENSES API ROUTE
 * 
 * This file handles all expense-related API endpoints using the simplified schema.
 * Uses the new 5-table architecture with JSON data for type-specific information.
 * 
 * Dependencies: @supabase/supabase-js, expense service
 * Used by: All expense components and forms
 * 
 * @author ExpenseFlow Team
 * @since 2024-01-01
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/database.types'
import { saveExpense, getUserExpenses, getExpenseById } from '@/app/services/expense-service'
import type { ExpenseFormData } from '@/app/types/expense'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient<Database>(supabaseUrl, supabaseKey)

// GET /api/expenses - Get user expenses
export async function GET(request: NextRequest) {
  try {
    // Get user from auth
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') as 'draft' | 'submitted' | 'approved' | 'rejected' | null
    const type = searchParams.get('type') as 'travel' | 'maintenance' | 'requisition' | null

    // Get user expenses
    const expenses = await getUserExpenses(user.id, status || undefined, type || undefined)

    return NextResponse.json({ expenses })
  } catch (error) {
    console.error('Error in GET /api/expenses:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/expenses - Create new expense
export async function POST(request: NextRequest) {
  try {
    // Get user from auth
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json()
    const formData: ExpenseFormData = body.expense

    // Validate required fields
    if (!formData || !formData.type || !formData.description || !formData.totalAmount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate business purpose
    if (!formData.businessPurpose || formData.businessPurpose.length < 200) {
      return NextResponse.json(
        { error: 'Business purpose must be at least 200 characters' },
        { status: 400 }
      )
    }

    // Validate total amount
    if (formData.totalAmount <= 0) {
      return NextResponse.json(
        { error: 'Total amount must be greater than 0' },
        { status: 400 }
      )
    }

    // Save expense to database
    const savedExpense = await saveExpense(formData, user.id)

    if (!savedExpense) {
      return NextResponse.json(
        { error: 'Failed to save expense' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      expense: savedExpense,
      message: 'Expense saved successfully' 
    })
  } catch (error) {
    console.error('Error in POST /api/expenses:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 