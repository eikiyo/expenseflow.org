import React from 'react';
import { Header } from '../layout/Header';
import { StatsCards } from '../layout/Dashboard/StatsCards';
import { QuickActions } from '../layout/Dashboard/QuickActions';
import { RecentActivity } from '../layout/Dashboard/RecentActivity';
import { Profile } from '@/lib/supabase';

interface DashboardProps {
  userProfile: Profile;
  onSignOut: () => void;
  onViewProfile: () => void;
  onViewSettings: () => void;
  onViewPendingApprovals: () => void;
  onViewMonthlyExpenses: () => void;
  onSelectExpenseType: (type: 'travel' | 'maintenance' | 'requisition') => void;
  onNewExpense: () => void;
  onViewAllActivity: () => void;
  onViewActivity: (id: string) => void;
}

export function Dashboard({ 
  userProfile,
  onSignOut,
  onViewProfile,
  onViewSettings,
  onViewPendingApprovals,
  onViewMonthlyExpenses,
  onSelectExpenseType,
  onNewExpense,
  onViewAllActivity,
  onViewActivity
}: DashboardProps) {
  const mockStats = {
    pendingApprovals: 3,
    monthlyExpenses: 2450,
    budgetRemaining: 75
  };

  const recentActivities = [
    { id: 1, type: 'Travel' as const, amount: '৳245.50', date: 'Today', status: 'pending' as const },
    { id: 2, type: 'Maintenance' as const, amount: '৳89.75', date: 'Yesterday', status: 'approved' as const },
    { id: 3, type: 'Requisition' as const, amount: '৳156.25', date: '2 days ago', status: 'rejected' as const }
  ];

  return (
    <div className="font-sans antialiased">
      <div className="min-h-screen bg-gray-50">
        <Header 
          userProfile={userProfile}
          onSignOut={onSignOut}
          onViewProfile={onViewProfile}
          onViewSettings={onViewSettings}
        />

        <div className="p-6 max-w-7xl mx-auto">
          <StatsCards 
            stats={mockStats}
            onViewPendingApprovals={onViewPendingApprovals}
            onViewMonthlyExpenses={onViewMonthlyExpenses}
          />
          
          <QuickActions 
            onSelectExpenseType={onSelectExpenseType}
            onNewExpense={onNewExpense}
          />
          
          <RecentActivity 
            activities={recentActivities}
            onViewAll={onViewAllActivity}
            onViewActivity={(id: number) => onViewActivity(String(id))}
          />
        </div>
      </div>
    </div>
  );
} 