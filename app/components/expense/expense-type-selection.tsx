'use client'

import React from 'react'
import { ArrowLeft, Plane, Wrench, FileText } from 'lucide-react'

interface ExpenseTypeSelectionProps {
  onBack: () => void
  onSelectType: (type: 'travel' | 'maintenance' | 'requisition') => void
}

export function ExpenseTypeSelection({ onBack, onSelectType }: ExpenseTypeSelectionProps) {
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
            <h1 className="text-xl font-semibold text-gray-900">New Expense Submission</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Step 1 of 3</span>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Choose Expense Type</h2>
          <p className="text-gray-600">Select the type of expense you want to submit</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Travel Card */}
          <div className="group cursor-pointer" onClick={() => onSelectType('travel')}>
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                  <Plane className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Travel Expenses</h3>
                <p className="text-gray-600 mb-4">Transportation, meals, accommodation, and trip-related costs</p>
                <div className="text-sm text-gray-500 mb-6">
                  <span className="font-medium">Examples:</span> Van, Food, Hotel, Fuel
                </div>
                <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  Select Travel
                </button>
              </div>
            </div>
          </div>

          {/* Maintenance Card */}
          <div className="group cursor-pointer" onClick={() => onSelectType('maintenance')}>
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                  <Wrench className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Maintenance Expenses</h3>
                <p className="text-gray-600 mb-4">Vehicle maintenance, equipment purchases, and repairs</p>
                <div className="text-sm text-gray-500 mb-6">
                  <span className="font-medium">Examples:</span> Fuel, Parts, Service, Tools
                </div>
                <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors">
                  Select Maintenance
                </button>
              </div>
            </div>
          </div>

          {/* Requisition Card */}
          <div className="group cursor-pointer" onClick={() => onSelectType('requisition')}>
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                  <FileText className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Requisition Management</h3>
                <p className="text-gray-600 mb-4">Recurring services, utilities, and operational expenses</p>
                <div className="text-sm text-gray-500 mb-6">
                  <span className="font-medium">Examples:</span> Security, Utilities, Cleaning
                </div>
                <button className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors">
                  Select Requisition
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <a href="#" className="text-blue-600 hover:text-blue-500 font-medium">Need Help?</a>
        </div>
      </div>
    </div>
  )
} 