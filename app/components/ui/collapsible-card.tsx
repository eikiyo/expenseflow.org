'use client'

import React, { useState } from 'react'
import { Check, ChevronDown, ChevronUp, SkipForward } from 'lucide-react'

interface CollapsibleCardProps {
  title: string
  step: number
  totalSteps: number
  isCompleted: boolean
  isActive: boolean
  isSkipped?: boolean
  canSkip?: boolean
  children: React.ReactNode
  onSkip?: () => void
  onToggleCollapse?: () => void
}

export function CollapsibleCard({ 
  title, 
  step, 
  totalSteps, 
  isCompleted, 
  isActive, 
  isSkipped = false, 
  canSkip = false, 
  children, 
  onSkip, 
  onToggleCollapse 
}: CollapsibleCardProps) {
  const [isCollapsed, setIsCollapsed] = useState(!isActive && isCompleted)

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
    onToggleCollapse?.()
  }

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
                e.stopPropagation()
                onSkip?.()
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
  )
} 