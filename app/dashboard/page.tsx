'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '../providers/auth-provider'
import { LoadingSpinner } from '../components/ui/loading-spinner'

export default function DashboardPage() {
  const router = useRouter()
  const { user, userProfile, loading } = useAuth()

  useEffect(() => {
    if (!loading && (!user || !userProfile)) {
      router.push('/')
    }
  }, [user, userProfile, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!user || !userProfile) {
    return null // Will redirect in useEffect
  }

  // Render the dashboard content
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard content will be rendered by the main app component */}
    </div>
  )
} 