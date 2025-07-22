/**
 * AUTH PROVIDER TESTS
 * 
 * Tests for the AuthProvider component to ensure proper authentication flow.
 * Verifies Google OAuth, session management, and user state handling.
 * 
 * Dependencies: @testing-library/react, @testing-library/jest-dom, @supabase/ssr
 * Used by: Jest test runner
 * 
 * @author ExpenseFlow Team
 * @since 2024-01-01
 */

import React from 'react'
import { renderHook, act, waitFor } from '@testing-library/react'
import { AuthProvider, useAuth } from '@/app/providers/auth-provider'
import { getSupabaseClient } from '@/lib/supabase'
import Logger from '@/app/utils/logger'

// Mock Supabase
jest.mock('@/lib/supabase', () => ({
  getSupabaseClient: jest.fn()
}))

// Mock Logger
jest.mock('@/app/utils/logger', () => ({
  auth: {
    info: jest.fn(),
    error: jest.fn(),
    debug: jest.fn()
  }
}))

const mockSupabase = {
  auth: {
    getSession: jest.fn(),
    onAuthStateChange: jest.fn(),
    signInWithOAuth: jest.fn(),
    signOut: jest.fn()
  }
}

const createWrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
)

describe('AuthProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(getSupabaseClient as jest.Mock).mockReturnValue(mockSupabase)
    
    // Mock successful subscription
    mockSupabase.auth.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: jest.fn() } }
    })
  })

  describe('Initial Authentication State', () => {
    it('should initialize with loading state', async () => {
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null
      })

      const { result } = renderHook(() => useAuth(), { wrapper: createWrapper })

      expect(result.current.loading).toBe(true)
      expect(result.current.user).toBe(null)
    })

    it('should detect existing session for returning user', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        app_metadata: { provider: 'google' },
        last_sign_in_at: '2024-01-01T00:00:00.000Z'
      }

      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: { user: mockUser } },
        error: null
      })

      const { result } = renderHook(() => useAuth(), { wrapper: createWrapper })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.user).toEqual(mockUser)
      expect(Logger.auth.info).toHaveBeenCalledWith('Found existing session', expect.any(Object))
    })

    it('should handle no existing session for new user', async () => {
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null
      })

      const { result } = renderHook(() => useAuth(), { wrapper: createWrapper })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.user).toBe(null)
      expect(Logger.auth.info).toHaveBeenCalledWith('No existing session found')
    })

    it('should handle OAuth callback processing', async () => {
      // Mock window.location with OAuth callback parameters
      Object.defineProperty(window, 'location', {
        value: { search: '?code=auth-code&state=auth-state' },
        writable: true
      })

      mockSupabase.auth.getSession.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => 
          resolve({ data: { session: null }, error: null }), 100)
        )
      )

      const { result } = renderHook(() => useAuth(), { wrapper: createWrapper })

      expect(result.current.loading).toBe(true)
      expect(Logger.auth.info).toHaveBeenCalledWith('OAuth callback detected, waiting for processing')

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      }, { timeout: 6000 })
    })
  })

  describe('Google Sign In', () => {
    it('should successfully initiate Google OAuth', async () => {
      mockSupabase.auth.signInWithOAuth.mockResolvedValue({
        data: { url: 'https://oauth.url' },
        error: null
      })

      const { result } = renderHook(() => useAuth(), { wrapper: createWrapper })

      await act(async () => {
        await result.current.signInWithGoogle()
      })

      expect(mockSupabase.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account'
          }
        }
      })
      expect(Logger.auth.info).toHaveBeenCalledWith('Initiating Google sign in')
    })

    it('should handle Google OAuth errors', async () => {
      const oauthError = new Error('OAuth failed')
      mockSupabase.auth.signInWithOAuth.mockRejectedValue(oauthError)

      const { result } = renderHook(() => useAuth(), { wrapper: createWrapper })

      await expect(result.current.signInWithGoogle()).rejects.toThrow('OAuth failed')
      expect(Logger.auth.error).toHaveBeenCalledWith('Google sign in failed', expect.any(Object))
    })
  })

  describe('Sign Out', () => {
    it('should successfully sign out user', async () => {
      mockSupabase.auth.signOut.mockResolvedValue({ error: null })

      const { result } = renderHook(() => useAuth(), { wrapper: createWrapper })

      await act(async () => {
        await result.current.signOut()
      })

      expect(mockSupabase.auth.signOut).toHaveBeenCalled()
      expect(result.current.user).toBe(null)
      expect(Logger.auth.info).toHaveBeenCalledWith('Signed out successfully')
    })

    it('should handle sign out errors', async () => {
      const signOutError = new Error('Sign out failed')
      mockSupabase.auth.signOut.mockRejectedValue(signOutError)

      const { result } = renderHook(() => useAuth(), { wrapper: createWrapper })

      await expect(result.current.signOut()).rejects.toThrow('Sign out failed')
      expect(Logger.auth.error).toHaveBeenCalledWith('Sign out failed', expect.any(Object))
    })
  })

  describe('Auth State Changes', () => {
    it('should handle successful authentication', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        app_metadata: { provider: 'google' }
      }

      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null
      })

      // Mock auth state change callback
      let authCallback: (event: string, session: any) => void
      mockSupabase.auth.onAuthStateChange.mockImplementation((callback) => {
        authCallback = callback
        return { data: { subscription: { unsubscribe: jest.fn() } } }
      })

      const { result } = renderHook(() => useAuth(), { wrapper: createWrapper })

      // Simulate successful auth
      act(() => {
        authCallback('SIGNED_IN', { user: mockUser })
      })

      expect(result.current.user).toEqual(mockUser)
      expect(Logger.auth.info).toHaveBeenCalledWith('User authenticated', expect.any(Object))
    })

    it('should handle authentication failure', async () => {
      mockSupabase.auth.getSession.mockResolvedValue({
        data: { session: null },
        error: null
      })

      let authCallback: (event: string, session: any) => void
      mockSupabase.auth.onAuthStateChange.mockImplementation((callback) => {
        authCallback = callback
        return { data: { subscription: { unsubscribe: jest.fn() } } }
      })

      const { result } = renderHook(() => useAuth(), { wrapper: createWrapper })

      act(() => {
        authCallback('SIGNED_OUT', null)
      })

      expect(result.current.user).toBe(null)
      expect(Logger.auth.info).toHaveBeenCalledWith('User not authenticated')
    })
  })
})