/**
 * AUTH CALLBACK ROUTE
 * 
 * Handles the OAuth callback from Supabase.
 * Uses standard OAuth flow with secure cookie handling.
 * 
 * Dependencies: @supabase/ssr, next/headers
 * Used by: OAuth flow
 * 
 * @author ExpenseFlow Team
 * @since 2024-01-01
 */

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  console.log('🔗 Auth callback received:', { 
    code: !!code, 
    origin,
    searchParams: Object.fromEntries(requestUrl.searchParams.entries())
  });

  if (!code) {
    console.error('❌ No code provided in callback');
    return NextResponse.redirect(`${origin}?error=no_code`);
  }

  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll().map(cookie => ({
              name: cookie.name,
              value: cookie.value,
            }))
          },
          setAll(cookies) {
            cookies.forEach(cookie => {
              cookieStore.set(cookie.name, cookie.value, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/'
              })
            })
          }
        }
      }
    )

    console.log('🔄 Exchanging code for session...');
    
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error('❌ Error exchanging code for session:', {
        error,
        code: error.status,
        message: error.message
      });
      return NextResponse.redirect(`${origin}?error=auth_error&message=${encodeURIComponent(error.message)}`);
    }

    if (!data.session) {
      console.error('❌ No session returned after exchange');
      return NextResponse.redirect(`${origin}?error=no_session`);
    }

    console.log('✅ Successfully exchanged code for session:', {
      userId: data.session.user.id,
      email: data.session.user.email,
      expiresAt: new Date(data.session.expires_at! * 1000).toISOString()
    });

    // Create response with cookies
    const response = NextResponse.redirect(origin);
    
    // Get all cookies set by Supabase auth
    const authCookies = cookieStore.getAll()
      .filter(cookie => cookie.name.includes('supabase') || cookie.name.includes('sb-'));
    
    console.log('🍪 Transferring auth cookies:', {
      count: authCookies.length,
      names: authCookies.map(c => c.name)
    });
    
    // Transfer auth cookies to the response
    authCookies.forEach(cookie => {
      response.cookies.set(cookie.name, cookie.value, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
      });
    });

    return response;
  } catch (error) {
    console.error('❌ Unexpected error in callback:', error);
    return NextResponse.redirect(`${origin}?error=unexpected&message=${encodeURIComponent('An unexpected error occurred')}`);
  }
} 