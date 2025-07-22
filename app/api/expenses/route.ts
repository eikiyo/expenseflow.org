/**
 * EXPENSE API ROUTES
 * 
 * This file handles all expense-related API endpoints.
 * Provides CRUD operations for expenses with proper validation.
 * 
 * Dependencies: Next.js, Supabase, Zod
 * Used by: Expense components and services
 * 
 * @author ExpenseFlow Team
 * @since 2024-01-01
 */

import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { validateExpense } from '@/app/utils/validation'
import type { Database } from '@/lib/database.types'

// GET /api/expenses - Get all expenses for the current user
export async function GET() {
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

    // Get all expenses for the user
    const { data: expenses, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('userId', user.id)
      .order('updated_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(expenses)
  } catch (error) {
    console.error('Error fetching expenses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch expenses' },
      { status: 500 }
    )
  }
}

// POST /api/expenses - Create a new expense
export async function POST(request: Request) {
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

    // Get the expense data from the request
    const expense = await request.json()
    
    // Validate the expense data
    const validationResult = validateExpense(expense)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid expense data', details: validationResult.error },
        { status: 400 }
      )
    }

    // Create the expense
    const { data, error } = await supabase
      .from('expenses')
      .insert({
        ...validationResult.data,
        userId: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error creating expense:', error)
    return NextResponse.json(
      { error: 'Failed to create expense' },
      { status: 500 }
    )
  }
}

// PUT /api/expenses - Update an existing expense
export async function PUT(request: Request) {
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

    // Get the expense data from the request
    const expense = await request.json()
    
    // Validate the expense data
    const validationResult = validateExpense(expense)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid expense data', details: validationResult.error },
        { status: 400 }
      )
    }

    // Ensure the expense belongs to the user
    const { data: existingExpense, error: fetchError } = await supabase
      .from('expenses')
      .select('userId')
      .eq('id', expense.id)
      .single()

    if (fetchError || !existingExpense) {
      return NextResponse.json(
        { error: 'Expense not found' },
        { status: 404 }
      )
    }

    if (existingExpense.userId !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Update the expense
    const { data, error } = await supabase
      .from('expenses')
      .update({
        ...validationResult.data,
        updated_at: new Date().toISOString()
      })
      .eq('id', expense.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating expense:', error)
    return NextResponse.json(
      { error: 'Failed to update expense' },
      { status: 500 }
    )
  }
}

// DELETE /api/expenses?id={id} - Delete a draft expense
export async function DELETE(request: Request) {
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

    // Get the expense ID from the URL
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json(
        { error: 'Expense ID is required' },
        { status: 400 }
      )
    }

    // Ensure the expense belongs to the user and is in draft status
    const { data: expense, error: fetchError } = await supabase
      .from('expenses')
      .select('userId, status')
      .eq('id', id)
      .single()

    if (fetchError || !expense) {
      return NextResponse.json(
        { error: 'Expense not found' },
        { status: 404 }
      )
    }

    if (expense.userId !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    if (expense.status !== 'draft') {
      return NextResponse.json(
        { error: 'Only draft expenses can be deleted' },
        { status: 400 }
      )
    }

    // Delete the expense
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting expense:', error)
    return NextResponse.json(
      { error: 'Failed to delete expense' },
      { status: 500 }
    )
  }
} 