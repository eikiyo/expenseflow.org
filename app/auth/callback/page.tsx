/**
 * OAUTH CALLBACK PAGE
 * 
 * Client-side page that handles the OAuth callback and session setup.
 * Uses client-side auth to properly handle PKCE flow.
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

export default function AuthCallback() {
  const router = useRouter()
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing')
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const supabase = getSupabaseClient()
        
        // Get the URL parameters
        const urlParams = new URLSearchParams(window.location.search)
        const code = urlParams.get('code')
        const error = urlParams.get('error')
        const errorDescription = urlParams.get('error_description')

        console.log('🔗 Client callback processing:', { 
          hasCode: !!code, 
          hasError: !!error 
        })

        if (error) {
          console.error('❌ OAuth error:', { error, errorDescription })
          setError(errorDescription || error)
          setStatus('error')
          return
        }

        if (code) {
          console.log('🔄 Exchanging code for session...')
          
          // Let Supabase handle the PKCE flow automatically
          const { data, error: sessionError } = await supabase.auth.exchangeCodeForSession(code)
          
          if (sessionError) {
            console.error('❌ Session exchange error:', sessionError)
            setError(sessionError.message)
            setStatus('error')
            return
          }

          if (data.session) {
            console.log('✅ Session established successfully')
            setStatus('success')
            
            // Redirect to home page after a brief delay
            setTimeout(() => {
              router.push('/')
            }, 1500)
          } else {
            console.error('❌ No session received')
            setError('No session received from authentication')
            setStatus('error')
          }
        } else {
          console.error('❌ No code in callback')
          setError('No authorization code received')
          setStatus('error')
        }
      } catch (error) {
        console.error('❌ Callback processing error:', error)
        setError(error instanceof Error ? error.message : 'Unknown error occurred')
        setStatus('error')
      }
    }

    handleCallback()
  }, [router])

  // Show different UI based on status
  if (status === 'processing') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Completing sign in...</p>
        </div>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Sign in successful!</h1>
          <p className="text-gray-600">Redirecting you to ExpenseFlow...</p>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Sign in failed</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => router.push('/')}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
} 