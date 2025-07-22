import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  console.log('🔗 Auth callback received:', { code: !!code, origin });

  if (code) {
    const cookieStore = await cookies()
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
    
    try {
      console.log('🔄 Exchanging code for session...');
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('❌ Error exchanging code for session:', error);
        return NextResponse.redirect(`${origin}?error=auth_error`);
      }

      if (!data.session) {
        console.error('❌ No session returned after exchange');
        return NextResponse.redirect(`${origin}?error=no_session`);
      }

      console.log('✅ Successfully exchanged code for session');
      console.log('👤 Session user:', data.session.user.email);
      console.log('🔑 Session expires:', new Date(data.session.expires_at! * 1000).toISOString());

      // Create response with cookies
      const response = NextResponse.redirect(origin);
      
      // Get all cookies set by Supabase auth
      const authCookies = cookieStore.getAll();
      console.log('🍪 Auth cookies to transfer:', authCookies.length);
      
      // Transfer auth cookies to the response
      authCookies.forEach(cookie => {
        response.cookies.set(cookie.name, cookie.value, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 7 // 1 week
        });
      });

      return response;
    } catch (error) {
      console.error('❌ Exception during session exchange:', error);
      return NextResponse.redirect(`${origin}?error=auth_error`);
    }
  }

  console.log('❌ No code provided in callback');
  return NextResponse.redirect(`${origin}?error=no_code`);
} 