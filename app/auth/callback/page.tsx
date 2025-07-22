/**
 * OAUTH CALLBACK PAGE
 * 
 * Client-side page that handles the OAuth callback.
 * Lets Supabase handle the OAuth flow automatically.
 * 
 * Dependencies: @/lib/supabase, next/navigation
 * Used by: OAuth flow
 * 
 * @author ExpenseFlow Team
 * @since 2024-01-01
 */

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase'
import { LoadingSpinner } from '@/app/components/ui/loading-spinner'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    // Let Supabase handle the OAuth flow automatically
    const supabase = getSupabaseClient()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔄 Auth state changed:', event)

      if (event === 'SIGNED_IN' && session) {
        console.log('✅ Successfully signed in')
        router.push('/')
      } else if (event === 'SIGNED_OUT') {
        console.log('❌ Sign in failed or user signed out')
        router.push('/?auth_error=sign_in_failed')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600">Completing sign in...</p>
      </div>
    </div>
  )
} 