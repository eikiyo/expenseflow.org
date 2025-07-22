/**
 * USER PROFILE HOOK TESTS
 * 
 * Tests for the useUserProfile hook to ensure proper profile management.
 * Verifies profile creation for new users and fetching for existing users.
 * 
 * Dependencies: @testing-library/react, @testing-library/jest-dom
 * Used by: Jest test runner
 * 
 * @author ExpenseFlow Team
 * @since 2024-01-01
 */

import React from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import { useUserProfile } from '@/app/hooks/useUserProfile'
import { useAuth } from '@/app/providers/auth-provider'
import { getSupabaseClient } from '@/lib/supabase'
import Logger from '@/app/utils/logger'

// Mock dependencies
jest.mock('@/app/providers/auth-provider')
jest.mock('@/lib/supabase')
jest.mock('@/app/utils/logger')

describe('useUserProfile', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('New User Profile Creation', () => {
    it('should create profile for new Google user', async () => {
      const mockUser = {
        id: 'new-user-123',
        email: 'newuser@gmail.com',
        user_metadata: {
          full_name: 'John Doe',
          avatar_url: 'https://avatar.url'
        }
      }

      ;(useAuth as jest.Mock).mockReturnValue({
        user: mockUser
      })

      // Create a simpler mock that directly returns the expected results
      const mockFrom = jest.fn()
      const mockSelect = jest.fn()
      const mockEq = jest.fn()
      const mockSingle = jest.fn()
      const mockUpsert = jest.fn()

      mockFrom.mockReturnValue({
        select: mockSelect,
        upsert: mockUpsert
      })

      mockSelect.mockReturnValue({
        eq: mockEq
      })

      mockEq.mockReturnValue({
        single: mockSingle
      })

      mockUpsert.mockReturnValue({
        select: mockSelect
      })

      // First call (fetchProfile) - returns not found error
      mockSingle.mockRejectedValueOnce({ code: 'PGRST116' })

      // Second call (createProfile) - returns success
      const createdProfile = {
        id: 'new-user-123',
        email: 'newuser@gmail.com',
        full_name: 'John Doe',
        avatar_url: 'https://avatar.url',
        department: null,
        role: 'user',
        manager_id: null,
        expense_limit: 10000,
        employee_id: 'EMP1234567890',
        phone: null,
        address: null,
        monthly_budget: 50000,
        single_transaction_limit: 10000,
        profile_picture_url: 'https://avatar.url',
        is_active: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }

      mockSingle.mockResolvedValueOnce({ data: createdProfile, error: null })

      ;(getSupabaseClient as jest.Mock).mockReturnValue({
        from: mockFrom
      })

      const { result } = renderHook(() => useUserProfile())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.profile).toEqual(createdProfile)
      expect(Logger.db.info).toHaveBeenCalledWith('No existing profile found - will create new one')
      expect(Logger.db.info).toHaveBeenCalledWith('Profile upserted successfully', expect.any(Object))
    })

    it('should handle profile creation errors', async () => {
      const mockUser = {
        id: 'error-user-123',
        email: 'error@gmail.com'
      }

      ;(useAuth as jest.Mock).mockReturnValue({
        user: mockUser
      })

      // Create mock structure
      const mockFrom = jest.fn()
      const mockSelect = jest.fn()
      const mockEq = jest.fn()
      const mockSingle = jest.fn()
      const mockUpsert = jest.fn()

      mockFrom.mockReturnValue({
        select: mockSelect,
        upsert: mockUpsert
      })

      mockSelect.mockReturnValue({
        eq: mockEq
      })

      mockEq.mockReturnValue({
        single: mockSingle
      })

      mockUpsert.mockReturnValue({
        select: mockSelect
      })

      // Mock profile fetch failure (not found) - this is the fetchProfile call
      mockSingle.mockRejectedValueOnce({ code: 'PGRST116' })

      // Mock profile creation failure - this is the createProfile call
      const upsertError = new Error('Database connection failed')
      mockSingle.mockRejectedValueOnce(upsertError)

      ;(getSupabaseClient as jest.Mock).mockReturnValue({
        from: mockFrom
      })

      const { result } = renderHook(() => useUserProfile())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.profile).toBe(null)
      // The hook catches all errors in a try-catch block, so it logs "Error loading profile"
      expect(Logger.db.error).toHaveBeenCalledWith('Error loading profile', expect.any(Object))
    })
  })

  describe('Existing User Profile Fetching', () => {
    it('should fetch existing user profile', async () => {
      const mockUser = {
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
        expense_limit: 15000,
        employee_id: 'EMP1234567890',
        phone: null,
        address: null,
        monthly_budget: 50000,
        single_transaction_limit: 10000,
        profile_picture_url: null,
        is_active: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }

      ;(useAuth as jest.Mock).mockReturnValue({
        user: mockUser
      })

      // Create mock structure
      const mockFrom = jest.fn()
      const mockSelect = jest.fn()
      const mockEq = jest.fn()
      const mockSingle = jest.fn()

      mockFrom.mockReturnValue({
        select: mockSelect
      })

      mockSelect.mockReturnValue({
        eq: mockEq
      })

      mockEq.mockReturnValue({
        single: mockSingle
      })

      // Mock successful profile fetch
      mockSingle.mockResolvedValueOnce({ data: existingProfile, error: null })

      ;(getSupabaseClient as jest.Mock).mockReturnValue({
        from: mockFrom
      })

      const { result } = renderHook(() => useUserProfile())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.profile).toEqual(existingProfile)
      expect(Logger.db.info).toHaveBeenCalledWith('Found existing profile', expect.any(Object))
    })

    it('should handle profile fetch database errors', async () => {
      const mockUser = {
        id: 'error-fetch-user-123',
        email: 'errorfetch@gmail.com'
      }

      ;(useAuth as jest.Mock).mockReturnValue({
        user: mockUser
      })

      // Create mock structure
      const mockFrom = jest.fn()
      const mockSelect = jest.fn()
      const mockEq = jest.fn()
      const mockSingle = jest.fn()

      mockFrom.mockReturnValue({
        select: mockSelect
      })

      mockSelect.mockReturnValue({
        eq: mockEq
      })

      mockEq.mockReturnValue({
        single: mockSingle
      })

      // Mock database error (not a "not found" error)
      const dbError = { code: 'CONNECTION_ERROR', message: 'Connection timeout' }
      mockSingle.mockRejectedValueOnce(dbError)

      ;(getSupabaseClient as jest.Mock).mockReturnValue({
        from: mockFrom
      })

      const { result } = renderHook(() => useUserProfile())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.profile).toBe(null)
      // The hook catches all errors in a try-catch block, so it logs "Error loading profile"
      expect(Logger.db.error).toHaveBeenCalledWith('Error loading profile', expect.any(Object))
    })
  })

  describe('No User Scenarios', () => {
    it('should handle no authenticated user', async () => {
      ;(useAuth as jest.Mock).mockReturnValue({
        user: null
      })

      const { result } = renderHook(() => useUserProfile())

      expect(result.current.loading).toBe(false)
      expect(result.current.profile).toBe(null)
    })

    it('should reset profile when user logs out', async () => {
      // Start with a user
      const mockUser = {
        id: 'user-123',
        email: 'test@gmail.com'
      }

      const { rerender } = renderHook(() => useUserProfile())

      // Mock user logging out
      ;(useAuth as jest.Mock).mockReturnValue({
        user: null
      })

      rerender()

      const { result } = renderHook(() => useUserProfile())
      
      expect(result.current.profile).toBe(null)
      expect(result.current.loading).toBe(false)
    })
  })
})