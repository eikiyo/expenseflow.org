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

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase'
import { LoadingSpinner } from '@/app/components/ui/loading-spinner'
import Logger from '@/app/utils/logger'

export default function AuthCallback() {
  const router = useRouter()
  const [status, setStatus] = useState('Processing OAuth callback...')

  useEffect(() => {
    Logger.auth.info('OAuth callback page loaded', {
      meta: {
        url: window.location.href,
        searchParams: window.location.search,
        hash: window.location.hash
      }
    })

    // Let Supabase handle the OAuth flow automatically
    const supabase = getSupabaseClient()

    // Check if we have OAuth parameters
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    const error = urlParams.get('error')
    const errorDescription = urlParams.get('error_description')

    if (error) {
      Logger.auth.error('OAuth error received', {
        meta: { error, errorDescription }
      })
      setStatus(`OAuth error: ${error}`)
      setTimeout(() => {
        router.push('/?auth_error=oauth_error&message=' + encodeURIComponent(errorDescription || error))
      }, 2000)
      return
    }

    if (!code) {
      Logger.auth.warn('No OAuth code found in callback')
      setStatus('No OAuth code found')
      setTimeout(() => {
        router.push('/?auth_error=no_code')
      }, 2000)
      return
    }

    Logger.auth.info('OAuth code found, waiting for automatic processing', {
      meta: { codeLength: code.length }
    })
    setStatus('OAuth code received, processing automatically...')

    // Let Supabase handle the OAuth flow automatically
    // This will use the stored PKCE code verifier from the initial request
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      Logger.auth.info('Auth state changed in callback', {
        meta: { event, hasSession: !!session }
      })

      if (event === 'SIGNED_IN' && session) {
        Logger.auth.info('Successfully signed in, redirecting to dashboard')
        setStatus('Successfully signed in!')
        setTimeout(() => {
          router.push('/')
        }, 1000)
      } else if (event === 'SIGNED_OUT') {
        Logger.auth.warn('Sign in failed or user signed out')
        setStatus('Sign in failed')
        setTimeout(() => {
          router.push('/?auth_error=sign_in_failed')
        }, 2000)
      } else if (event === 'TOKEN_REFRESHED') {
        Logger.auth.info('Token refreshed')
        setStatus('Token refreshed, checking session...')
      } else if (event === 'INITIAL_SESSION') {
        if (session) {
          Logger.auth.info('Initial session found, redirecting')
          setStatus('Session found!')
          setTimeout(() => {
            router.push('/')
          }, 1000)
        } else {
          Logger.auth.warn('Initial session event but no session')
          setStatus('No session in initial event')
        }
      }
    })

    // Also try to get the current session after a delay
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          Logger.auth.error('Error getting session', {
            message: error.message,
            meta: { code: error.name }
          })
        } else if (session) {
          Logger.auth.info('Session found via getSession, redirecting')
          setStatus('Session found!')
          setTimeout(() => {
            router.push('/')
          }, 1000)
        } else {
          Logger.auth.info('No session found via getSession, waiting...')
          setStatus('No session yet, waiting for auth state change...')
        }
      } catch (err: any) {
        Logger.auth.error('Error checking session', {
          message: err.message,
          meta: { error: err }
        })
      }
    }

    // Check session after a delay
    setTimeout(checkSession, 2000)

    // Set a timeout to redirect if nothing happens
    const timeout = setTimeout(() => {
      Logger.auth.warn('OAuth callback timeout, redirecting to login')
      setStatus('Authentication timeout')
      setTimeout(() => {
        router.push('/?auth_error=timeout')
      }, 1000)
    }, 10000) // 10 second timeout

    return () => {
      subscription.unsubscribe()
      clearTimeout(timeout)
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600">{status}</p>
        <p className="mt-2 text-sm text-gray-500">Please wait...</p>
      </div>
    </div>
  )
} 