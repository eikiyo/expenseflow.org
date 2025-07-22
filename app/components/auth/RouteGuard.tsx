/**
 * ROUTE GUARD COMPONENT
 * 
 * This component protects routes based on user roles.
 * Handles route access control and redirection.
 * 
 * Dependencies: Next.js, useRoleAccess
 * Used by: Layout components
 * 
 * @author ExpenseFlow Team
 * @since 2024-01-01
 */

'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/app/providers/auth-provider'
import { useRoleAccess } from '@/app/hooks/useRoleAccess'
import { LoadingSpinner } from '../ui/loading-spinner'

interface RouteGuardProps {
  children: React.ReactNode
}

export function RouteGuard({ children }: RouteGuardProps) {
  const { user, loading } = useAuth()
  const { canAccessRoute } = useRoleAccess()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Skip check for public routes
    if (pathname === '/auth/login' || pathname === '/auth/callback') {
      return
    }

    // Handle authentication check
    if (!loading) {
      if (!user) {
        // Redirect to login if not authenticated
        router.push('/auth/login')
      } else if (!canAccessRoute(pathname)) {
        // Redirect to dashboard if user doesn't have required role
        router.push('/dashboard')
      }
    }
  }, [user, loading, pathname, router, canAccessRoute])

  // Show loading state
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Show children only if user has access
  if (!user || !canAccessRoute(pathname)) {
    return null
  }

  return <>{children}</>
} 