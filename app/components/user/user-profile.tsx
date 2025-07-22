'use client'

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/app/providers/auth-provider';
import { useUserProfile } from '@/app/hooks/useUserProfile';
import { LoadingSpinner } from '../ui/loading-spinner';

interface UserProfileProps {
  onBack: () => void;
}

export function UserProfile({ onBack }: UserProfileProps) {
  const { user } = useAuth();
  const { profile, loading } = useUserProfile();
  const [activeTab, setActiveTab] = useState('personal');
  const [editMode, setEditMode] = useState(false);

  if (loading || !user) {
    return <div className="flex justify-center items-center min-h-screen"><LoadingSpinner size="lg" /></div>;
  }
  if (!profile) {
    return <div className="text-center py-8">User profile not found.</div>;
  }

  // Map profile to the expected structure with new unified fields
  const userData = {
    fullName: profile.full_name,
    email: profile.email,
    department: profile.department || '',
    role: profile.role,
    avatarUrl: profile.avatar_url || profile.profile_picture_url || '/placeholder.jpg',
    expenseLimit: profile.expense_limit || 0,
    // New unified fields
    employeeId: profile.employee_id || '',
    phone: profile.phone || '',
    address: profile.address || '',
    monthlyBudget: profile.monthly_budget || 0,
    singleTransactionLimit: profile.single_transaction_limit || 0,
    isActive: profile.is_active ?? true
  };

  const handleSaveChanges = () => {
    // TODO: Implement save changes logic
    setEditMode(false);
  };

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
            <h1 className="text-xl font-semibold text-gray-900">User Profile</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={() => setEditMode(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveChanges}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6">
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0">
                <img
                  src={userData.avatarUrl}
                  alt={userData.fullName}
                  className="h-24 w-24 rounded-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold text-gray-900">{userData.fullName}</h2>
                  <p className="text-gray-500">{userData.email}</p>
                  {userData.employeeId && (
                    <p className="text-sm text-gray-500">Employee ID: {userData.employeeId}</p>
                  )}
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Department:</span>
                    <span className="ml-2 text-gray-900">{userData.department || 'Not set'}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Role:</span>
                    <span className="ml-2 text-gray-900 capitalize">{userData.role}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Monthly Budget:</span>
                    <span className="ml-2 text-gray-900">৳{userData.monthlyBudget.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Transaction Limit:</span>
                    <span className="ml-2 text-gray-900">৳{userData.singleTransactionLimit.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100">
            <nav className="flex" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('personal')}
                className={`
                  flex-1 px-4 py-3 text-sm font-medium text-center border-b-2 
                  ${activeTab === 'personal'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                Personal Information
              </button>
              <button
                onClick={() => setActiveTab('financial')}
                className={`
                  flex-1 px-4 py-3 text-sm font-medium text-center border-b-2 
                  ${activeTab === 'financial'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                Financial Settings
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`
                  flex-1 px-4 py-3 text-sm font-medium text-center border-b-2
                  ${activeTab === 'security'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                Security Settings
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'personal' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                      type="text"
                      value={userData.fullName}
                      disabled={!editMode}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Employee ID</label>
                    <input
                      type="text"
                      value={userData.employeeId}
                      disabled
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      value={userData.email}
                      disabled
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input
                      type="tel"
                      value={userData.phone}
                      disabled={!editMode}
                      placeholder="Enter phone number"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Department</label>
                    <input
                      type="text"
                      value={userData.department}
                      disabled={!editMode}
                      placeholder="Enter department"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Role</label>
                    <select
                      value={userData.role}
                      disabled={!editMode}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                    >
                      <option value="user">User</option>
                      <option value="employee">Employee</option>
                      <option value="manager">Manager</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <textarea
                    value={userData.address}
                    disabled={!editMode}
                    placeholder="Enter full address"
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
              </div>
            )}

            {activeTab === 'financial' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Monthly Budget</label>
                    <div className="mt-1 relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">৳</span>
                      <input
                        type="number"
                        value={userData.monthlyBudget}
                        disabled={!editMode}
                        className="pl-8 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-500">Maximum budget allocation per month</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Single Transaction Limit</label>
                    <div className="mt-1 relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">৳</span>
                      <input
                        type="number"
                        value={userData.singleTransactionLimit}
                        disabled={!editMode}
                        className="pl-8 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-500">Maximum amount per single expense</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Expense Limit</label>
                    <div className="mt-1 relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">৳</span>
                      <input
                        type="number"
                        value={userData.expenseLimit}
                        disabled={!editMode}
                        className="pl-8 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                    <p className="mt-1 text-sm text-gray-500">Overall expense authorization limit</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Account Status</label>
                    <div className="mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        userData.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {userData.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Change Password</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Ensure your account is using a long, random password to stay secure.
                  </p>
                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Update Password
                    </button>
                  </div>
                </div>

                <div className="pt-6">
                  <h3 className="text-lg font-medium text-gray-900">Two-Factor Authentication</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Add additional security to your account using two-factor authentication.
                  </p>
                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Set Up 2FA
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 