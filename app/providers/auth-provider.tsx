/**
 * SIMPLIFIED AUTH PROVIDER
 * 
 * This component manages only authentication state with Google OAuth.
 * Profile management is handled separately by useUserProfile hook.
 * 
 * Dependencies: @/lib/supabase, react, @/utils/logger
 * Used by: Root layout client
 * 
 * @author ExpenseFlow Team
 * @since 2024-01-01
 */

'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { getSupabaseClient } from '@/lib/supabase'
import { getBaseUrl } from '@/lib/config'
import Logger from '@/app/utils/logger'

interface User {
  id: string
  email?: string
  user_metadata?: any
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const signInWithGoogle = async () => {
    Logger.auth.info('Initiating Google sign in')
    const supabase = getSupabaseClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${getBaseUrl()}/`,
        queryParams: {
          access_type: 'offline',
          prompt: 'select_account'
        }
      }
    })
    if (error) {
      Logger.auth.error('Google sign in failed', { 
        message: error.message,
        meta: { name: error.name }
      })
      throw error
    }
    Logger.auth.debug('OAuth redirect initiated')
  }

  const signOut = async () => {
    Logger.auth.info('Signing out')
    const supabase = getSupabaseClient()
    const { error } = await supabase.auth.signOut()
    if (error) {
      Logger.auth.error('Sign out failed', { 
        message: error.message,
        meta: { name: error.name }
      })
      throw error
    }
    setUser(null)
    Logger.auth.info('Signed out successfully')
  }

  useEffect(() => {
    const supabase = getSupabaseClient()
    
    // Get initial session
    const initializeAuth = async () => {
      try {
        Logger.auth.info('Getting initial session')
        
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          Logger.auth.error('Error getting session', { meta: { error } })
        } else if (session) {
          Logger.auth.info('Initial session found', {
            meta: {
              userId: session.user.id,
              email: session.user.email
            }
          })
          setUser(session.user)
        } else {
          Logger.auth.info('No initial session found')
        }
      } catch (error: any) {
        Logger.auth.error('Error in initializeAuth', { meta: { error } })
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        Logger.auth.info('Auth state changed', {
          meta: {
            event,
        hasSession: !!session,
        userId: session?.user?.id,
            email: session?.user?.email,
            provider: session?.user?.app_metadata?.provider,
            lastSignIn: session?.user?.last_sign_in_at
          }
        })
      
      if (session?.user) {
          Logger.auth.info('User authenticated', {
            meta: {
              userId: session.user.id,
              email: session.user.email,
              provider: session.user.app_metadata?.provider,
              lastSignIn: session.user.last_sign_in_at
            }
          })
          setUser(session.user)
      } else {
          Logger.auth.info('User not authenticated', {
            meta: { event }
          })
          setUser(null)
        }
        setLoading(false)
      }
    )

    return () => {
      Logger.auth.debug('Cleaning up auth subscriptions')
      subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 