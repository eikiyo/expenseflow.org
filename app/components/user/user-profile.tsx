'use client'

import React, { useState } from 'react'
import { ArrowLeft, Camera, Car, Edit, Lock, Mail, Phone, User } from 'lucide-react'
import { useAuth } from '@/app/providers/auth-provider'
import { LoadingSpinner } from '../ui/loading-spinner'

interface UserProfileProps {
  onBack: () => void
}

export function UserProfile({ onBack }: UserProfileProps) {
  const { userProfile, loading, error } = useAuth()
  const [activeTab, setActiveTab] = useState('personal')
  const [editMode, setEditMode] = useState(false)

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen"><LoadingSpinner size="lg" /></div>
  }
  if (error) {
    return <div className="text-red-600 text-center py-8">{error}</div>
  }
  if (!userProfile) {
    return <div className="text-center py-8">User profile not found.</div>
  }

  // Map userProfile to the expected structure
  const userData = {
    fullName: userProfile.full_name,
    email: userProfile.email,
    employeeId: userProfile.employee_id,
    department: userProfile.department || '',
    role: userProfile.role,
    phone: userProfile.phone || '',
    address: userProfile.address || '',
    profilePicture: userProfile.profile_picture_url || '/placeholder.jpg',
    vehicles: [], // No vehicles in ExpenseUser, so leave empty for now
    expenseLimits: {
      monthlyBudget: userProfile.monthly_budget,
      singleTransaction: userProfile.single_transaction_limit
    }
  }

  const handleSaveChanges = () => {
    // TODO: Implement save changes logic
    setEditMode(false)
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
            <h1 className="text-xl font-semibold text-gray-900">Profile Settings</h1>
          </div>
          <div className="flex items-center space-x-4">
            {editMode ? (
              <>
                <button
                  onClick={() => setEditMode(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveChanges}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Edit className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </div>
        {/* Profile Tabs */}
        <div className="px-6 border-t border-gray-200">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('personal')}
              className={`py-4 text-sm font-medium border-b-2 ${
                activeTab === 'personal'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Personal Information
            </button>
            <button
              onClick={() => setActiveTab('vehicles')}
              className={`py-4 text-sm font-medium border-b-2 ${
                activeTab === 'vehicles'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Vehicles
            </button>
            <button
              onClick={() => setActiveTab('limits')}
              className={`py-4 text-sm font-medium border-b-2 ${
                activeTab === 'limits'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Expense Limits
            </button>
          </div>
        </div>
      </header>
      <div className="p-6 max-w-4xl mx-auto">
        {activeTab === 'personal' && (
          <div className="space-y-6">
            {/* Profile Picture */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden">
                    <img
                      src={userData.profilePicture}
                      alt={userData.fullName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {editMode && (
                    <button className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
                      <Camera className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{userData.fullName}</h2>
                  <p className="text-gray-600">{userData.role} • {userData.department}</p>
                </div>
              </div>
            </div>
            {/* Personal Information */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={userData.fullName}
                        disabled={!editMode}
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={userData.email}
                        disabled={!editMode}
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        value={userData.phone}
                        disabled={!editMode}
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Employee ID</label>
                    <div className="flex items-center space-x-3">
                      <Lock className="w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={userData.employeeId}
                        disabled
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <textarea
                    value={userData.address}
                    disabled={!editMode}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'vehicles' && (
          <div className="space-y-6">
            {/* Registered Vehicles */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Registered Vehicles</h3>
                {editMode && (
                  <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <span>Add Vehicle</span>
                  </button>
                )}
              </div>
              <div className="space-y-4">
                {userData.vehicles.length > 0 ? userData.vehicles.map((vehicle: any) => (
                  <div key={vehicle.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Car className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{vehicle.model}</h4>
                        <p className="text-sm text-gray-600">{vehicle.plateNumber} • {vehicle.year}</p>
                      </div>
                    </div>
                    {editMode && (
                      <button className="text-gray-400 hover:text-gray-600">
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )) : <div className="text-gray-500">No vehicles registered.</div>}
              </div>
            </div>
          </div>
        )}
        {activeTab === 'limits' && (
          <div className="space-y-6">
            {/* Expense Limits */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Expense Limits</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Budget</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-500">৳</span>
                    <input
                      type="number"
                      value={userData.expenseLimits.monthlyBudget}
                      disabled
                      className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-lg bg-gray-50"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Maximum amount you can expense per month</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Single Transaction Limit</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-500">৳</span>
                    <input
                      type="number"
                      value={userData.expenseLimits.singleTransaction}
                      disabled
                      className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-lg bg-gray-50"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Maximum amount allowed per transaction</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    Expense limits are set by your organization. Contact your manager or finance team to request changes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 