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
    const supabase = getSupabaseClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      }
    })
    if (error) throw error
  }

  const signOut = async () => {
    const supabase = getSupabaseClient()
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    setUser(null)
  }

  useEffect(() => {
    const supabase = getSupabaseClient()
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
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