'use client'

import React, { useState } from 'react'
import { ArrowLeft, Upload, Plus } from 'lucide-react'
import { CollapsibleCard } from '../ui/collapsible-card'

interface MaintenanceFlowProps {
  onBack: () => void
  onContinueToReview: () => void
}

export function MaintenanceFlow({ onBack, onContinueToReview }: MaintenanceFlowProps) {
  const [activeStep, setActiveStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [maintenanceCategory, setMaintenanceCategory] = useState('')
  const [subCategory, setSubCategory] = useState('')
  const [vehicleType, setVehicleType] = useState('')
  const [equipmentPurchased, setEquipmentPurchased] = useState('')

  const handleStepComplete = (step: number) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps([...completedSteps, step])
    }
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
            <h1 className="text-xl font-semibold text-gray-900">Maintenance Expense</h1>
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
          {/* Category Selection Card */}
          <CollapsibleCard
            title="Maintenance Category"
            step={1}
            totalSteps={4}
            isActive={activeStep === 1}
            isCompleted={completedSteps.includes(1)}
            canSkip={false}
          >
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { id: 'charges', name: 'Charges', icon: '⚡', desc: 'Garage and vehicle charging' },
                  { id: 'purchases', name: 'Purchases', icon: '🛒', desc: 'Equipment and supplies' },
                  { id: 'repairs', name: 'Repairs', icon: '🔧', desc: 'Service and repairs' }
                ].map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setMaintenanceCategory(category.id)}
                    className={`p-6 border rounded-lg text-center transition-all hover:shadow-md ${
                      maintenanceCategory === category.id 
                        ? 'border-green-500 bg-green-50 ring-2 ring-green-200' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-3xl mb-3">{category.icon}</div>
                    <div className="font-semibold text-gray-900 mb-2">{category.name}</div>
                    <div className="text-sm text-gray-600">{category.desc}</div>
                  </button>
                ))}
              </div>

              {maintenanceCategory && (
                <button
                  onClick={() => {
                    setCompletedSteps([1])
                    setActiveStep(2)
                  }}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  Continue to Subcategory
                </button>
              )}
            </div>
          </CollapsibleCard>

          {/* Subcategory Selection Card */}
          {maintenanceCategory && (
            <CollapsibleCard
              title={`${maintenanceCategory.charAt(0).toUpperCase() + maintenanceCategory.slice(1)} Subcategory`}
              step={2}
              totalSteps={4}
              isActive={activeStep === 2}
              isCompleted={completedSteps.includes(2)}
              canSkip={false}
            >
              <div className="space-y-6">
                {maintenanceCategory === 'charges' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { id: 'garage-charge', name: 'Garage Charge', desc: 'Vehicle parking and storage' },
                      { id: 'vehicle-charging', name: 'Vehicle Charging', desc: 'Electric vehicle charging' }
                    ].map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => setSubCategory(sub.id)}
                        className={`p-4 border rounded-lg text-left transition-all hover:shadow-md ${
                          subCategory === sub.id 
                            ? 'border-green-500 bg-green-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-semibold text-gray-900 mb-1">{sub.name}</div>
                        <div className="text-sm text-gray-600">{sub.desc}</div>
                      </button>
                    ))}
                  </div>
                )}

                {maintenanceCategory === 'purchases' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { id: 'drinking-water', name: 'Drinking Water', desc: 'Water jars and supplies' },
                      { id: 'electric-equipment', name: 'Electric Equipment', desc: 'Electrical supplies' },
                      { id: 'sanitary-equipment', name: 'Sanitary Equipment', desc: 'Cleaning supplies' },
                      { id: 'medical-equipment', name: 'Medical Equipment', desc: 'First aid and medical' },
                      { id: 'document-courier', name: 'Document Courier', desc: 'Printing and courier' },
                      { id: 'office-bag', name: 'Office Bag', desc: 'Office supplies and bags' }
                    ].map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => setSubCategory(sub.id)}
                        className={`p-4 border rounded-lg text-left transition-all hover:shadow-md ${
                          subCategory === sub.id 
                            ? 'border-green-500 bg-green-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-semibold text-gray-900 mb-1">{sub.name}</div>
                        <div className="text-sm text-gray-600">{sub.desc}</div>
                      </button>
                    ))}
                  </div>
                )}

                {maintenanceCategory === 'repairs' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { id: 'plumber', name: 'Plumber', desc: 'Plumbing repairs and maintenance' },
                      { id: 'electrician', name: 'Electrician', desc: 'Electrical repairs and wiring' },
                      { id: 'bike-fix', name: 'Bike Fix', desc: 'Bicycle and motorcycle repairs' },
                      { id: 'wash-service', name: 'Wash Service Center', desc: 'Vehicle washing and cleaning' }
                    ].map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => setSubCategory(sub.id)}
                        className={`p-4 border rounded-lg text-left transition-all hover:shadow-md ${
                          subCategory === sub.id 
                            ? 'border-green-500 bg-green-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-semibold text-gray-900 mb-1">{sub.name}</div>
                        <div className="text-sm text-gray-600">{sub.desc}</div>
                      </button>
                    ))}
                  </div>
                )}

                {subCategory && (
                  <button
                    onClick={() => {
                      setCompletedSteps([1, 2])
                      setActiveStep(3)
                    }}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    Continue to Details
                  </button>
                )}
              </div>
            </CollapsibleCard>
          )}

          {/* Detailed Information Card */}
          {subCategory && activeStep >= 3 && (
            <CollapsibleCard
              title="Detailed Information"
              step={3}
              totalSteps={4}
              isActive={activeStep === 3}
              isCompleted={completedSteps.includes(3)}
              canSkip={false}
            >
              <div className="space-y-6">
                {/* Garage Charge Flow */}
                {subCategory === 'garage-charge' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Vehicle Type</label>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {['Bike', 'Car', 'Truck', 'Mini Van', 'Moped Vehicle'].map((type) => (
                          <button
                            key={type}
                            onClick={() => setVehicleType(type)}
                            className={`p-3 border rounded-lg text-sm transition-all ${
                              vehicleType === type 
                                ? 'border-green-500 bg-green-50' 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Model/Type</label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., Toyota Corolla"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Duration (Months)</label>
                        <input
                          type="number"
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="1"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Garage Owner Contract Details</label>
                      <textarea
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows={3}
                        placeholder="Enter garage owner and contract details..."
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Total Cost</label>
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
                )}

                {/* Drinking Water Flow */}
                {subCategory === 'drinking-water' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Water Jar Count</label>
                      <input
                        type="number"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Number of water jars"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Purpose</label>
                      <textarea
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows={3}
                        placeholder="Describe the purpose of this purchase..."
                      ></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Date</label>
                        <input
                          type="date"
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Total Cost</label>
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">Third Party Contract</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Vendor name and contract details"
                      />
                    </div>
                  </div>
                )}

                {/* Repairs Flow with Equipment Purchase Check */}
                {maintenanceCategory === 'repairs' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Service Purpose</label>
                      <textarea
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows={3}
                        placeholder="Describe what needs to be repaired or serviced..."
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Equipment Purchased?</label>
                      <div className="space-y-3">
                        {[
                          { id: 'yes', label: 'Yes - Equipment was purchased' },
                          { id: 'no', label: 'No - Service only' }
                        ].map((option) => (
                          <label key={option.id} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                            <input
                              type="radio"
                              name="equipmentPurchased"
                              value={option.id}
                              checked={equipmentPurchased === option.id}
                              onChange={(e) => setEquipmentPurchased(e.target.value)}
                              className="text-green-600 focus:ring-green-500"
                            />
                            <span className="ml-3 text-gray-900">{option.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {equipmentPurchased === 'yes' && (
                      <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Equipment List</label>
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                              <input
                                type="text"
                                className="flex-1 px-3 py-2 border border-gray-200 rounded focus:ring-2 focus:ring-blue-500"
                                placeholder="Equipment name"
                              />
                              <input
                                type="number"
                                className="w-20 px-3 py-2 border border-gray-200 rounded focus:ring-2 focus:ring-blue-500"
                                placeholder="Qty"
                              />
                              <div className="relative">
                                <span className="absolute left-2 top-2 text-gray-500 text-sm">৳</span>
                                <input
                                  type="number"
                                  className="w-24 pl-6 pr-2 py-2 border border-gray-200 rounded focus:ring-2 focus:ring-blue-500"
                                  placeholder="Cost"
                                />
                              </div>
                              <button className="text-green-600 hover:text-green-700">
                                <Plus className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Service Date</label>
                        <input
                          type="date"
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Total Cost</label>
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">Third Party Contract</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Service provider name and contract details"
                      />
                    </div>
                  </div>
                )}

                {/* Universal Receipt Upload */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Upload Receipt</h4>
                  <p className="text-gray-600 mb-4">Upload receipt and any relevant documents</p>
                  <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors">
                    Choose Files
                  </button>
                </div>

                <button
                  onClick={onContinueToReview}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
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