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

    const now = new Date().toISOString()
    const newProfile = {
      id: userData.id,
      email: userData.email,
      full_name: userData.user_metadata?.full_name || 'New User',
      avatar_url: userData.user_metadata?.avatar_url || null,
      department: null,
      role: 'user',
      manager_id: null,
      expense_limit: 10000,
      created_at: now,
      updated_at: now
    }

    console.log('🆕 Creating new user profile:', {
      userId: userData.id,
      email: userData.email,
      metadata: userData.user_metadata
    })

    // Insert new profile using authenticated user context
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('profiles')
      .insert(newProfile)
      .select()
      .single()

    if (error) {
      console.error('❌ Profile creation error:', error)
      return null
    }

    console.log('✅ Profile created successfully:', data)
    return data
  }

  // Fetches existing profile from database
  // Returns profile data or null if not found
  const fetchProfile = async (userId: string) => {
    console.log('🔍 Fetching user profile:', userId)
    
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      // If profile doesn't exist, that's expected for new users
      if (error.code === 'PGRST116') {
        console.log('ℹ️ No existing profile found - will create new one')
      } else {
        console.error('❌ Profile fetch error:', error)
      }
      return null
    }

    console.log('✅ Found existing profile:', data)
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