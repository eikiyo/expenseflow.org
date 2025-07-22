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
        
        // Add a small delay to allow Supabase to process OAuth callbacks
        if (typeof window !== 'undefined' && window.location.search.includes('code=')) {
          Logger.auth.info('OAuth callback detected, waiting for processing')
          await new Promise(resolve => setTimeout(resolve, 5000)) // Increased to 5 seconds
          Logger.auth.info('Delay completed, checking for session')
          
          // Explicitly handle OAuth callback for @supabase/ssr
          const urlParams = new URLSearchParams(window.location.search)
          const code = urlParams.get('code')
          const state = urlParams.get('state')
          
          if (code && state) {
            Logger.auth.info('Explicitly exchanging OAuth code for session')
            try {
              const { data, error } = await supabase.auth.exchangeCodeForSession(code)
              
              if (error) {
                Logger.auth.error('Failed to exchange code for session', {
                  message: error.message,
                  meta: { name: error.name }
                })
              } else if (data.session) {
                Logger.auth.info('Successfully exchanged code for session', {
                  meta: { userId: data.session.user.id }
                })
                setUser(data.session.user)
                setLoading(false)
                // Clean up URL
                window.history.replaceState({}, document.title, window.location.pathname)
                return
              }
            } catch (err: any) {
              Logger.auth.error('Error during code exchange', {
                message: err.message,
                meta: { error: err }
              })
            }
          }
        }
        
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          Logger.auth.error('Error getting session', { 
            message: error.message,
            meta: { name: error.name }
          })
          setLoading(false)
          return
        }

        if (session?.user) {
          Logger.auth.info('Found existing session', {
            meta: {
              userId: session.user.id,
              email: session.user.email,
              provider: session.user.app_metadata?.provider,
              lastSignIn: session.user.last_sign_in_at
            }
          })
          setUser(session.user)
        } else {
          Logger.auth.info('No existing session found')
          setUser(null)
        }
      } catch (error: any) {
        Logger.auth.error('Error initializing auth', { 
          message: error.message,
          meta: { name: error.name }
        })
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        Logger.auth.debug('Auth state changed', {
          meta: {
            event,
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
          Logger.auth.info('User not authenticated')
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