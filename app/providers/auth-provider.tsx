'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase, type ExpenseUser, getUserProfile } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email?: string
}

interface AuthContextType {
  user: User | null
  userProfile: ExpenseUser | null
  loading: boolean
  error: string | null
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<ExpenseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refreshProfile = async () => {
    if (user) {
      try {
        const profile = await getUserProfile(user.id)
        if (!profile) {
          setError('Failed to load user profile')
          return
        }
        setUserProfile(profile)
        setError(null)
      } catch (err) {
        setError('An error occurred while loading your profile')
        console.error('Profile refresh error:', err)
      }
    }
  }

  const signOut = async () => {
    try {
      const { error: signOutError } = await supabase.auth.signOut()
      if (signOutError) throw signOutError
      
      setUser(null)
      setUserProfile(null)
      setError(null)
      router.push('/')
    } catch (err) {
      setError('Failed to sign out')
      console.error('Sign out error:', err)
    }
  }

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        if (sessionError) throw sessionError

        setUser(session?.user ?? null)
        
        if (session?.user) {
          const profile = await getUserProfile(session.user.id)
          if (!profile) {
            setError('Failed to load user profile')
            return
          }
          setUserProfile(profile)
          setError(null)
        }
      } catch (err) {
        setError('Failed to initialize session')
        console.error('Session initialization error:', err)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          setUser(session?.user ?? null)
          
          if (session?.user) {
            const profile = await getUserProfile(session.user.id)
            if (!profile) {
              setError('Failed to load user profile')
              return
            }
            setUserProfile(profile)
            setError(null)
          } else {
            setUserProfile(null)
            setError(null)
          }
        } catch (err) {
          setError('An error occurred while updating your session')
          console.error('Auth state change error:', err)
        } finally {
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [router])

  const value = {
    user,
    userProfile,
    loading,
    error,
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