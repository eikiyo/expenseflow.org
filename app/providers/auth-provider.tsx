/**
 * SIMPLIFIED AUTH PROVIDER
 * 
 * This component manages only authentication state with Google OAuth.
 * Profile management is handled separately by useUserProfile hook.
 * 
 * Dependencies: @/lib/supabase, react
 * Used by: Root layout client
 * 
 * @author ExpenseFlow Team
 * @since 2024-01-01
 */

'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { getSupabaseClient } from '@/lib/supabase'

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
    console.log('🔄 Initiating Google sign in...')
    const supabase = getSupabaseClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'select_account'
        }
      }
    })
    if (error) {
      console.error('❌ Google sign in error:', error)
      throw error
    }
  }

  const signOut = async () => {
    console.log('🔄 Signing out...')
    const supabase = getSupabaseClient()
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('❌ Sign out error:', error)
      throw error
    }
    setUser(null)
    console.log('✅ Signed out successfully')
  }

  useEffect(() => {
    const supabase = getSupabaseClient()
    
    // Get initial session
    const initializeAuth = async () => {
      try {
        console.log('🔄 Getting initial session...')
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('❌ Error getting session:', error)
          setLoading(false)
          return
        }

        if (session?.user) {
          console.log('✅ Found existing session:', {
            userId: session.user.id,
            email: session.user.email
          })
          setUser(session.user)
        } else {
          console.log('ℹ️ No existing session found')
          setUser(null)
        }
      } catch (error) {
        console.error('❌ Error initializing auth:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', {
          event,
          userId: session?.user?.id,
          email: session?.user?.email
        })

        if (session?.user) {
          console.log('✅ User authenticated:', {
            userId: session.user.id,
            email: session.user.email
          })
          setUser(session.user)
        } else {
          console.log('ℹ️ User not authenticated')
          setUser(null)
        }
        setLoading(false)
      }
    )

    return () => {
      console.log('🧹 Cleaning up auth subscriptions')
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