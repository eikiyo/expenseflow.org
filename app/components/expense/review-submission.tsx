'use client'

import React, { useState } from 'react'
import { ArrowLeft, Check, Edit, Eye, FileText, Plane, Wrench } from 'lucide-react'
import type { ExpenseFormData, TravelExpense, MaintenanceExpense, RequisitionExpense } from '@/app/types/expense'

interface ReviewSubmissionProps {
  onBack: () => void
  onSubmit: () => void
  expenseType: 'travel' | 'maintenance' | 'requisition'
  formData: ExpenseFormData
}

export function ReviewSubmission({ onBack, onSubmit, expenseType, formData }: ReviewSubmissionProps) {
  const [businessPurpose, setBusinessPurpose] = useState('')
  const [confirmations, setConfirmations] = useState({
    accurate: false,
    receipts: false,
    legitimate: false
  })

  const getExpenseIcon = () => {
    switch (expenseType) {
      case 'travel':
        return <Plane className="w-6 h-6 text-blue-600" />
      case 'maintenance':
        return <Wrench className="w-6 h-6 text-green-600" />
      case 'requisition':
        return <FileText className="w-6 h-6 text-purple-600" />
    }
  }

  const getExpenseColor = () => {
    switch (expenseType) {
      case 'travel':
        return 'blue'
      case 'maintenance':
        return 'green'
      case 'requisition':
        return 'purple'
    }
  }

  const allConfirmationsChecked = Object.values(confirmations).every(Boolean)
  const businessPurposeValid = businessPurpose.length >= 200

  // Type guards for expense data
  const isTravelExpense = (data: ExpenseFormData): data is TravelExpense => data.type === 'travel'
  const isMaintenanceExpense = (data: ExpenseFormData): data is MaintenanceExpense => data.type === 'maintenance'
  const isRequisitionExpense = (data: ExpenseFormData): data is RequisitionExpense => data.type === 'requisition'

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
            <h1 className="text-xl font-semibold text-gray-900">Review & Submit</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Step 3 of 3</span>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6 max-w-4xl mx-auto">
        <div className="space-y-6">
          {/* Summary Header */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-${getExpenseColor()}-100`}>
                  {getExpenseIcon()}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 capitalize">{expenseType} Expense</h2>
                  <p className="text-gray-600">Submission Date: {new Date().toLocaleDateString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold text-gray-900">৳ {formData.totalAmount.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Expense Breakdown */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Expense Breakdown</h3>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Dynamic breakdown based on expense type */}
              {isTravelExpense(formData) && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-100">
                        <Plane className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Transportation</p>
                        <p className="text-sm text-gray-600">{formData.transportationType} • {formData.vehicleOwnership}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">৳ {formData.fuelCost?.toLocaleString() || '0'}</p>
                      <p className="text-sm text-gray-600">Fuel cost</p>
                    </div>
                  </div>
                  
                  {formData.tollCharges && formData.tollCharges > 0 && (
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-yellow-100">
                          <span className="text-yellow-600 font-bold">T</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Toll Charges</p>
                          <p className="text-sm text-gray-600">Additional charges</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">৳ {formData.tollCharges.toLocaleString()}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {isMaintenanceExpense(formData) && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-100">
                        <Wrench className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Maintenance Service</p>
                        <p className="text-sm text-gray-600">{formData.category} • {formData.subCategory}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">৳ {formData.totalAmount.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              )}

              {isRequisitionExpense(formData) && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-purple-100">
                        <FileText className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Service Requisition</p>
                        <p className="text-sm text-gray-600">{formData.serviceType} • {formData.subType}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">৳ {formData.totalAmount.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Business Purpose */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Business Purpose</h3>
              <p className="text-sm text-gray-600 mt-1">Please provide a detailed explanation of the business purpose (minimum 200 characters)</p>
            </div>
            
            <div className="p-6">
              <textarea
                value={businessPurpose}
                onChange={(e) => setBusinessPurpose(e.target.value)}
                placeholder="Explain the business purpose and justification for this expense..."
                className="w-full h-32 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
              <div className="mt-2 flex justify-between items-center">
                <span className={`text-sm ${businessPurposeValid ? 'text-green-600' : 'text-gray-500'}`}>
                  {businessPurpose.length}/200 characters
                </span>
                {businessPurposeValid && (
                  <span className="text-sm text-green-600 flex items-center">
                    <Check className="w-4 h-4 mr-1" />
                    Valid
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Confirmations */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Confirmations</h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="accurate"
                  checked={confirmations.accurate}
                  onChange={(e) => setConfirmations(prev => ({ ...prev, accurate: e.target.checked }))}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="accurate" className="text-sm text-gray-700">
                  I confirm that all information provided is accurate and complete
                </label>
              </div>
              
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="receipts"
                  checked={confirmations.receipts}
                  onChange={(e) => setConfirmations(prev => ({ ...prev, receipts: e.target.checked }))}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="receipts" className="text-sm text-gray-700">
                  I have attached all required receipts and supporting documents
                </label>
              </div>
              
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="legitimate"
                  checked={confirmations.legitimate}
                  onChange={(e) => setConfirmations(prev => ({ ...prev, legitimate: e.target.checked }))}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="legitimate" className="text-sm text-gray-700">
                  I confirm this is a legitimate business expense and complies with company policies
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            
            <button
              onClick={onSubmit}
              disabled={!allConfirmationsChecked || !businessPurposeValid}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Submit Expense
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 