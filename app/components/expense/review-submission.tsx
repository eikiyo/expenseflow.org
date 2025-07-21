'use client'

import React, { useState } from 'react'
import { ArrowLeft, Check, Edit, Eye, FileText, Plane, Wrench } from 'lucide-react'

interface ReviewSubmissionProps {
  onBack: () => void
  onSubmit: () => void
  expenseType: 'travel' | 'maintenance' | 'requisition'
  formData: any // TODO: Add proper type based on expense type
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
                <p className="text-2xl font-bold text-gray-900">৳ 2,450.00</p>
              </div>
            </div>
          </div>

          {/* Expense Breakdown */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Expense Breakdown</h3>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Example breakdown items - replace with actual data */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-${getExpenseColor()}-100`}>
                    {getExpenseIcon()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Primary Cost</p>
                    <p className="text-sm text-gray-600">Base expense amount</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-gray-900">৳ 1,800.00</span>
                  <button className="text-blue-600 hover:text-blue-500">
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-${getExpenseColor()}-100`}>
                    {getExpenseIcon()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Additional Costs</p>
                    <p className="text-sm text-gray-600">Extra charges and fees</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-gray-900">৳ 650.00</span>
                  <button className="text-blue-600 hover:text-blue-500">
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Validation Status */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Validation Status</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-600" />
                <span className="text-gray-900">All required receipts attached</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-600" />
                <span className="text-gray-900">Expense amounts within policy limits</span>
              </div>
              <div className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-600" />
                <span className="text-gray-900">Business purpose documented</span>
              </div>
            </div>
          </div>

          {/* Business Justification */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Purpose & Justification</h3>
            <textarea
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={4}
              placeholder="Please provide detailed business justification for this expense (minimum 200 characters)..."
              minLength={200}
              value={businessPurpose}
              onChange={(e) => setBusinessPurpose(e.target.value)}
            ></textarea>
            <p className={`text-sm mt-2 ${businessPurposeValid ? 'text-green-600' : 'text-gray-500'}`}>
              {businessPurpose.length} / 200 characters minimum
            </p>
          </div>

          {/* Approval Preview */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Approval Process</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">1</div>
                <div>
                  <p className="font-medium text-gray-900">Direct Manager</p>
                  <p className="text-sm text-gray-600">Sarah Johnson - Expected approval: 24 hours</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg opacity-60">
                <div className="w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center text-sm font-medium">2</div>
                <div>
                  <p className="font-medium text-gray-900">Finance Team</p>
                  <p className="text-sm text-gray-600">Final review and processing</p>
                </div>
              </div>
            </div>
          </div>

          {/* Confirmation Checkboxes */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Final Confirmation</h3>
            <div className="space-y-3">
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={confirmations.accurate}
                  onChange={(e) => setConfirmations({...confirmations, accurate: e.target.checked})}
                />
                <span className="text-gray-900">I confirm that all information provided is accurate and complete</span>
              </label>
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={confirmations.receipts}
                  onChange={(e) => setConfirmations({...confirmations, receipts: e.target.checked})}
                />
                <span className="text-gray-900">I have attached all required receipts and documentation</span>
              </label>
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={confirmations.legitimate}
                  onChange={(e) => setConfirmations({...confirmations, legitimate: e.target.checked})}
                />
                <span className="text-gray-900">This expense was necessary for legitimate business purposes</span>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-4">
            <button
              onClick={onSubmit}
              disabled={!allConfirmationsChecked || !businessPurposeValid}
              className={`flex-1 py-4 px-6 rounded-lg font-medium transition-colors ${
                allConfirmationsChecked && businessPurposeValid
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              Submit Expense Report
            </button>
            <button className="px-6 py-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
              Save as Draft
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 