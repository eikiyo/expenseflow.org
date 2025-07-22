/**
 * AUTH AND PROFILE INTEGRATION TESTS
 * 
 * End-to-end integration tests for the complete auth + profile flow.
 * Tests the full user journey from login to profile access.
 * 
 * Dependencies: @testing-library/react, @testing-library/jest-dom
 * Used by: Jest test runner
 * 
 * @author ExpenseFlow Team
 * @since 2024-01-01
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AuthProvider } from '@/app/providers/auth-provider'
import { LoginForm } from '@/app/components/auth/login-form'
import { Dashboard } from '@/app/components/dashboard/dashboard'
import ExpenseApp from '@/app/page'
import { getSupabaseClient } from '@/lib/supabase'

// Mock Supabase
jest.mock('@/lib/supabase')

// Mock useUserProfile hook
jest.mock('@/app/hooks/useUserProfile', () => ({
  useUserProfile: jest.fn()
}))

import { useUserProfile } from '@/app/hooks/useUserProfile'

const mockSupabase = {
  auth: {
    getSession: jest.fn(),
    onAuthStateChange: jest.fn(),
    signInWithOAuth: jest.fn(),
    signOut: jest.fn()
  }
}

describe('Auth and Profile Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(getSupabaseClient as jest.Mock).mockReturnValue(mockSupabase)
    
    mockSupabase.auth.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: jest.fn() } }
    })

    // Clear any URL parameters
    Object.defineProperty(window, 'location', {
      value: { search: '', pathname: '/', origin: 'http://localhost:3000' },
      writable: true
    })
  })

  describe('New User Complete Flow', () => {
    it('should handle complete flow for new user from login to dashboard', async () => {
      // Step 1: Start with no session (new user)
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null
      })

      ;(useUserProfile as jest.Mock).mockReturnValue({
        profile: null,
        loading: true
      })

      // Render the app
      render(<ExpenseApp />)

      // Should show login form
      expect(screen.getByText('Sign in to continue')).toBeInTheDocument()
      expect(screen.getByText('Continue with Google')).toBeInTheDocument()

      // Step 2: Mock successful OAuth initiation
      mockSupabase.auth.signInWithOAuth.mockResolvedValue({
        data: { url: 'https://oauth.url' },
        error: null
      })

      const signInButton = screen.getByText('Continue with Google')
      fireEvent.click(signInButton)

      await waitFor(() => {
        expect(mockSupabase.auth.signInWithOAuth).toHaveBeenCalled()
      })

      // Step 3: Simulate OAuth callback with new user
      const newUser = {
        id: 'new-user-123',
        email: 'newuser@gmail.com',
        user_metadata: {
          full_name: 'John Doe',
          avatar_url: 'https://avatar.url'
        }
      }

      // Mock auth state change to signed in
      let authCallback: ((event: string, session: any) => void) | undefined
      mockSupabase.auth.onAuthStateChange.mockImplementation((callback) => {
        authCallback = callback
        return { data: { subscription: { unsubscribe: jest.fn() } } }
      })

      // Re-render with authenticated user
      const { rerender } = render(<ExpenseApp />)
      // Simulate auth state change for new user sign-in
      // Ensures callback is assigned before invocation to avoid runtime errors
      expect(typeof authCallback).toBe('function')
      if (authCallback) {
        authCallback('SIGNED_IN', { user: newUser })
      }

      // Step 4: Mock profile creation for new user
      const newProfile = {
        id: 'new-user-123',
        email: 'newuser@gmail.com',
        full_name: 'John Doe',
        avatar_url: 'https://avatar.url',
        department: null,
        role: 'user',
        manager_id: null,
        expense_limit: 10000
      }

      ;(useUserProfile as jest.Mock).mockReturnValue({
        profile: newProfile,
        loading: false
      })

      rerender(<ExpenseApp />)

      // Should show dashboard
      await waitFor(() => {
        expect(screen.getByText('ExpenseFlow')).toBeInTheDocument()
        expect(screen.getByText('Quick Actions')).toBeInTheDocument()
      })
    })

    it('should show profile setup loading state for new user', async () => {
      const newUser = {
        id: 'new-user-456',
        email: 'newuser2@gmail.com'
      }

      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: { user: newUser } },
        error: null
      })

      // Mock profile still being created
      ;(useUserProfile as jest.Mock).mockReturnValue({
        profile: null,
        loading: true
      })

      render(<ExpenseApp />)

      expect(screen.getByText('Setting up your profile...')).toBeInTheDocument()
    })
  })

  describe('Existing User Flow', () => {
    it('should handle returning user with existing profile', async () => {
      const existingUser = {
        id: 'existing-user-123',
        email: 'existing@gmail.com'
      }

      const existingProfile = {
        id: 'existing-user-123',
        email: 'existing@gmail.com',
        full_name: 'Jane Smith',
        avatar_url: null,
        department: 'Engineering',
        role: 'user',
        manager_id: 'manager-123',
        expense_limit: 15000
      }

      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: { user: existingUser } },
        error: null
      })

      ;(useUserProfile as jest.Mock).mockReturnValue({
        profile: existingProfile,
        loading: false
      })

      render(<ExpenseApp />)

      // Should go straight to dashboard
      await waitFor(() => {
        expect(screen.getByText('ExpenseFlow')).toBeInTheDocument()
        expect(screen.queryByText('Sign in to continue')).not.toBeInTheDocument()
      })
    })
  })

  describe('Error Scenarios', () => {
    it('should handle OAuth callback errors', async () => {
      // Mock OAuth error in URL
      Object.defineProperty(window, 'location', {
        value: { 
          search: '?error=access_denied&error_description=User denied access',
          pathname: '/',
          origin: 'http://localhost:3000'
        },
        writable: true
      })

      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null
      })

      ;(useUserProfile as jest.Mock).mockReturnValue({
        profile: null,
        loading: false
      })

      render(<ExpenseApp />)

      expect(screen.getByText('Sign in failed')).toBeInTheDocument()
      expect(screen.getByText(/OAuth error: access_denied/)).toBeInTheDocument()
    })

    it('should handle network connection errors', async () => {
      mockSupabase.auth.getSession.mockRejectedValue(new Error('Network error'))

      ;(useUserProfile as jest.Mock).mockReturnValue({
        profile: null,
        loading: false
      })

      render(<ExpenseApp />)

      // Should still show login form as fallback
      await waitFor(() => {
        expect(screen.getByText('Sign in to continue')).toBeInTheDocument()
      })
    })

    it('should handle Supabase service errors', async () => {
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: { message: 'Service temporarily unavailable' }
      })

      ;(useUserProfile as jest.Mock).mockReturnValue({
        profile: null,
        loading: false
      })

      render(<ExpenseApp />)

      await waitFor(() => {
        expect(screen.getByText('Sign in to continue')).toBeInTheDocument()
      })
    })
  })
})