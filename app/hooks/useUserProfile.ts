/**
 * USER PROFILE HOOK
 * 
 * This hook manages user profile data and creation separately from authentication.
 * Handles profile creation for new users and fetching for existing users.
 * 
 * Dependencies: @/lib/supabase, react, @/app/providers/auth-provider
 * Used by: Main page component for profile management
 * 
 * @author ExpenseFlow Team
 * @since 2024-01-01
 */

import { useState, useEffect } from 'react'
import { getSupabaseClient } from '@/lib/supabase'
import { useAuth } from '@/app/providers/auth-provider'
import type { Profile } from '@/lib/supabase'

export function useUserProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(false)

  // Creates a new profile for first-time users
  // Returns the created profile or null if creation fails
  const createProfile = async (userData: any) => {
    if (!userData) return null

    const newProfile = {
      id: userData.id,
      email: userData.email,
      full_name: userData.user_metadata?.full_name || 'New User',
      role: 'user',
      expense_limit: 10000,
    }

    // Insert new profile using authenticated user context
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('profiles')
      .insert(newProfile)
      .select()
      .single()

    if (error) {
      console.error('Profile creation error:', error)
      return null
    }

    return data
  }

  // Fetches existing profile from database
  // Returns profile data or null if not found
  const fetchProfile = async (userId: string) => {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Profile fetch error:', error)
      return null
    }

    return data
  }

  useEffect(() => {
    if (!user) {
      setProfile(null)
      return
    }

    const loadProfile = async () => {
      setLoading(true)
      
      // Try to fetch existing profile
      let userProfile = await fetchProfile(user.id)
      
      // Create profile if it doesn't exist
      if (!userProfile) {
        userProfile = await createProfile(user)
      }
      
      setProfile(userProfile)
      setLoading(false)
    }

    loadProfile()
  }, [user])

  return { profile, loading }
} 