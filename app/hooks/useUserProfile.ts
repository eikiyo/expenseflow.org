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
  const [loading, setLoading] = useState(true) // Start with loading true

  // Fetches existing profile from database
  // The profile is now created automatically by a database trigger
  // on new user signup (handle_new_user function).
  const fetchProfile = async (userId: string) => {
    Logger.db.info('Fetching user profile', { meta: { userId } })
    
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      // If profile doesn't exist, log it but don't automatically create
      if (error.code === 'PGRST116') {
        Logger.db.warn('Profile not found for user. It should have been created by a trigger.', { 
          meta: { userId } 
        })
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
      setLoading(false)
      return
    }

    let isCancelled = false;
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
        const userProfile = await fetchProfile(user.id)
        
        if (!isCancelled) {
          setProfile(userProfile)
        }
      } catch (error: any) {
        Logger.db.error('Error loading profile', { 
          message: error.message,
          meta: { userId: user.id }
        })
      } finally {
        if (!isCancelled) {
          setLoading(false)
        }
      }
    }

    loadProfile()

    return () => {
      isCancelled = true;
    }
  }, [user])

  return { profile, loading }
} 