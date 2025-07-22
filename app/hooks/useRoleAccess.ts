/**
 * ROLE-BASED ACCESS CONTROL HOOK
 * 
 * This hook provides role-based access control functionality.
 * Handles permission checks and role-based UI rendering.
 * 
 * Dependencies: auth-provider, useUserProfile hook
 * Used by: All components requiring role-based access control
 * 
 * @author ExpenseFlow Team
 * @since 2024-01-01
 */

import { useAuth } from '@/app/providers/auth-provider'
import { useUserProfile } from '@/app/hooks/useUserProfile'

// Role hierarchy (higher index = more permissions)
const ROLE_HIERARCHY = ['user', 'manager', 'admin'] as const

type Role = typeof ROLE_HIERARCHY[number]

interface RoleAccess {
  hasRole: (role: Role) => boolean
  hasAnyRole: (roles: Role[]) => boolean
  hasMinRole: (role: Role) => boolean
  canApproveExpense: (amount: number) => boolean
  canAccessRoute: (route: string) => boolean
  isAdmin: boolean
  isManager: boolean
}

export function useRoleAccess(): RoleAccess {
  const { user } = useAuth()
  const { profile } = useUserProfile()

  // Get role level in hierarchy
  const getRoleLevel = (role: Role) => ROLE_HIERARCHY.indexOf(role)
  const userRoleLevel = profile?.role ? getRoleLevel(profile.role as Role) : -1

  // Check if user has a specific role
  const hasRole = (role: Role): boolean => {
    return profile?.role === role
  }

  // Check if user has any of the specified roles
  const hasAnyRole = (roles: Role[]): boolean => {
    return roles.some(role => hasRole(role))
  }

  // Check if user has at least the specified role level
  const hasMinRole = (role: Role): boolean => {
    const requiredLevel = getRoleLevel(role)
    return userRoleLevel >= requiredLevel
  }

  // Check if user can approve an expense of given amount
  const canApproveExpense = (amount: number): boolean => {
    if (!profile) return false

    // Admins can approve any amount
    if (profile.role === 'admin') return true

    // Managers can approve up to their limit
    if (profile.role === 'manager') {
      return amount <= (profile.approval_limit || 0)
    }

    return false
  }

  // Check if user can access a specific route
  const canAccessRoute = (route: string): boolean => {
    if (!profile) return false

    // Define route access rules
    const routeRules: Record<string, Role[]> = {
      '/dashboard': ['user', 'manager', 'admin'],
      '/expenses': ['user', 'manager', 'admin'],
      '/approvals': ['manager', 'admin'],
      '/reports': ['manager', 'admin'],
      '/settings': ['admin'],
      '/users': ['admin']
    }

    const requiredRoles = routeRules[route]
    if (!requiredRoles) return true // No rules = public route

    return hasAnyRole(requiredRoles)
  }

  return {
    hasRole,
    hasAnyRole,
    hasMinRole,
    canApproveExpense,
    canAccessRoute,
    isAdmin: hasRole('admin'),
    isManager: hasRole('manager')
  }
} 