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

    Logger.auth.info('OAuth code found, attempting manual exchange', {
      meta: { codeLength: code.length }
    })
    setStatus('OAuth code received, exchanging for session...')

    // Try manual OAuth code exchange
    const exchangeCode = async () => {
      try {
        Logger.auth.info('Attempting manual OAuth code exchange')
        const { data, error } = await supabase.auth.exchangeCodeForSession(code)
        
        if (error) {
          Logger.auth.error('Manual code exchange failed', {
            message: error.message,
            meta: { code: error.name, status: error.status }
          })
          setStatus(`Code exchange failed: ${error.message}`)
          setTimeout(() => {
            router.push('/?auth_error=exchange_failed&message=' + encodeURIComponent(error.message))
          }, 3000)
          return
        }

        if (data.session) {
          Logger.auth.info('Manual code exchange successful', {
            meta: { 
              userId: data.session.user.id,
              email: data.session.user.email
            }
          })
          setStatus('Session created successfully!')
          setTimeout(() => {
            router.push('/')
          }, 1000)
        } else {
          Logger.auth.warn('Code exchange succeeded but no session returned')
          setStatus('No session returned from exchange')
        }
      } catch (err: any) {
        Logger.auth.error('Exception during code exchange', {
          message: err.message,
          meta: { error: err }
        })
        setStatus(`Exchange error: ${err.message}`)
      }
    }

    // Try manual exchange first
    exchangeCode()

    // Also listen for auth state changes as backup
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
      }
    })

    // Also try to get the current session
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          Logger.auth.error('Error getting session', {
            message: error.message,
            meta: { code: error.name }
          })
        } else if (session) {
          Logger.auth.info('Session found, redirecting')
          setStatus('Session found!')
          setTimeout(() => {
            router.push('/')
          }, 1000)
        } else {
          Logger.auth.info('No session found, waiting for auth state change')
          setStatus('No session yet, waiting...')
        }
      } catch (err: any) {
        Logger.auth.error('Error checking session', {
          message: err.message,
          meta: { error: err }
        })
      }
    }

    // Check session after a short delay
    setTimeout(checkSession, 2000)

    return () => {
      subscription.unsubscribe()
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