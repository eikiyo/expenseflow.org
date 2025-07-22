import React from 'react';
import { Clock, DollarSign, AlertCircle } from 'lucide-react';

interface StatsCardsProps {
  stats: {
    pendingApprovals: number;
    monthlyExpenses: number;
    budgetRemaining: number;
  };
  onViewPendingApprovals: () => void;
  onViewMonthlyExpenses: () => void;
}

export function StatsCards({ stats, onViewPendingApprovals, onViewMonthlyExpenses }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div 
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow expense-card"
        onClick={onViewPendingApprovals}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.pendingApprovals}</p>
          </div>
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
            <Clock className="w-6 h-6 text-orange-600" />
          </div>
        </div>
        <p className="text-sm text-blue-600 hover:text-blue-500 font-medium mt-4 cursor-pointer">View All</p>
      </div>
      
      <div 
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow expense-card"
        onClick={onViewMonthlyExpenses}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">This Month's Expenses</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">৳{stats.monthlyExpenses.toLocaleString()}</p>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-green-600" />
          </div>
        </div>
        <p className="text-sm text-blue-600 hover:text-blue-500 font-medium mt-4 cursor-pointer">View Details</p>
      </div>
      
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Budget Remaining</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.budgetRemaining}%</p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        <div className="mt-4 bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
            style={{width: `${stats.budgetRemaining}%`}}
          ></div>
        </div>
      </div>
    </div>
  );
} 