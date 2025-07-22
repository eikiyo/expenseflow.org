/**
 * ROOT LAYOUT
 * 
 * This is the root layout component that wraps all pages.
 * Handles server-side session initialization using @supabase/ssr.
 * 
 * Dependencies: next/headers, @supabase/ssr
 * Used by: Next.js App Router
 * 
 * @author ExpenseFlow Team
 * @since 2024-01-01
 */

import './globals.css';
import { RootLayoutClient } from './root-layout-client';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/lib/database.types';

export const metadata = {
  title: 'ExpenseFlow',
  description: 'Streamline your expense management',
};

export const dynamic = 'force-dynamic';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <html lang="en">
      <body>
        <RootLayoutClient serverSession={session}>
          {children}
        </RootLayoutClient>
      </body>
    </html>
  );
} 