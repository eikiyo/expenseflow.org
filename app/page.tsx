'use client'

import React, { useState } from 'react';
import { useAuth } from './providers/auth-provider'
import { LoadingSpinner } from './components/ui/loading-spinner'
import { LoginForm } from './components/auth/login-form'
import { ExpenseTypeSelection } from './components/expense/expense-type-selection'
import { TravelFlow } from './components/expense/travel-flow'
import { MaintenanceFlow } from './components/expense/maintenance-flow'
import { Dashboard } from './components/dashboard/dashboard'

export default function ExpenseSubmissionPlatform() {
  const { user: authUser, userProfile, loading, error, signOut } = useAuth()
  const [currentView, setCurrentView] = useState('dashboard');
  const [expenseType, setExpenseType] = useState('');

  // Debug logging
  console.log('🔍 Main page render:', { 
    authUser: !!authUser, 
    authUserId: authUser?.id,
    userProfile: !!userProfile, 
    loading,
    error,
    userEmail: authUser?.email 
  });

  if (loading) {
    console.log('⏳ Showing loading state');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Show login if not authenticated
  if (!authUser || !userProfile) {
    console.log('🔐 Showing login form - no auth user or profile', {
      hasAuthUser: !!authUser,
      hasUserProfile: !!userProfile,
      error
    });
    
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-8 rounded-md bg-red-50 p-4 w-full max-w-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Authentication Error
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  {error}
                </div>
                {error.includes('profile') && (
                  <div className="mt-4">
                    <button
                      type="button"
                      className="rounded-md bg-red-50 px-2 py-1.5 text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
                      onClick={() => {
                        signOut();
                        window.location.reload();
                      }}
                    >
                      Try Again
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        <LoginForm />
      </div>
    );
  }

  console.log('✅ Showing dashboard for authenticated user:', authUser.id);

  // Handle different views
  const renderCurrentView = () => {
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
        // Dashboard view
        return (
          <Dashboard
            userProfile={userProfile}
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
        );
    }
  }

  return renderCurrentView();
} 