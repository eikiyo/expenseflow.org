/**
 * USER PROFILE HOOK
 * 
 * This hook manages user profile data and creation separately from authentication.
 * Handles profile creation for new users and fetching for existing users.
 * 
 * Dependencies: @/lib/supabase, react, @/app/providers/auth-provider, @/utils/logger
 * Used by: Main page component for profile management
 * 
 * @author ExpenseFlow Team
 * @since 2024-01-01
 */

import { useState, useEffect } from 'react'
import { getSupabaseClient } from '@/lib/supabase'
import { useAuth } from '@/app/providers/auth-provider'
import type { Profile } from '@/lib/supabase'
import Logger from '@/app/utils/logger'

export function useUserProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(false)

  // Creates or updates a user profile
  // Returns the profile or null if operation fails
  const createProfile = async (userData: any) => {
    if (!userData) return null

    const now = new Date().toISOString()
    const profileData = {
      id: userData.id,
      email: userData.email || '',
      full_name: userData.user_metadata?.full_name || userData.email?.split('@')[0] || 'New User',
      avatar_url: userData.user_metadata?.avatar_url || null,
      department: null,
      role: 'user',
      manager_id: null,
      expense_limit: 10000,
      created_at: now,
      updated_at: now
    }

    Logger.db.info('Upserting user profile', {
      meta: {
        userId: userData.id,
        email: userData.email,
        metadata: userData.user_metadata
      }
    })

    // Use upsert to handle both insert and update cases
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('profiles')
      .upsert(profileData, {
        onConflict: 'id',
        ignoreDuplicates: false
      })
      .select()
      .single()

    if (error) {
      Logger.db.error('Profile upsert failed', {
        message: error.message,
        meta: {
          code: error.code,
          details: error.details,
          hint: error.hint
        }
      })
      return null
    }

    Logger.db.info('Profile upserted successfully', { meta: { id: data?.id } })
    return data
  }

  // Fetches existing profile from database
  // Returns profile data or null if not found
  const fetchProfile = async (userId: string) => {
    Logger.db.info('Fetching user profile', { meta: { userId } })
    
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      // If profile doesn't exist, that's expected for new users
      if (error.code === 'PGRST116') {
        Logger.db.info('No existing profile found - will create new one')
      } else {
        Logger.db.error('Profile fetch failed', {
          message: error.message,
          meta: {
            code: error.code,
            details: error.details,
            hint: error.hint
          }
        })
      }
      return null
    }

    Logger.db.info('Found existing profile', { meta: { id: data?.id } })
    return data
  }

  useEffect(() => {
    if (!user) {
      setProfile(null)
      return
    }

    const loadProfile = async () => {
      setLoading(true)
      
      try {
        Logger.db.debug('Loading profile for user', {
          meta: {
            userId: user.id,
            email: user.email
          }
        })

        // Try to fetch existing profile
        let userProfile = await fetchProfile(user.id)
        
        // Create/update profile if needed
        if (!userProfile) {
          userProfile = await createProfile(user)
        }
        
        setProfile(userProfile)
      } catch (error: any) {
        Logger.db.error('Error loading profile', { 
          message: error.message,
          meta: { userId: user.id }
        })
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [user])

  return { profile, loading }
} 