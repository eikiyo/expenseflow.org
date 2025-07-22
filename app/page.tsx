/**
 * SIMPLIFIED EXPENSE APPLICATION
 * 
 * This is the main application component using simplified auth flow.
 * Authentication and profile management are cleanly separated.
 * 
 * Dependencies: Simplified auth provider, useUserProfile hook, UI components
 * Used by: Root layout as the main application entry point
 * 
 * @author ExpenseFlow Team
 * @since 2024-01-01
 */

'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from './providers/auth-provider'
import { useUserProfile } from './hooks/useUserProfile'
import { LoadingSpinner } from './components/ui/loading-spinner'
import { LoginForm } from './components/auth/login-form'
import { Dashboard } from './components/dashboard/dashboard'
import { ExpenseTypeSelection } from './components/expense/expense-type-selection'
import { TravelFlow } from './components/expense/travel-flow'
import { MaintenanceFlow } from './components/expense/maintenance-flow'

export default function ExpenseApp() {
  const { user, loading: authLoading, signOut } = useAuth()
  const { profile, loading: profileLoading } = useUserProfile()
  const [currentView, setCurrentView] = useState('dashboard')
  const [expenseType, setExpenseType] = useState('')
  const [authError, setAuthError] = useState<string>('')

  // Check for auth errors in URL parameters
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const error = urlParams.get('auth_error')
      const message = urlParams.get('message')
      
      if (error) {
        setAuthError(message || 'Authentication failed')
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname)
      }
    }
  }, [])

  // Handle OAuth callback parameters
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const code = urlParams.get('code')
      const state = urlParams.get('state')
      const error = urlParams.get('error')
      
      console.log('[OAuth] URL parameters:', { code: !!code, state: !!state, error })
      
      // If we have OAuth callback parameters, let Supabase handle them
      if (code && state) {
        console.log('[OAuth] Detected callback parameters, letting Supabase handle automatically')
        console.log('[OAuth] Code length:', code.length, 'State length:', state.length)
        // Don't clean up URL immediately - let Supabase process the parameters
        // Clean up URL after a delay to give Supabase time to process
        setTimeout(() => {
          console.log('[OAuth] Cleaning up URL parameters after delay')
          window.history.replaceState({}, document.title, window.location.pathname)
        }, 3000)
      } else if (error) {
        console.log('[OAuth] Error in callback:', error)
        setAuthError(`OAuth error: ${error}`)
        window.history.replaceState({}, document.title, window.location.pathname)
      }
    }
  }, [])

  // Show loading while checking auth
  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Show login if not authenticated
  if (!user) {
    return (
      <div>
        {authError && (
          <div className="fixed top-4 right-4 bg-red-50 border border-red-200 rounded-lg p-4 max-w-md z-50">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Sign in failed</h3>
                <p className="text-sm text-red-700 mt-1">{authError}</p>
                <button
                  onClick={() => setAuthError('')}
                  className="mt-2 text-sm text-red-800 underline hover:text-red-900"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}
        <LoginForm />
      </div>
    )
  }

  // Show loading if profile is still being created
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Setting up your profile...</p>
        </div>
      </div>
    )
  }

  // Render based on current view
  const renderView = () => {
    switch (currentView) {
      case 'expense-type':
        return (
          <ExpenseTypeSelection
            onBack={() => setCurrentView('dashboard')}
            onSelectType={(type) => {
              setExpenseType(type)
              setCurrentView(`${type}-flow`)
            }}
          />
        )
      
      case 'travel-flow':
        return (
          <TravelFlow
            onBack={() => setCurrentView('expense-type')}
            onContinueToReview={() => setCurrentView('review')}
          />
        )
      
      case 'maintenance-flow':
        return (
          <MaintenanceFlow
            onBack={() => setCurrentView('expense-type')}
            onContinueToReview={() => setCurrentView('review')}
          />
        )
      
      default:
        return (
          <Dashboard
            userProfile={profile}
            onSignOut={signOut}
            onViewProfile={() => setCurrentView('profile')}
            onViewSettings={() => setCurrentView('settings')}
            onViewPendingApprovals={() => setCurrentView('pending-approvals')}
            onViewMonthlyExpenses={() => setCurrentView('monthly-expenses')}
            onSelectExpenseType={(type) => {
              setExpenseType(type)
              setCurrentView(`${type}-flow`)
            }}
            onNewExpense={() => setCurrentView('expense-type')}
            onViewAllActivity={() => setCurrentView('all-activity')}
            onViewActivity={(id) => setCurrentView(`activity/${id}`)}
          />
        )
    }
  }

  return renderView()
} 