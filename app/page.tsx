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

import React, { useState } from 'react'
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
    return <LoginForm />
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