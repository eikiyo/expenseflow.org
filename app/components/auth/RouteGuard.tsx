/**
 * ROUTE GUARD COMPONENT
 * 
 * This component protects routes based on user roles.
 * Handles route access control for authenticated users.
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
    // Skip check for public routes and home page
    if (pathname === '/' || pathname === '/auth/callback') {
      return
    }

    // Handle role-based access for authenticated users only
    if (!loading && user) {
      if (!canAccessRoute(pathname)) {
        // Redirect to home if user doesn't have required role
        router.push('/')
      }
    }
  }, [user, loading, pathname, router, canAccessRoute])

  // Show loading state during auth initialization
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // For unauthenticated users, let the main page handle showing LoginForm
  // For authenticated users, check role-based access
  if (user && pathname !== '/' && !canAccessRoute(pathname)) {
    return null
  }

  return <>{children}</>
} 