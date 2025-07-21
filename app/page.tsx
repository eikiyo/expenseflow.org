'use client'

import React, { useState, useEffect } from 'react';
import { 
  User, 
  Bell, 
  ArrowLeft, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Plane, 
  Wrench, 
  FileText, 
  Car, 
  MapPin, 
  Upload, 
  Calendar, 
  DollarSign,
  Clock,
  AlertCircle,
  Eye,
  EyeOff,
  Plus,
  Minus,
  Edit,
  Download,
  Filter,
  SkipForward
} from 'lucide-react';
import { useAuth } from './providers/auth-provider'
import { LoadingSpinner } from './components/ui/loading-spinner'
import { LoginForm } from './components/auth/login-form'
import { ExpenseTypeSelection } from './components/expense/expense-type-selection'
import { TravelFlow } from './components/expense/travel-flow'
import { MaintenanceFlow } from './components/expense/maintenance-flow'
import Image from 'next/image';

interface AppUser {
  name: string
  email: string
  role: string
  avatar?: string
}

export default function ExpenseSubmissionPlatform() {
  const { user: authUser, userProfile, loading, signOut } = useAuth()
  const [currentView, setCurrentView] = useState('dashboard');
  const [user, setUser] = useState<AppUser | null>(null);
  const [expenseType, setExpenseType] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [collapsedCards, setCollapsedCards] = useState({});
  const [skippedSections, setSkippedSections] = useState({});
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [formData, setFormData] = useState({
    transportation: {},
    route: {},
    vehicle: {},
    foodAccommodation: {},
    maintenance: {},
    requisition: {}
  });

  // Update view based on auth state
  useEffect(() => {
    if (loading) return
    if (authUser && userProfile) {
      setUser({
        name: userProfile.full_name,
        email: userProfile.email,
        role: userProfile.role
      })
      if (currentView === 'login') {
        setCurrentView('dashboard')
      }
    } else {
      setUser(null)
      setCurrentView('login')
    }
  }, [authUser, userProfile, loading])

  // Simulated user data for demo
  const mockUser: AppUser = {
    name: userProfile?.full_name || 'John Doe',
    email: userProfile?.email || 'john.doe@company.com',
    avatar: '/api/placeholder/40/40',
    role: userProfile?.role || 'Employee'
  };

  const mockStats = {
    pendingApprovals: 3,
    monthlyExpenses: 2450,
    budgetRemaining: 75
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Show login if not authenticated
  if (!authUser || !userProfile) {
    return <LoginForm />
  }

  // Handle different views
  const renderCurrentView = () => {
    switch (currentView) {
      case 'expense-type':
        return (
          <ExpenseTypeSelection
            onBack={() => setCurrentView('dashboard')}
            onSelectType={(type) => {
              setExpenseType(type)
              setCurrentView(`${type}-flow`)
            }}
          />
        )
      
      case 'travel-flow':
        return (
          <TravelFlow
            onBack={() => setCurrentView('expense-type')}
            onContinueToReview={() => setCurrentView('review')}
          />
        )
      
      case 'maintenance-flow':
        return (
          <MaintenanceFlow
            onBack={() => setCurrentView('expense-type')}
            onContinueToReview={() => setCurrentView('review')}
          />
        )
      
      default:
        // Dashboard view
        return (
          <div className="font-sans antialiased" onClick={() => setShowProfileDropdown(false)}>
            <div className="min-h-screen bg-gray-50">
              {/* Header */}
              <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <Image 
                        src="/logo.svg" 
                        alt="ExpenseFlow Logo" 
                        width={24} 
                        height={24}
                      />
                    </div>
                    <h1 className="text-xl font-semibold text-gray-900">ExpenseFlow</h1>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Bell className="w-6 h-6 text-gray-600 cursor-pointer hover:text-gray-900" />
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
                    </div>
                    
                    <div 
                      className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg relative"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowProfileDropdown(!showProfileDropdown);
                      }}
                    >
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.role}</p>
                      </div>
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                      
                      {showProfileDropdown && (
                        <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-50">
                          <div className="py-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentView('profile');
                                setShowProfileDropdown(false);
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              View Profile
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentView('settings');
                                setShowProfileDropdown(false);
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              Settings
                            </button>
                            <hr className="my-2" />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                signOut();
                                setShowProfileDropdown(false);
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              Sign Out
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </header>

              {/* Dashboard Content */}
              <div className="p-6 max-w-7xl mx-auto">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div 
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow expense-card"
                    onClick={() => setCurrentView('pending-approvals')}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{mockStats.pendingApprovals}</p>
                      </div>
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                        <Clock className="w-6 h-6 text-orange-600" />
                      </div>
                    </div>
                    <p className="text-sm text-blue-600 hover:text-blue-500 font-medium mt-4 cursor-pointer">View All</p>
                  </div>
                  
                  <div 
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow expense-card"
                    onClick={() => setCurrentView('monthly-expenses')}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">This Month's Expenses</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">৳{mockStats.monthlyExpenses.toLocaleString()}</p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                    <p className="text-sm text-blue-600 hover:text-blue-500 font-medium mt-4 cursor-pointer">View Details</p>
                  </div>
                  
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Budget Remaining</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{mockStats.budgetRemaining}%</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <AlertCircle className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="mt-4 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                        style={{width: `${mockStats.budgetRemaining}%`}}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <button
                      onClick={() => {
                        setExpenseType('travel');
                        setCurrentView('travel-flow');
                      }}
                      className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors expense-card"
                    >
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Plane className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="font-medium text-gray-900">Travel Expense</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        setExpenseType('maintenance');
                        setCurrentView('maintenance-flow');
                      }}
                      className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors expense-card"
                    >
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Wrench className="w-5 h-5 text-green-600" />
                      </div>
                      <span className="font-medium text-gray-900">Maintenance</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        setExpenseType('requisition');
                        setCurrentView('requisition-flow');
                      }}
                      className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors expense-card"
                    >
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <FileText className="w-5 h-5 text-purple-600" />
                      </div>
                      <span className="font-medium text-gray-900">Requisition</span>
                    </button>
                  </div>
                  
                  <div>
                    <button 
                      onClick={() => setCurrentView('expense-type')}
                      className="btn-primary"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Submit New Expense
                    </button>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                    <button className="text-sm text-blue-600 hover:text-blue-500 font-medium">View All</button>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      { id: 1, type: 'Travel', amount: '৳245.50', date: 'Today', status: 'pending' },
                      { id: 2, type: 'Maintenance', amount: '৳89.75', date: 'Yesterday', status: 'approved' },
                      { id: 3, type: 'Requisition', amount: '৳156.25', date: '2 days ago', status: 'rejected' }
                    ].map((item) => (
                      <div key={item.id} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                            {item.type === 'Travel' && <Plane className="w-5 h-5 text-blue-600" />}
                            {item.type === 'Maintenance' && <Wrench className="w-5 h-5 text-green-600" />}
                            {item.type === 'Requisition' && <FileText className="w-5 h-5 text-purple-600" />}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{item.type} Expense</p>
                            <p className="text-sm text-gray-500">{item.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="font-semibold text-gray-900">{item.amount}</span>
                          <span className={`status-badge ${
                            item.status === 'pending' ? 'status-pending-manager' :
                            item.status === 'approved' ? 'status-approved' :
                            'status-rejected'
                          }`}>
                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                          </span>
                          <button className="p-1 text-gray-400 hover:text-gray-600">
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  }

  return renderCurrentView();
} 