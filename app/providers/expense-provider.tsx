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

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { useAuth } from './auth-provider';
import { saveExpense } from '@/app/services/expense-service';
import { validateExpense } from '@/app/utils/validation';
import { formatValidationErrors } from '@/app/utils/errors';
import {
  ExpenseStatus,
  TransportationType,
  type Expense,
  type TravelExpense,
  type ExpenseFormState,
  type ExpenseFormAction
} from '@/app/types/expense';

const initialTravelExpense: TravelExpense = {
  type: 'travel',
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
};

const initialState: ExpenseFormState = {
  expense: initialTravelExpense,
  isDirty: false,
  currentStep: 0,
  errors: {},
  lastSaved: undefined
};

function expenseFormReducer(state: ExpenseFormState, action: ExpenseFormAction): ExpenseFormState {
  switch (action.type) {
    case 'SET_EXPENSE': {
      const newState = {
        ...state,
        expense: { ...state.expense, ...action.payload } as Expense,
        isDirty: true
      };
      const validationResult = validateExpense(newState.expense);
      if (!validationResult.success) {
        newState.errors = formatValidationErrors(validationResult);
      } else {
        newState.errors = {};
      }
      return newState;
    }
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
    case 'SET_ERRORS':
      return { ...state, errors: action.payload };
    case 'MARK_SAVED':
      return { ...state, isDirty: false, lastSaved: action.payload };
    case 'RESET_FORM':
      return { ...initialState };
    default:
      return state;
  }
}

const ExpenseContext = createContext<{
  state: ExpenseFormState;
  dispatch: React.Dispatch<ExpenseFormAction>;
} | null>(null);

export function ExpenseProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(expenseFormReducer, {
    ...initialState,
    expense: { ...initialTravelExpense, userId: user?.id || '' } as Expense
  });

  useEffect(() => {
    if (state.isDirty) {
      const timeoutId = setTimeout(() => {
        handleSave();
      }, 30000); // Auto-save after 30 seconds of inactivity
      return () => clearTimeout(timeoutId);
    }
  }, [state.isDirty, state.expense]);

  const handleSave = async () => {
    try {
      const savedExpense = await saveExpense(state.expense);
      dispatch({ type: 'MARK_SAVED', payload: new Date() });
      dispatch({ type: 'SET_EXPENSE', payload: savedExpense });
    } catch (error) {
      console.error('Error saving expense:', error);
      // Handle error appropriately
    }
  };

  return (
    <ExpenseContext.Provider value={{ state, dispatch }}>
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpense() {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpense must be used within an ExpenseProvider');
  }
  return context;
} 
} 