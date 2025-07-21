'use client'

import React from 'react'
import { Check, Download, Plus } from 'lucide-react'

interface SubmissionConfirmationProps {
  onSubmitAnother: () => void
  onBackToDashboard: () => void
  referenceNumber: string
}

export function SubmissionConfirmation({ 
  onSubmitAnother, 
  onBackToDashboard,
  referenceNumber 
}: SubmissionConfirmationProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Submission Successful!</h1>
          <p className="text-gray-600 mb-6">Your expense report has been submitted for approval</p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm font-medium text-gray-700 mb-1">Reference Number</p>
            <p className="text-lg font-mono font-semibold text-gray-900">{referenceNumber}</p>
          </div>
          
          <div className="text-left mb-6">
            <h3 className="font-medium text-gray-900 mb-3">Next Steps:</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span>Email confirmation sent</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>Pending manager approval</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <span>Finance team review</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={onSubmitAnother}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Submit Another Expense
            </button>
            
            <button
              onClick={onBackToDashboard}
              className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Back to Dashboard
            </button>
            
            <button className="w-full text-blue-600 py-2 px-4 font-medium hover:text-blue-500 flex items-center justify-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              You can track the status of your submission in the dashboard under "Recent Activity"
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 