'use client'

import { useAuth } from './providers/auth-provider'
import { LoginForm } from './components/auth/login-form'
import { Dashboard } from './components/dashboard/dashboard'
import { LoadingSpinner } from './components/ui/loading-spinner'

export default function HomePage() {
  const { user, userProfile, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!user || !userProfile) {
    return <LoginForm />
  }

  return <Dashboard />
} 