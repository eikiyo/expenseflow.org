/**
 * ROOT LAYOUT
 * 
 * This is the root layout component that wraps all pages.
 * Handles server-side session initialization and global styles.
 * 
 * Dependencies: next/headers, @supabase/auth-helpers-nextjs
 * Used by: Next.js App Router
 * 
 * @author ExpenseFlow Team
 * @since 2024-01-01
 */

import './globals.css';
import { RootLayoutClient } from './root-layout-client';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
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
  const supabase = createServerComponentClient<Database>({ cookies });

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