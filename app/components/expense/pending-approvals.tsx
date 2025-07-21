'use client'

import React, { useState } from 'react'
import { ArrowLeft, Bell, Eye, FileText, Filter, Plane, Wrench } from 'lucide-react'

interface PendingExpense {
  id: string
  employee: string
  type: 'Travel' | 'Maintenance' | 'Requisition'
  amount: string
  date: string
  description: string
  status: 'pending' | 'approved' | 'rejected'
  urgent: boolean
}

interface PendingApprovalsProps {
  onBack: () => void
}

export function PendingApprovals({ onBack }: PendingApprovalsProps) {
  const [selectedExpenses, setSelectedExpenses] = useState<string[]>([])
  const [filterOpen, setFilterOpen] = useState(false)

  // Example data - replace with actual data from API
  const pendingExpenses: PendingExpense[] = [
    { 
      id: 'EXP-001', 
      employee: 'Sarah Chen', 
      type: 'Travel', 
      amount: '৳1,245.50', 
      date: '2024-01-15', 
      description: 'Business trip to Chittagong',
      status: 'pending',
      urgent: true
    },
    { 
      id: 'EXP-002', 
      employee: 'Mike Johnson', 
      type: 'Maintenance', 
      amount: '৳89.75', 
      date: '2024-01-14', 
      description: 'Vehicle fuel and maintenance',
      status: 'pending',
      urgent: false
    },
    { 
      id: 'EXP-003', 
      employee: 'Lisa Wang', 
      type: 'Requisition', 
      amount: '৳156.25', 
      date: '2024-01-13', 
      description: 'Office supplies and equipment',
      status: 'pending',
      urgent: false
    }
  ]

  const handleSelectExpense = (id: string) => {
    setSelectedExpenses(prev => {
      if (prev.includes(id)) {
        return prev.filter(expId => expId !== id)
      }
      return [...prev, id]
    })
  }

  const handleSelectAll = () => {
    if (selectedExpenses.length === pendingExpenses.length) {
      setSelectedExpenses([])
    } else {
      setSelectedExpenses(pendingExpenses.map(exp => exp.id))
    }
  }

  const handleBulkApprove = () => {
    // TODO: Implement bulk approve logic
    console.log('Approving:', selectedExpenses)
  }

  const handleBulkReject = () => {
    // TODO: Implement bulk reject logic
    console.log('Rejecting:', selectedExpenses)
  }

  const getExpenseIcon = (type: PendingExpense['type']) => {
    switch (type) {
      case 'Travel':
        return <Plane className="w-5 h-5 text-blue-600" />
      case 'Maintenance':
        return <Wrench className="w-5 h-5 text-green-600" />
      case 'Requisition':
        return <FileText className="w-5 h-5 text-purple-600" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Pending Approvals</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
          </div>
        </div>
      </header>

      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Expenses Awaiting Your Approval</h2>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={handleBulkApprove}
                  disabled={selectedExpenses.length === 0}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    selectedExpenses.length > 0
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Bulk Approve
                </button>
                <button 
                  onClick={handleBulkReject}
                  disabled={selectedExpenses.length === 0}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    selectedExpenses.length > 0
                      ? 'border border-red-300 text-red-600 hover:bg-red-50'
                      : 'border border-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Bulk Reject
                </button>
              </div>
            </div>
          </div>
          
          <div className="divide-y divide-gray-100">
            {/* Select All Header */}
            <div className="p-4 bg-gray-50">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={selectedExpenses.length === pendingExpenses.length}
                  onChange={handleSelectAll}
                />
                <span className="font-medium text-gray-700">Select All</span>
              </label>
            </div>

            {/* Expense List */}
            {pendingExpenses.map((expense) => (
              <div key={expense.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={selectedExpenses.includes(expense.id)}
                      onChange={() => handleSelectExpense(expense.id)}
                    />
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      expense.type === 'Travel' ? 'bg-blue-100' : 
                      expense.type === 'Maintenance' ? 'bg-green-100' : 
                      'bg-purple-100'
                    }`}>
                      {getExpenseIcon(expense.type)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900">{expense.id}</h3>
                        {expense.urgent && (
                          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                            Urgent
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{expense.employee} • {expense.date}</p>
                      <p className="text-sm text-gray-700 mt-1">{expense.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{expense.amount}</p>
                      <p className="text-sm text-gray-500">{expense.type}</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded hover:bg-green-200">
                        Approve
                      </button>
                      <button className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded hover:bg-red-200">
                        Reject
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 