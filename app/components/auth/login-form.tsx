'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { LoadingSpinner } from '../ui/loading-spinner'
import Image from 'next/image'
import { DollarSign } from 'lucide-react'

export function LoginForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [logoError, setLogoError] = useState(false)

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError('')

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })

      if (error) {
        setError(error.message)
        console.error('OAuth error:', error)
      } else {
        console.log('OAuth initiated successfully:', data)
      }
    } catch (err) {
      setError('An unexpected error occurred')
      console.error('Unexpected error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              {!logoError ? (
                <Image 
                  src="/logo.svg" 
                  alt="ExpenseFlow Logo" 
                  width={40} 
                  height={40}
                  onError={() => setLogoError(true)}
                />
              ) : (
                <DollarSign className="w-8 h-8 text-white" />
              )}
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">Welcome to ExpenseFlow</h1>
            <p className="text-gray-600 mt-2">Sign in to manage your expenses</p>
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-900 font-medium py-3 px-4 rounded-lg border border-gray-300 shadow-sm transition-colors"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Connecting...
              </>
            ) : (
              <>
                <Image 
                  src="/google-logo.svg" 
                  alt="Google Logo" 
                  width={20} 
                  height={20} 
                />
                Sign in with Google
              </>
            )}
          </button>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              By signing in, you agree to our Terms and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 