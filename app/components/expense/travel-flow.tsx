'use client'

import React, { useState } from 'react'
import { ArrowLeft, MapPin, Upload } from 'lucide-react'
import { CollapsibleCard } from '../ui/collapsible-card'

interface TravelFlowProps {
  onBack: () => void
  onContinueToReview: () => void
}

export function TravelFlow({ onBack, onContinueToReview }: TravelFlowProps) {
  const [activeStep, setActiveStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [skippedSections, setSkippedSections] = useState<{ [key: number]: boolean }>({})
  const [transportMethod, setTransportMethod] = useState('')
  const [vehicleOwnership, setVehicleOwnership] = useState('')
  const [roundTrip, setRoundTrip] = useState(false)

  const transportMethods = [
    { id: 'van', name: 'Van', icon: '🚐' },
    { id: 'rickshaw', name: 'Rickshaw', icon: '🛺' },
    { id: 'boat', name: 'Boat', icon: '🛥️' },
    { id: 'cng', name: 'CNG', icon: '🚗' },
    { id: 'train', name: 'Train', icon: '🚂' },
    { id: 'plane', name: 'Plane', icon: '✈️' }
  ]

  const handleStepComplete = (step: number) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps([...completedSteps, step])
    }
    if (step < 4) {
      setActiveStep(step + 1)
    }
  }

  const handleSkipSection = (step: number) => {
    setSkippedSections({...skippedSections, [step]: true})
    if (step < 4) {
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
            <h1 className="text-xl font-semibold text-gray-900">Travel Expense</h1>
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
          {/* Transportation Card */}
          <CollapsibleCard
            title="Transportation Details"
            step={1}
            totalSteps={4}
            isActive={activeStep === 1}
            isCompleted={completedSteps.includes(1)}
            isSkipped={skippedSections[1]}
            canSkip={true}
            onSkip={() => handleSkipSection(1)}
          >
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Select Transportation Method</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {transportMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setTransportMethod(method.id)}
                      className={`p-4 border rounded-lg text-center transition-all hover:shadow-md ${
                        transportMethod === method.id 
                          ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-2">{method.icon}</div>
                      <div className="font-medium text-gray-900">{method.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {transportMethod && (
                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Vehicle Ownership</label>
                    <div className="space-y-3">
                      {[
                        { id: 'own', label: 'Own Vehicle', icon: '🚗' },
                        { id: 'rental', label: 'Rental/Third-Party', icon: '🏢' },
                        { id: 'public', label: 'Public Transport', icon: '🚌' }
                      ].map((option) => (
                        <label key={option.id} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                          <input
                            type="radio"
                            name="ownership"
                            value={option.id}
                            checked={vehicleOwnership === option.id}
                            onChange={(e) => setVehicleOwnership(e.target.value)}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-3 text-lg">{option.icon}</span>
                          <span className="ml-3 font-medium text-gray-900">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => handleStepComplete(1)}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Continue to Route Details
                  </button>
                </div>
              )}
            </div>
          </CollapsibleCard>

          {/* Route & Location Card */}
          <CollapsibleCard
            title="Route & Location Details"
            step={2}
            totalSteps={4}
            isActive={activeStep === 2}
            isCompleted={completedSteps.includes(2)}
            isSkipped={skippedSections[2]}
            canSkip={true}
            onSkip={() => handleSkipSection(2)}
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-900">Trip Configuration</h4>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={roundTrip}
                    onChange={(e) => setRoundTrip(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Round Trip</span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Location</label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter start location"
                    />
                    <button className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                      <MapPin className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Location</label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter end location"
                    />
                    <button className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                      <MapPin className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Departure Date & Time</label>
                  <input
                    type="datetime-local"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {roundTrip && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Return Date & Time</label>
                    <input
                      type="datetime-local"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}
              </div>

              <button
                onClick={() => handleStepComplete(2)}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Continue to Vehicle Details
              </button>
            </div>
          </CollapsibleCard>

          {/* Vehicle & Cost Details Card */}
          <CollapsibleCard
            title="Vehicle & Cost Details"
            step={3}
            totalSteps={4}
            isActive={activeStep === 3}
            isCompleted={completedSteps.includes(3)}
            isSkipped={skippedSections[3]}
            canSkip={false}
          >
            <div className="space-y-6">
              {vehicleOwnership === 'own' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Model</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Toyota Hiace"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">License Plate</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., DHK-1234"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Start Odometer (KM)</label>
                      <input
                        type="number"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="50000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">End Odometer (KM)</label>
                      <input
                        type="number"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="50150"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-4">Cost Breakdown</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Base Transportation Cost</label>
                      <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-500">৳</span>
                        <input
                          type="number"
                          className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Cost</label>
                      <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-500">৳</span>
                        <input
                          type="number"
                          className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Toll Charges (Optional)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-500">৳</span>
                      <input
                        type="number"
                        className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">Upload Receipts</h4>
                <p className="text-gray-600 mb-4">Drag and drop your receipt files here, or click to browse</p>
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors">
                  Choose Files
                </button>
              </div>

              <button
                onClick={() => handleStepComplete(3)}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Continue to Food & Accommodation
              </button>
            </div>
          </CollapsibleCard>

          {/* Food & Accommodation Card */}
          <CollapsibleCard
            title="Food & Accommodation"
            step={4}
            totalSteps={4}
            isActive={activeStep === 4}
            isCompleted={completedSteps.includes(4)}
            isSkipped={skippedSections[4]}
            canSkip={true}
            onSkip={() => handleSkipSection(4)}
          >
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Meal Planning</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  {['Breakfast', 'Lunch', 'Dinner', 'Snacks'].map((meal) => (
                    <label key={meal} className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="font-medium text-gray-900">{meal}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900">Accommodation</h4>
                  <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1">
                    <span>Add Hotel Stay</span>
                  </button>
                </div>
                <p className="text-gray-600 text-sm">No accommodation added yet</p>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={onContinueToReview}
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Continue to Review
                </button>
                <button
                  onClick={() => handleSkipSection(4)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Skip Section
                </button>
              </div>
            </div>
          </CollapsibleCard>
        </div>
      </div>
    </div>
  )
} 