/**
 * ROLE-BASED RENDER COMPONENT
 * 
 * This component conditionally renders content based on user roles.
 * Provides easy role-based UI control.
 * 
 * Dependencies: useRoleAccess
 * Used by: All components requiring role-based rendering
 * 
 * @author ExpenseFlow Team
 * @since 2024-01-01
 */

'use client'

import { useRoleAccess } from '@/app/hooks/useRoleAccess'

interface RoleBasedRenderProps {
  children: React.ReactNode
  roles?: ('user' | 'manager' | 'admin')[]
  minRole?: 'user' | 'manager' | 'admin'
  requireAll?: boolean
  fallback?: React.ReactNode
}

export function RoleBasedRender({
  children,
  roles,
  minRole,
  requireAll = false,
  fallback = null
}: RoleBasedRenderProps) {
  const { hasAnyRole, hasMinRole } = useRoleAccess()

  // Check if user has required roles
  const hasAccess = () => {
    if (minRole) {
      return hasMinRole(minRole)
    }

    if (roles) {
      return requireAll
        ? roles.every(role => hasAnyRole([role]))
        : hasAnyRole(roles)
    }

    return true
  }

  return hasAccess() ? <>{children}</> : <>{fallback}</>
}

// Convenience components for common role checks
export function AdminOnly({ children, fallback = null }: Omit<RoleBasedRenderProps, 'roles' | 'minRole'>) {
  return (
    <RoleBasedRender roles={['admin']} fallback={fallback}>
      {children}
    </RoleBasedRender>
  )
}

export function ManagerAndAbove({ children, fallback = null }: Omit<RoleBasedRenderProps, 'roles' | 'minRole'>) {
  return (
    <RoleBasedRender minRole="manager" fallback={fallback}>
      {children}
    </RoleBasedRender>
  )
}

export function UserAndAbove({ children, fallback = null }: Omit<RoleBasedRenderProps, 'roles' | 'minRole'>) {
  return (
    <RoleBasedRender minRole="user" fallback={fallback}>
      {children}
    </RoleBasedRender>
  )
} 