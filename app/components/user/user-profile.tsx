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

  // Map profile to the expected structure
  const userData = {
    fullName: profile.full_name,
    email: profile.email,
    department: profile.department || '',
    role: profile.role,
    avatarUrl: profile.avatar_url || '/placeholder.jpg',
    expenseLimit: profile.expense_limit || 0
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
                </div>
                <div className="mt-4 space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Department:</span>
                    <span className="ml-2 text-gray-900">{userData.department || 'Not set'}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Role:</span>
                    <span className="ml-2 text-gray-900 capitalize">{userData.role}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Expense Limit:</span>
                    <span className="ml-2 text-gray-900">৳{userData.expenseLimit.toLocaleString()}</span>
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
              <button
                onClick={() => setActiveTab('preferences')}
                className={`
                  flex-1 px-4 py-3 text-sm font-medium text-center border-b-2
                  ${activeTab === 'preferences'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                Preferences
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'personal' && (
              <div className="space-y-6">
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
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={userData.email}
                    disabled
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Department</label>
                  <input
                    type="text"
                    value={userData.department}
                    disabled={!editMode}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
                  />
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

            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Email Notifications</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Choose what types of email notifications you'd like to receive.
                  </p>
                  <div className="mt-4 space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="expense-submitted"
                          name="expense-submitted"
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="expense-submitted" className="font-medium text-gray-700">
                          Expense Submitted
                        </label>
                        <p className="text-gray-500">Get notified when an expense is submitted for your approval.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="expense-approved"
                          name="expense-approved"
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="expense-approved" className="font-medium text-gray-700">
                          Expense Approved/Rejected
                        </label>
                        <p className="text-gray-500">Get notified when your expense is approved or rejected.</p>
                      </div>
                    </div>
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