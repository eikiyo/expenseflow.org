import React from 'react';
import { Plane, Wrench, FileText, Plus } from 'lucide-react';

interface QuickActionsProps {
  onSelectExpenseType: (type: 'travel' | 'maintenance' | 'requisition') => void;
  onNewExpense: () => void;
}

export function QuickActions({ onSelectExpenseType, onNewExpense }: QuickActionsProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <button
          onClick={() => onSelectExpenseType('travel')}
          className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors expense-card"
        >
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Plane className="w-5 h-5 text-blue-600" />
          </div>
          <span className="font-medium text-gray-900">Travel Expense</span>
        </button>
        
        <button
          onClick={() => onSelectExpenseType('maintenance')}
          className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors expense-card"
        >
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <Wrench className="w-5 h-5 text-green-600" />
          </div>
          <span className="font-medium text-gray-900">Maintenance</span>
        </button>
        
        <button
          onClick={() => onSelectExpenseType('requisition')}
          className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors expense-card"
        >
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <FileText className="w-5 h-5 text-purple-600" />
          </div>
          <span className="font-medium text-gray-900">Requisition</span>
        </button>
      </div>
      
      <div>
        <button 
          onClick={onNewExpense}
          className="btn-primary"
        >
          <Plus className="w-5 h-5 mr-2" />
          Submit New Expense
        </button>
      </div>
    </div>
  );
} 