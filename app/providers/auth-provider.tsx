'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase, type ExpenseUser, getUserProfile, createUserProfile } from '@/lib/supabase'

interface User {
  id: string
  email?: string
  user_metadata?: any
}

interface AuthContextType {
  user: User | null
  userProfile: ExpenseUser | null
  loading: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<ExpenseUser | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshProfile = async () => {
    if (user) {
      const profile = await getUserProfile(user.id)
      setUserProfile(profile)
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      setUser(null)
      setUserProfile(null)
    } catch (err) {
      console.error('Error signing out:', err)
    }
  }

  const handleUserSession = async (session: any) => {
    if (session?.user) {
      setUser(session.user)
      
      // Try to get existing profile
      let profile = await getUserProfile(session.user.id)
      
      // If no profile exists, create one from Google OAuth data
      if (!profile) {
        console.log('Creating new user profile for:', session.user.email)
        try {
          profile = await createUserProfile(session.user)
          if (!profile) {
            console.error('Failed to create user profile - RLS policy issue')
            // Don't set userProfile to null here to prevent infinite loop
            return
          }
        } catch (error) {
          console.error('Error creating user profile:', error)
          // Don't set userProfile to null here to prevent infinite loop
          return
        }
      }
      
      setUserProfile(profile)
    } else {
      setUser(null)
      setUserProfile(null)
    }
  }

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        await handleUserSession(session)
      } catch (error) {
        console.error('Error getting initial session:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          console.log('Auth state changed:', event, session?.user?.email)
          await handleUserSession(session)
        } catch (error) {
          console.error('Error handling auth state change:', error)
        } finally {
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const value = {
    user,
    userProfile,
    loading,
    signOut,
    refreshProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 