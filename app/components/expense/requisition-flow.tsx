'use client'

import React, { useState } from 'react'
import { ArrowLeft, Upload, Plus } from 'lucide-react'
import { CollapsibleCard } from '../ui/collapsible-card'

interface RequisitionFlowProps {
  onBack: () => void
  onContinueToReview: () => void
}

export function RequisitionFlow({ onBack, onContinueToReview }: RequisitionFlowProps) {
  const [activeStep, setActiveStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [skippedSections, setSkippedSections] = useState<{ [key: number]: boolean }>({})
  const [serviceType, setServiceType] = useState('')
  const [subType, setSubType] = useState('')
  const [duration, setDuration] = useState('')
  const [frequency, setFrequency] = useState('')

  const handleStepComplete = (step: number) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps([...completedSteps, step])
    }
    if (step < 3) {
      setActiveStep(step + 1)
    }
  }

  const handleSkipSection = (step: number) => {
    setSkippedSections({...skippedSections, [step]: true})
    if (step < 3) {
      setActiveStep(step + 1)
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
            <h1 className="text-xl font-semibold text-gray-900">Requisition Expense</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Step 2 of 3</span>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6 max-w-5xl mx-auto">
        <div className="space-y-6">
          {/* Service Type Selection */}
          <CollapsibleCard
            title="Service Type"
            step={1}
            totalSteps={3}
            isActive={activeStep === 1}
            isCompleted={completedSteps.includes(1)}
            canSkip={false}
          >
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: 'night-guard', name: 'Night Guard', desc: 'Security services and monitoring' },
                  { id: 'society-fees', name: 'Society Fees', desc: 'Community and maintenance fees' },
                  { id: 'utilities', name: 'Utilities', desc: 'Electricity, water, and other utilities' },
                  { id: 'cleaning', name: 'Cleaning', desc: 'Cleaning and sanitation services' },
                  { id: 'internet', name: 'Internet', desc: 'Internet and connectivity services' },
                  { id: 'pest-control', name: 'Pest Control', desc: 'Pest management services' }
                ].map((service) => (
                  <button
                    key={service.id}
                    onClick={() => setServiceType(service.id)}
                    className={`p-4 border rounded-lg text-left transition-all hover:shadow-md ${
                      serviceType === service.id 
                        ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold text-gray-900 mb-1">{service.name}</div>
                    <div className="text-sm text-gray-600">{service.desc}</div>
                  </button>
                ))}
              </div>

              {serviceType && (
                <button
                  onClick={() => handleStepComplete(1)}
                  className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                >
                  Continue to Service Details
                </button>
              )}
            </div>
          </CollapsibleCard>

          {/* Service Details */}
          {serviceType && (
            <CollapsibleCard
              title="Service Details"
              step={2}
              totalSteps={3}
              isActive={activeStep === 2}
              isCompleted={completedSteps.includes(2)}
              canSkip={false}
            >
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Duration</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { id: 'monthly', label: 'Monthly', desc: 'Recurring monthly service' },
                      { id: 'quarterly', label: 'Quarterly', desc: 'Every three months' },
                      { id: 'yearly', label: 'Yearly', desc: 'Annual service contract' }
                    ].map((option) => (
                      <label key={option.id} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="duration"
                          value={option.id}
                          checked={duration === option.id}
                          onChange={(e) => setDuration(e.target.value)}
                          className="text-purple-600 focus:ring-purple-500"
                        />
                        <div className="ml-3">
                          <span className="block font-medium text-gray-900">{option.label}</span>
                          <span className="block text-sm text-gray-500">{option.desc}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Frequency</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { id: 'advance', label: 'Pay in Advance', desc: 'Full payment before service' },
                      { id: 'completion', label: 'Pay on Completion', desc: 'Payment after service delivery' }
                    ].map((option) => (
                      <label key={option.id} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="frequency"
                          value={option.id}
                          checked={frequency === option.id}
                          onChange={(e) => setFrequency(e.target.value)}
                          className="text-purple-600 focus:ring-purple-500"
                        />
                        <div className="ml-3">
                          <span className="block font-medium text-gray-900">{option.label}</span>
                          <span className="block text-sm text-gray-500">{option.desc}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Service Start Date</label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Service Cost</label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-500">৳</span>
                      <input
                        type="number"
                        className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Provider Details</label>
                  <textarea
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    rows={3}
                    placeholder="Enter service provider name, contact details, and any specific requirements..."
                  ></textarea>
                </div>

                <button
                  onClick={() => handleStepComplete(2)}
                  className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                >
                  Continue to Documentation
                </button>
              </div>
            </CollapsibleCard>
          )}

          {/* Documentation */}
          {completedSteps.includes(2) && (
            <CollapsibleCard
              title="Documentation"
              step={3}
              totalSteps={3}
              isActive={activeStep === 3}
              isCompleted={completedSteps.includes(3)}
              canSkip={false}
            >
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Agreement</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Upload Service Agreement</h4>
                    <p className="text-gray-600 mb-4">Upload the signed service agreement or contract</p>
                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors">
                      Choose File
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Documents</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Upload Supporting Documents</h4>
                    <p className="text-gray-600 mb-4">Upload any additional documentation, quotes, or certificates</p>
                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors">
                      Choose Files
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    rows={3}
                    placeholder="Add any additional notes or special instructions..."
                  ></textarea>
                </div>

                <button
                  onClick={onContinueToReview}
                  className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                >
                  Continue to Review
                </button>
              </div>
            </CollapsibleCard>
          )}
        </div>
      </div>
    </div>
  )
} 