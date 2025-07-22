/**
 * AUTH ERROR BOUNDARY TESTS
 * 
 * Tests for the AuthErrorBoundary component to ensure proper error handling.
 * 
 * Dependencies: @testing-library/react, @testing-library/jest-dom
 * Used by: Jest test runner
 * 
 * @author ExpenseFlow Team
 * @since 2024-01-01
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import { AuthErrorBoundary } from '@/app/components/auth/AuthErrorBoundary'

// Mock component that throws an error
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error')
  }
  return <div>No error</div>
}

describe('AuthErrorBoundary', () => {
  beforeEach(() => {
    // Suppress console.error for expected errors in tests
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders children when no error occurs', () => {
    render(
      <AuthErrorBoundary>
        <ThrowError shouldThrow={false} />
      </AuthErrorBoundary>
    )

    expect(screen.getByText('No error')).toBeInTheDocument()
  })

  it('renders error fallback when error occurs', () => {
    render(
      <AuthErrorBoundary>
        <ThrowError shouldThrow={true} />
      </AuthErrorBoundary>
    )

    expect(screen.getByText(/Authentication Error/i)).toBeInTheDocument()
    expect(screen.getByText(/An unexpected error occurred/i)).toBeInTheDocument()
  })

  it('provides retry functionality', () => {
    render(
      <AuthErrorBoundary>
        <ThrowError shouldThrow={true} />
      </AuthErrorBoundary>
    )

    const retryButton = screen.getByRole('button', { name: /try again/i })
    expect(retryButton).toBeInTheDocument()
    
    const homeButton = screen.getByRole('button', { name: /return home/i })
    expect(homeButton).toBeInTheDocument()
  })

  it('logs error information', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    
    render(
      <AuthErrorBoundary>
        <ThrowError shouldThrow={true} />
      </AuthErrorBoundary>
    )

    expect(consoleSpy).toHaveBeenCalled()
  })
}) 