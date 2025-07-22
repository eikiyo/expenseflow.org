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
  const { user: authUser, userProfile, loading, signOut } = useAuth()
  const [currentView, setCurrentView] = useState('dashboard');
  const [expenseType, setExpenseType] = useState('');

  // Debug logging
  console.log('🔍 Main page render:', { 
    authUser: !!authUser, 
    authUserId: authUser?.id,
    userProfile: !!userProfile, 
    loading,
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
      hasUserProfile: !!userProfile
    });
    
    // Test rendering with a simple div first
    return (
      <div>
        <div style={{ padding: '20px', backgroundColor: 'red', color: 'white' }}>
          DEBUG: Login form should render here
        </div>
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