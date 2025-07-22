import React, { useState } from 'react';
import { Bell, ChevronDown, DollarSign, User } from 'lucide-react';
import Image from 'next/image';
import { ExpenseUser } from '@/lib/supabase';

interface HeaderProps {
  userProfile: ExpenseUser;
  onSignOut: () => void;
  onViewProfile: () => void;
  onViewSettings: () => void;
}

export function Header({ userProfile, onSignOut, onViewProfile, onViewSettings }: HeaderProps) {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [logoError, setLogoError] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            {!logoError ? (
              <Image 
                src="/logo.svg" 
                alt="ExpenseFlow Logo" 
                width={24} 
                height={24}
                onError={() => setLogoError(true)}
              />
            ) : (
              <DollarSign className="w-6 h-6 text-white" />
            )}
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
              <p className="text-sm font-medium text-gray-900">{userProfile.full_name}</p>
              <p className="text-xs text-gray-500">{userProfile.role}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-500" />
            
            {showProfileDropdown && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-50">
                <div className="py-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewProfile();
                      setShowProfileDropdown(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewSettings();
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
                      onSignOut();
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
  );
} 