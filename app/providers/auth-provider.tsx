/**
 * AUTH PROVIDER
 * 
 * This component manages authentication state and user profile data.
 * Uses @supabase/ssr for better session handling and cookie compatibility.
 * 
 * Dependencies: @supabase/ssr, react
 * Used by: Root layout client
 * 
 * @author ExpenseFlow Team
 * @since 2024-01-01
 */

'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseClient } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';
import type { Profile } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  userProfile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

interface AuthProviderProps {
  children: React.ReactNode;
  initialSession: Session | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children, initialSession }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(initialSession?.user || null);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  // Check environment variables
  console.log('🔧 Environment check:', {
    hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasSupabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...'
  });
  
  // Get single supabase client instance
  const supabase = getSupabaseClient();

  // Clear potentially corrupted auth cookies
  const clearAuthCookies = () => {
    try {
      // Clear various auth-related cookies that might be corrupted
      document.cookie.split(";").forEach((cookie) => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        if (name.startsWith('sb-') || name.includes('supabase') || name.includes('auth')) {
          console.log('🧹 Clearing potentially corrupted cookie:', name);
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        }
      });
    } catch (error) {
      console.log('🤷 Could not clear cookies:', error);
    }
  };

  useEffect(() => {
    // Initialize auth state with server session
    const initializeAuth = async () => {
      console.log('🔄 Initializing auth...', { initialSession: !!initialSession });
      
      try {
        // Always get a fresh session from the client
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        console.log('📱 Client session check result:', { 
          session: !!session, 
          error: sessionError,
          userId: session?.user?.id,
          userEmail: session?.user?.email
        });
        
        if (sessionError) {
          console.error('❌ Error getting session:', sessionError);
          setLoading(false);
          return;
        }

        if (session?.user) {
          console.log('✅ Found valid session:', session.user.id);
          setUser(session.user);
          await fetchUserProfile(session.user);
        } else {
          console.log('❌ No valid session found');
          setUser(null);
          setUserProfile(null);
        }
      } catch (error) {
        console.error('❌ Error initializing auth:', error);
      } finally {
        console.log('✅ Auth initialization complete, setting loading to false');
        setLoading(false);
      }
    };

    console.log('🚀 Starting auth initialization...');
    initializeAuth().catch((error) => {
      console.error('💥 Failed to initialize auth:', error);
      setLoading(false);
    });

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state changed:', event, {
        hasSession: !!session,
        userId: session?.user?.id,
        userEmail: session?.user?.email
      });
      
      if (session?.user) {
        console.log('✅ Setting user from auth state change');
        setUser(session.user);
        await fetchUserProfile(session.user);
      } else {
        console.log('❌ No session in auth state change, clearing user');
        setUser(null);
        setUserProfile(null);
      }
      
      if (event === 'SIGNED_OUT') {
        router.refresh(); // Refresh to update server session
      }
    });

    return () => {
      console.log('🧹 Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, [initialSession, supabase, router]);

  // Fetch user profile helper function
  const fetchUserProfile = async (authUser: User) => {
    console.log('🔄 Fetching user profile for:', authUser.id);
    console.log('👤 Auth user data:', {
      id: authUser.id,
      email: authUser.email,
      fullName: authUser.user_metadata?.full_name,
      avatar: authUser.user_metadata?.avatar_url
    });
    
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (profileError) {
        console.error('❌ Error fetching user profile:', profileError);
        
        // If user profile doesn't exist (PGRST116), create a new one
        if (profileError.code === 'PGRST116') {
          console.log('🆕 User profile not found, creating new profile for first-time user...');
          
          const newProfileData = {
            id: authUser.id,
            email: authUser.email || '',
            full_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
            avatar_url: authUser.user_metadata?.avatar_url || null,
            role: 'user' as const,
            department: null,
            manager_id: null,
            expense_limit: 0
          };
          
          console.log('📝 Creating profile with data:', newProfileData);
          
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert(newProfileData)
            .select()
            .single();

          if (createError) {
            console.error('❌ Error creating user profile:', createError);
            console.error('💥 Create error details:', createError.details, createError.hint);
            
            // Fallback to mock profile if database creation fails
            console.log('🔄 Using fallback mock profile...');
            const mockProfile: Profile = {
              id: authUser.id,
              email: authUser.email || '',
              full_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
              avatar_url: authUser.user_metadata?.avatar_url,
              role: 'user',
              department: null,
              manager_id: null,
              expense_limit: null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
            console.log('✅ Using mock profile:', mockProfile);
            setUserProfile(mockProfile);
            return;
          } else {
            console.log('✅ Successfully created new profile:', newProfile);
            setUserProfile(newProfile);
            return;
          }
        }
        
        // For other errors (like table doesn't exist), use mock profile
        console.log('🔄 Using mock profile due to database error...');
        const mockProfile: Profile = {
          id: authUser.id,
          email: authUser.email || '',
          full_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
          avatar_url: authUser.user_metadata?.avatar_url,
          role: 'user',
          department: null,
          manager_id: null,
          expense_limit: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        console.log('✅ Using mock profile:', mockProfile);
        setUserProfile(mockProfile);
        return;
      } else {
        console.log('✅ Found existing profile:', profile);
        setUserProfile(profile);
      }
    } catch (error) {
      console.error('❌ Unexpected error in fetchUserProfile:', error);
      // Final fallback to mock profile
      const mockProfile: Profile = {
        id: authUser.id,
        email: authUser.email || '',
        full_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
        avatar_url: authUser.user_metadata?.avatar_url,
        role: 'user',
        department: null,
        manager_id: null,
        expense_limit: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      console.log('✅ Using final fallback mock profile:', mockProfile);
      setUserProfile(mockProfile);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setUserProfile(null);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 