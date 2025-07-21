expenseflow.org	

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

const ExpenseSubmissionPlatform = () => {
  const [currentView, setCurrentView] = useState('login');
  const [user, setUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '', rememberMe: false });
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

  // Simulated user data
  const mockUser = {
    name: 'John Doe',
    email: 'john.doe@company.com',
    avatar: '/api/placeholder/40/40',
    role: 'Employee'
  };

  const mockStats = {
    pendingApprovals: 3,
    monthlyExpenses: 2450,
    budgetRemaining: 75
  };

  // Login Component
  const LoginPanel = () => (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">Welcome Back</h1>
            <p className="text-gray-600 mt-2">Sign in to your expense account</p>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Enter your email"
                value={loginForm.email}
                onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Enter your password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                />
                <button
                  type="button"
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={loginForm.rememberMe}
                  onChange={(e) => setLoginForm({...loginForm, rememberMe: e.target.checked})}
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-500">Forgot password?</a>
            </div>
            
            <button
              onClick={() => {
                setUser(mockUser);
                setCurrentView('dashboard');
              }}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Dashboard Component
  const Dashboard = () => (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900">Expense Manager</h1>
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
              <img src="/api/placeholder/40/40" alt="User" className="w-8 h-8 rounded-full" />
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
                        setUser(null);
                        setCurrentView('login');
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

      <div className="p-6 max-w-7xl mx-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div 
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setCurrentView('pending-approvals')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Pending Approvals</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{mockStats.pendingApprovals}</p>
              </div>
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
            </div>
            <p className="text-xs text-blue-600 hover:text-blue-500 font-medium mt-2">View All</p>
          </div>
          
          <div 
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setCurrentView('monthly-expenses')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">This Month's Expenses</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">${mockStats.monthlyExpenses}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <p className="text-xs text-blue-600 hover:text-blue-500 font-medium mt-2">View Details</p>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Budget Remaining</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{mockStats.budgetRemaining}%</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="mt-3 bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{width: `${mockStats.budgetRemaining}%`}}></div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          
          <button
            onClick={() => setCurrentView('expense-type')}
            className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl mb-4"
          >
            Submit New Expense
          </button>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <button
              onClick={() => {
                setExpenseType('travel');
                setCurrentView('travel-flow');
              }}
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Plane className="w-6 h-6 text-blue-600" />
              <span className="font-medium text-gray-900">Travel Expense</span>
            </button>
            
            <button
              onClick={() => {
                setExpenseType('maintenance');
                setCurrentView('maintenance-flow');
              }}
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Wrench className="w-6 h-6 text-green-600" />
              <span className="font-medium text-gray-900">Maintenance</span>
            </button>
            
            <button
              onClick={() => {
                setExpenseType('requisition');
                setCurrentView('requisition-flow');
              }}
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FileText className="w-6 h-6 text-purple-600" />
              <span className="font-medium text-gray-900">Requisition</span>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <button className="text-sm text-blue-600 hover:text-blue-500 font-medium">View All</button>
          </div>
          
          <div className="space-y-4">
            {[
              { type: 'Travel', amount: '$245.50', date: 'Today', status: 'pending' },
              { type: 'Maintenance', amount: '$89.75', date: 'Yesterday', status: 'approved' },
              { type: 'Requisition', amount: '$156.25', date: '2 days ago', status: 'rejected' }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center space-x-3">
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
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-gray-900">{item.amount}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                    item.status === 'approved' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Expense Type Selection Component
  const ExpenseTypeSelection = () => (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">New Expense Submission</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Step 1 of 3</span>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Choose Expense Type</h2>
          <p className="text-gray-600">Select the type of expense you want to submit</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Travel Card */}
          <div className="group cursor-pointer" onClick={() => {
            setExpenseType('travel');
            setCurrentView('travel-flow');
            setCurrentStep(1);
          }}>
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                  <Plane className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Travel Expenses</h3>
                <p className="text-gray-600 mb-4">Transportation, meals, accommodation, and trip-related costs</p>
                <div className="text-sm text-gray-500 mb-6">
                  <span className="font-medium">Examples:</span> Van, Food, Hotel, Fuel
                </div>
                <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  Select Travel
                </button>
              </div>
            </div>
          </div>

          {/* Maintenance Card */}
          <div className="group cursor-pointer" onClick={() => {
            setExpenseType('maintenance');
            setCurrentView('maintenance-flow');
            setCurrentStep(1);
          }}>
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                  <Wrench className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Maintenance Expenses</h3>
                <p className="text-gray-600 mb-4">Vehicle maintenance, equipment purchases, and repairs</p>
                <div className="text-sm text-gray-500 mb-6">
                  <span className="font-medium">Examples:</span> Fuel, Parts, Service, Tools
                </div>
                <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors">
                  Select Maintenance
                </button>
              </div>
            </div>
          </div>

          {/* Requisition Card */}
          <div className="group cursor-pointer" onClick={() => {
            setExpenseType('requisition');
            setCurrentView('requisition-flow');
            setCurrentStep(1);
          }}>
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                  <FileText className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Requisition Management</h3>
                <p className="text-gray-600 mb-4">Recurring services, utilities, and operational expenses</p>
                <div className="text-sm text-gray-500 mb-6">
                  <span className="font-medium">Examples:</span> Security, Utilities, Cleaning
                </div>
                <button className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors">
                  Select Requisition
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <a href="#" className="text-blue-600 hover:text-blue-500 font-medium">Need Help?</a>
        </div>
      </div>
    </div>
  );

  // Collapsible Card Component
  const CollapsibleCard = ({ title, step, totalSteps, isCompleted, isActive, isSkipped, canSkip, children, onSkip, onToggleCollapse }) => {
    const [isCollapsed, setIsCollapsed] = useState(!isActive && isCompleted);

    const handleToggleCollapse = () => {
      setIsCollapsed(!isCollapsed);
      onToggleCollapse?.();
    };

    return (
      <div className={`bg-white rounded-xl shadow-sm border transition-all duration-300 ${
        isActive ? 'border-blue-200 shadow-md' : 
        isSkipped ? 'border-gray-200 opacity-60' : 
        'border-gray-100'
      }`}>
        <div className="p-6 border-b border-gray-100 flex items-center justify-between cursor-pointer" onClick={handleToggleCollapse}>
          <div className="flex items-center space-x-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isCompleted ? 'bg-green-500' : 
              isActive ? 'bg-blue-500' : 
              isSkipped ? 'bg-gray-300' : 
              'bg-gray-200'
            }`}>
              {isCompleted ? (
                <Check className="w-5 h-5 text-white" />
              ) : isSkipped ? (
                <span className="text-white text-xs font-medium">S</span>
              ) : (
                <span className="text-white text-sm font-medium">{step}</span>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-500">Step {step} of {totalSteps}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {canSkip && !isCompleted && !isSkipped && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSkip?.();
                }}
                className="text-sm text-gray-500 hover:text-gray-700 font-medium flex items-center space-x-1"
              >
                <SkipForward className="w-4 h-4" />
                <span>Skip</span>
              </button>
            )}
            {isSkipped && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">Skipped</span>
            )}
            {isCollapsed ? (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </div>
        
        {!isCollapsed && (
          <div className="p-6">
            {children}
          </div>
        )}
        
        {isCollapsed && isCompleted && (
          <div className="p-4 bg-gray-50">
            <p className="text-sm text-gray-600">Section completed. Click to expand and edit.</p>
          </div>
        )}
      </div>
    );
  };

  // Travel Flow Component
  const TravelFlow = () => {
    const [activeStep, setActiveStep] = useState(1);
    const [completedSteps, setCompletedSteps] = useState([]);
    const [transportMethod, setTransportMethod] = useState('');
    const [vehicleOwnership, setVehicleOwnership] = useState('');
    const [roundTrip, setRoundTrip] = useState(false);

    const transportMethods = [
      { id: 'van', name: 'Van', icon: '🚐' },
      { id: 'rickshaw', name: 'Rickshaw', icon: '🛺' },
      { id: 'boat', name: 'Boat', icon: '🛥️' },
      { id: 'cng', name: 'CNG', icon: '🚗' },
      { id: 'train', name: 'Train', icon: '🚂' },
      { id: 'plane', name: 'Plane', icon: '✈️' }
    ];

    const handleStepComplete = (step) => {
      if (!completedSteps.includes(step)) {
        setCompletedSteps([...completedSteps, step]);
      }
      if (step < 4) {
        setActiveStep(step + 1);
      }
    };

    const handleSkipSection = (step) => {
      setSkippedSections({...skippedSections, [step]: true});
      if (step < 4) {
        setActiveStep(step + 1);
      }
    };

    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentView('expense-type')}
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
                      <Plus className="w-4 h-4" />
                      <span>Add Hotel Stay</span>
                    </button>
                  </div>
                  <p className="text-gray-600 text-sm">No accommodation added yet</p>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={() => setCurrentView('review')}
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
    );
  };

  // Maintenance Flow Component
  const MaintenanceFlow = () => {
    const [activeStep, setActiveStep] = useState(1);
    const [completedSteps, setCompletedSteps] = useState([]);
    const [maintenanceCategory, setMaintenanceCategory] = useState('');
    const [subCategory, setSubCategory] = useState('');
    const [vehicleType, setVehicleType] = useState('');
    const [equipmentPurchased, setEquipmentPurchased] = useState('');

    const handleStepComplete = (step) => {
      if (!completedSteps.includes(step)) {
        setCompletedSteps([...completedSteps, step]);
      }
      if (step < 4) {
        setActiveStep(step + 1);
      }
    };

    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentView('expense-type')}
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
                      setCompletedSteps([1]);
                      setActiveStep(2);
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
                        setCompletedSteps([1, 2]);
                        setActiveStep(3);
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
                          rows="3"
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
                          rows="3"
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
                          rows="3"
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

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Service Date</label>
                            <input
                              type="date"
                              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
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
                    onClick={() => {
                      setCompletedSteps([1, 2, 3]);
                      setCurrentView('review');
                    }}
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
    );
  };

  // Pending Approvals Component
  const PendingApprovals = () => (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Pending Approvals</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
          </div>
        </div>
      </header>

      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Expenses Awaiting Your Approval</h2>
              <div className="flex items-center space-x-4">
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  Bulk Approve
                </button>
                <button className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50">
                  Bulk Reject
                </button>
              </div>
            </div>
          </div>
          
          <div className="divide-y divide-gray-100">
            {[
              { 
                id: 'EXP-001', 
                employee: 'Sarah Chen', 
                type: 'Travel', 
                amount: '$1,245.50', 
                date: '2024-01-15', 
                description: 'Business trip to Chittagong',
                status: 'pending',
                urgent: true
              },
              { 
                id: 'EXP-002', 
                employee: 'Mike Johnson', 
                type: 'Maintenance', 
                amount: '$89.75', 
                date: '2024-01-14', 
                description: 'Vehicle fuel and maintenance',
                status: 'pending',
                urgent: false
              },
              { 
                id: 'EXP-003', 
                employee: 'Lisa Wang', 
                type: 'Requisition', 
                amount: '$156.25', 
                date: '2024-01-13', 
                description: 'Office supplies and equipment',
                status: 'pending',
                urgent: false
              }
            ].map((expense) => (
              <div key={expense.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600" />
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      expense.type === 'Travel' ? 'bg-blue-100' : 
                      expense.type === 'Maintenance' ? 'bg-green-100' : 
                      'bg-purple-100'
                    }`}>
                      {expense.type === 'Travel' && <Plane className="w-6 h-6 text-blue-600" />}
                      {expense.type === 'Maintenance' && <Wrench className="w-6 h-6 text-green-600" />}
                      {expense.type === 'Requisition' && <FileText className="w-6 h-6 text-purple-600" />}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900">{expense.id}</h3>
                        {expense.urgent && (
                          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                            Urgent
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{expense.employee} • {expense.date}</p>
                      <p className="text-sm text-gray-700 mt-1">{expense.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{expense.amount}</p>
                      <p className="text-sm text-gray-500">{expense.type}</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded hover:bg-green-200">
                        Approve
                      </button>
                      <button className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded hover:bg-red-200">
                        Reject
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Monthly Expenses Component
  const MonthlyExpenses = () => (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">This Month's Expenses</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <select className="px-4 py-2 border border-gray-300 rounded-lg">
              <option>January 2024</option>
              <option>December 2023</option>
              <option>November 2023</option>
            </select>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </header>

      <div className="p-6 max-w-7xl mx-auto">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                <p className="text-2xl font-bold text-gray-900">$2,450.00</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Travel</p>
                <p className="text-2xl font-bold text-gray-900">$1,240.00</p>
              </div>
              <Plane className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Maintenance</p>
                <p className="text-2xl font-bold text-gray-900">$780.00</p>
              </div>
              <Wrench className="w-6 h-6 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Requisition</p>
                <p className="text-2xl font-bold text-gray-900">$430.00</p>
              </div>
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Expenses List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Expense History</h2>
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                </button>
              </div>
            </div>
          </div>
          
          <div className="divide-y divide-gray-100">
            {[
              { 
                id: 'EXP-001', 
                type: 'Travel', 
                amount: '$1,245.50', 
                date: '2024-01-15', 
                description: 'Business trip to Chittagong',
                status: 'approved'
              },
              { 
                id: 'EXP-002', 
                type: 'Maintenance', 
                amount: '$89.75', 
                date: '2024-01-14', 
                description: 'Vehicle fuel and maintenance',
                status: 'pending'
              },
              { 
                id: 'EXP-003', 
                type: 'Travel', 
                amount: '$567.25', 
                date: '2024-01-13', 
                description: 'Client meeting in Sylhet',
                status: 'approved'
              },
              { 
                id: 'EXP-004', 
                type: 'Requisition', 
                amount: '$156.25', 
                date: '2024-01-12', 
                description: 'Office supplies and equipment',
                status: 'rejected'
              },
              { 
                id: 'EXP-005', 
                type: 'Maintenance', 
                amount: '$234.00', 
                date: '2024-01-10', 
                description: 'Equipment repairs and parts',
                status: 'approved'
              }
            ].map((expense) => (
              <div key={expense.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      expense.type === 'Travel' ? 'bg-blue-100' : 
                      expense.type === 'Maintenance' ? 'bg-green-100' : 
                      'bg-purple-100'
                    }`}>
                      {expense.type === 'Travel' && <Plane className="w-6 h-6 text-blue-600" />}
                      {expense.type === 'Maintenance' && <Wrench className="w-6 h-6 text-green-600" />}
                      {expense.type === 'Requisition' && <FileText className="w-6 h-6 text-purple-600" />}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900">{expense.id}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          expense.status === 'pending' ? 'bg-orange-100 text-orange-800' :
                          expense.status === 'approved' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{expense.date}</p>
                      <p className="text-sm text-gray-700 mt-1">{expense.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{expense.amount}</p>
                      <p className="text-sm text-gray-500">{expense.type}</p>
                    </div>
                    
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // User Profile Component
  const UserProfile = () => (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">User Profile</h1>
          </div>
        </div>
      </header>

      <div className="p-6 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="text-center">
              <img src="/api/placeholder/100/100" alt="User" className="w-24 h-24 rounded-full mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
              <p className="text-gray-600">{user?.role}</p>
              <p className="text-gray-500 text-sm mt-1">{user?.email}</p>
              
              <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Edit Profile
              </button>
            </div>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={user?.name || ''}
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={user?.email || ''}
                      readOnly
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value="Operations"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Employee ID</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value="EMP-001"
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Information</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Primary Vehicle</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value="Toyota Hiace (DHK-1234)"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">License Number</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value="DL-12345678"
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Limits</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Budget</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value="৳ 50,000"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Single Transaction Limit</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value="৳ 10,000"
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  const ReviewSubmission = () => (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCurrentView(expenseType === 'travel' ? 'travel-flow' : 'maintenance-flow')}
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
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  expenseType === 'travel' ? 'bg-blue-100' : 'bg-green-100'
                }`}>
                  {expenseType === 'travel' ? (
                    <Plane className={`w-6 h-6 ${expenseType === 'travel' ? 'text-blue-600' : 'text-green-600'}`} />
                  ) : (
                    <Wrench className="w-6 h-6 text-green-600" />
                  )}
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
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Car className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">Transportation</p>
                    <p className="text-sm text-gray-600">Van: Dhaka → Chittagong</p>
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
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">Food & Accommodation</p>
                    <p className="text-sm text-gray-600">3 meals, 1 night hotel</p>
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
              rows="4"
              placeholder="Please provide detailed business justification for this expense (minimum 200 characters)..."
              minLength={200}
            ></textarea>
            <p className="text-sm text-gray-500 mt-2">0 / 200 characters minimum</p>
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
                />
                <span className="text-gray-900">I confirm that all information provided is accurate and complete</span>
              </label>
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-900">I have attached all required receipts and documentation</span>
              </label>
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-900">This expense was necessary for legitimate business purposes</span>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-4">
            <button
              onClick={() => setCurrentView('confirmation')}
              className="flex-1 bg-blue-600 text-white py-4 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
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
  );

  // Confirmation Component
  const SubmissionConfirmation = () => (
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
            <p className="text-lg font-mono font-semibold text-gray-900">EXP-2024-001234</p>
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
              onClick={() => {
                setCurrentView('expense-type');
                setCurrentStep(1);
                setExpenseType('');
              }}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Submit Another Expense
            </button>
            <button
              onClick={() => setCurrentView('dashboard')}
              className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Back to Dashboard
            </button>
            <button className="w-full text-blue-600 py-2 px-4 font-medium hover:text-blue-500 flex items-center justify-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Render current view
  const renderCurrentView = () => {
    switch (currentView) {
      case 'login':
        return <LoginPanel />;
      case 'dashboard':
        return <Dashboard />;
      case 'expense-type':
        return <ExpenseTypeSelection />;
      case 'travel-flow':
        return <TravelFlow />;
      case 'maintenance-flow':
        return <MaintenanceFlow />;
      case 'review':
        return <ReviewSubmission />;
      case 'confirmation':
        return <SubmissionConfirmation />;
      case 'pending-approvals':
        return <PendingApprovals />;
      case 'monthly-expenses':
        return <MonthlyExpenses />;
      case 'profile':
        return <UserProfile />;
      default:
        return <LoginPanel />;
    }
  };

  return (
    <div className="font-sans antialiased" onClick={() => setShowProfileDropdown(false)}>
      {renderCurrentView()}
    </div>
  );
};

export default ExpenseSubmissionPlatform;