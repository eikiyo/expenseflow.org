/**
 * EXPENSE CONTEXT PROVIDER
 * 
 * This file provides global state management for expense forms and data.
 * Handles form state, validation, and auto-saving functionality.
 * 
 * Dependencies: React, expense types, validation utils, expense service
 * Used by: All expense-related components
 * 
 * @author ExpenseFlow Team
 * @since 2024-01-01
 */

'use client'

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { useAuth } from './auth-provider'
import { ExpenseStatus, TransportationType } from '../types/expense'
import type { 
  ExpenseFormState, 
  ExpenseFormAction,
  TravelExpense,
  MaintenanceExpense,
  RequisitionExpense
} from '../types/expense'
import { validateExpense, formatValidationErrors } from '../utils/validation'
import { saveExpense } from '../services/expense-service'
import { toast } from 'react-hot-toast'

// Initial form state
const initialState: ExpenseFormState = {
  currentStep: 1,
  expense: {
    type: 'travel' as const,
    userId: '',
    status: ExpenseStatus.DRAFT,
    totalAmount: 0,
    currency: 'BDT',
    description: '',
    startDate: new Date(),
    endDate: new Date(),
    startLocation: { address: '' },
    endLocation: { address: '' },
    transportationType: TransportationType.PERSONAL_CAR
  } as TravelExpense,
  isDirty: false,
  errors: {},
  lastSaved: undefined
}

// Reducer function for handling form state updates
function expenseFormReducer(state: ExpenseFormState, action: ExpenseFormAction): ExpenseFormState {
  switch (action.type) {
    case 'SET_EXPENSE': {
      const newState = {
        ...state,
        expense: { ...state.expense, ...action.payload },
        isDirty: true
      }
      
      // Validate the updated expense
      const validationResult = validateExpense(newState.expense)
      if (!validationResult.success) {
        newState.errors = formatValidationErrors(validationResult)
      } else {
        newState.errors = {}
      }
      
      return newState
    }
    case 'SET_STEP':
      return {
        ...state,
        currentStep: action.payload
      }
    case 'SET_ERRORS':
      return {
        ...state,
        errors: action.payload
      }
    case 'MARK_SAVED':
      return {
        ...state,
        isDirty: false,
        lastSaved: action.payload
      }
    case 'RESET_FORM':
      return initialState
    default:
      return state
  }
}

// Context type definition
interface ExpenseContextType {
  state: ExpenseFormState
  dispatch: React.Dispatch<ExpenseFormAction>
  saveExpense: () => Promise<void>
  validateForm: () => boolean
  hasErrors: boolean
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined)

// Provider component
export function ExpenseProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [state, dispatch] = useReducer(expenseFormReducer, {
    ...initialState,
    expense: { ...initialState.expense, userId: user?.id || '' }
  })

  // Auto-save effect
  useEffect(() => {
    if (state.isDirty) {
      const timeoutId = setTimeout(() => {
        handleSave()
      }, 30000) // Auto-save after 30 seconds of inactivity

      return () => clearTimeout(timeoutId)
    }
  }, [state.isDirty, state.expense])

  // Save expense to backend
  const handleSave = async () => {
    if (!state.isDirty) return

    try {
      const validationResult = validateExpense(state.expense)
      if (!validationResult.success) {
        dispatch({ 
          type: 'SET_ERRORS', 
          payload: formatValidationErrors(validationResult)
        })
        return
      }

      await saveExpense(state.expense)
      dispatch({ type: 'MARK_SAVED', payload: new Date() })
      toast.success('Expense saved successfully')
    } catch (error) {
      console.error('Error saving expense:', error)
      toast.error('Failed to save expense')
    }
  }

  // Validate the entire form
  const validateForm = () => {
    const validationResult = validateExpense(state.expense)
    if (!validationResult.success) {
      dispatch({ 
        type: 'SET_ERRORS', 
        payload: formatValidationErrors(validationResult)
      })
      return false
    }
    return true
  }

  const value = {
    state,
    dispatch,
    saveExpense: handleSave,
    validateForm,
    hasErrors: Object.keys(state.errors).length > 0
  }

  return (
    <ExpenseContext.Provider value={value}>
      {children}
    </ExpenseContext.Provider>
  )
}

// Custom hook for using the expense context
export function useExpense() {
  const context = useContext(ExpenseContext)
  if (context === undefined) {
    throw new Error('useExpense must be used within an ExpenseProvider')
  }
  return context
} 