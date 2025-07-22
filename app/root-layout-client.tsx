/**
 * SIMPLIFIED ROOT LAYOUT CLIENT
 * 
 * Client-side root layout component that wraps the app with providers.
 * Uses simplified auth provider without complex session management.
 * 
 * Dependencies: react, simplified auth provider
 * Used by: Root layout
 * 
 * @author ExpenseFlow Team
 * @since 2024-01-01
 */

'use client';

import { AuthProvider } from './providers/auth-provider';
import { AuthErrorBoundary } from './components/auth/AuthErrorBoundary';

interface RootLayoutClientProps {
  children: React.ReactNode;
}

export function RootLayoutClient({ children }: RootLayoutClientProps) {
  return (
    <AuthErrorBoundary>
      <AuthProvider>
        {children}
      </AuthProvider>
    </AuthErrorBoundary>
  );
} 