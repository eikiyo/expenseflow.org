import './globals.css';
import { RootLayoutClient } from './root-layout-client';
import { headers, cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

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
  const supabase = createServerComponentClient({ cookies });

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