'use client'

import React, { useState } from 'react'
import { ArrowLeft, Calendar, ChevronDown, Download, FileText, Filter, Plane, Wrench } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface MonthlyExpensesProps {
  onBack: () => void
}

export function MonthlyExpenses({ onBack }: MonthlyExpensesProps) {
  const [selectedMonth, setSelectedMonth] = useState('January 2024')
  const [filterOpen, setFilterOpen] = useState(false)

  // Example data - replace with actual data from API
  const monthlyData = [
    { name: 'Week 1', Travel: 2400, Maintenance: 1200, Requisition: 800 },
    { name: 'Week 2', Travel: 1398, Maintenance: 900, Requisition: 1200 },
    { name: 'Week 3', Travel: 3200, Maintenance: 1500, Requisition: 900 },
    { name: 'Week 4', Travel: 2800, Maintenance: 1100, Requisition: 1100 }
  ]

  const expenseHistory = [
    {
      id: 'EXP-001',
      type: 'Travel',
      description: 'Business trip to Chittagong',
      amount: '৳1,245.50',
      date: '2024-01-15',
      status: 'approved'
    },
    {
      id: 'EXP-002',
      type: 'Maintenance',
      description: 'Vehicle fuel and maintenance',
      amount: '৳89.75',
      date: '2024-01-14',
      status: 'pending'
    },
    {
      id: 'EXP-003',
      type: 'Requisition',
      description: 'Office supplies and equipment',
      amount: '৳156.25',
      date: '2024-01-13',
      status: 'rejected'
    }
  ]

  const getExpenseIcon = (type: string) => {
    switch (type) {
      case 'Travel':
        return <Plane className="w-5 h-5 text-blue-600" />
      case 'Maintenance':
        return <Wrench className="w-5 h-5 text-green-600" />
      case 'Requisition':
        return <FileText className="w-5 h-5 text-purple-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-orange-100 text-orange-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
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
            <h1 className="text-xl font-semibold text-gray-900">Monthly Expenses</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Calendar className="w-4 h-4" />
              <span>{selectedMonth}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Summary Cards */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Plane className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-500">Travel</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">৳9,798</p>
            <p className="text-sm text-gray-600 mt-1">4 expenses this month</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Wrench className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm font-medium text-gray-500">Maintenance</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">৳4,700</p>
            <p className="text-sm text-gray-600 mt-1">3 expenses this month</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-gray-500">Requisition</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">৳4,000</p>
            <p className="text-sm text-gray-600 mt-1">2 expenses this month</p>
          </div>
        </div>

        {/* Expense Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Weekly Breakdown</h2>
            <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-500">
              <Download className="w-4 h-4" />
              <span className="text-sm font-medium">Download Report</span>
            </button>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="Travel" fill="#3B82F6" />
                <Bar dataKey="Maintenance" fill="#22C55E" />
                <Bar dataKey="Requisition" fill="#A855F7" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense History */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Expense History</h2>
              <button className="text-sm text-blue-600 hover:text-blue-500 font-medium">
                View All
              </button>
            </div>
          </div>
          
          <div className="divide-y divide-gray-100">
            {expenseHistory.map((expense) => (
              <div key={expense.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
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
                        <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(expense.status)}`}>
                          {expense.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{expense.date}</p>
                      <p className="text-sm text-gray-700 mt-1">{expense.description}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{expense.amount}</p>
                    <p className="text-sm text-gray-500">{expense.type}</p>
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