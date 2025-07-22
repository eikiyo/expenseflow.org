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
import { getSupabaseClient, resetSupabaseClient } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';
import type { Profile } from '@/lib/supabase';

// Maximum number of profile creation retries
const MAX_RETRIES = 3;
// Delay between retries (in milliseconds)
const RETRY_DELAY = 1000;

interface AuthContextType {
  user: User | null;
  userProfile: Profile | null;
  loading: boolean;
  error: string | null;
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
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Clear potentially corrupted auth cookies
  const clearAuthCookies = () => {
    try {
      document.cookie.split(";").forEach((cookie) => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        if (name.startsWith('sb-') || name.includes('supabase') || name.includes('auth')) {
          console.log('🧹 Clearing potentially corrupted cookie:', name);
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        }
      });
      resetSupabaseClient();
    } catch (error) {
      console.log('🤷 Could not clear cookies:', error);
    }
  };

  // Helper function to create user profile with retry logic
  const createUserProfileWithRetry = async (
    authUser: User,
    retryCount = 0
  ): Promise<Profile | null> => {
    try {
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

      console.log(`📝 Creating profile (attempt ${retryCount + 1}/${MAX_RETRIES})`, newProfileData);

      const supabase = getSupabaseClient();
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert(newProfileData)
        .select()
        .single();

      if (createError) {
        console.error(`❌ Error creating profile (attempt ${retryCount + 1}):`, createError);
        
        // Handle specific error cases
        if (createError.code === '23505') { // Unique violation
          throw new Error('A profile already exists for this user.');
        }
        if (createError.code === '42501') { // RLS violation
          throw new Error('Permission denied. Please check your account permissions.');
        }
        if (createError.code === 'PGRST301') { // Invalid input syntax
          throw new Error('Invalid profile data. Please check your information.');
        }

        // For other errors, retry if we haven't hit the limit
        if (retryCount < MAX_RETRIES - 1) {
          console.log(`🔄 Retrying profile creation in ${RETRY_DELAY}ms...`);
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
          return createUserProfileWithRetry(authUser, retryCount + 1);
        }

        throw new Error(`Failed to create profile after ${MAX_RETRIES} attempts: ${createError.message}`);
      }

      console.log('✅ Successfully created new profile:', newProfile);
      return newProfile;
    } catch (error) {
      if (retryCount < MAX_RETRIES - 1) {
        console.log(`🔄 Retrying profile creation in ${RETRY_DELAY}ms...`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        return createUserProfileWithRetry(authUser, retryCount + 1);
      }
      throw error;
    }
  };

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
      setError(null); // Clear any previous errors
      const supabase = getSupabaseClient();
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
          
          try {
            const newProfile = await createUserProfileWithRetry(authUser);
            if (!newProfile) {
              throw new Error('Failed to create user profile');
            }
            setUserProfile(newProfile);
            return;
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error creating profile';
            console.error('❌ Profile creation failed:', errorMessage);
            setError(errorMessage);
            // Don't use mock profile on creation failure - let the user know there's an issue
            return;
          }
        }
        
        // For other profile fetch errors, show error to user
        const errorMessage = `Error fetching profile: ${profileError.message}`;
        console.error(errorMessage);
        setError(errorMessage);
        return;
      }

      console.log('✅ Found existing profile:', profile);
      setUserProfile(profile);
      setError(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unexpected error managing user profile';
      console.error('❌ Unexpected error in fetchUserProfile:', error);
      setError(errorMessage);
      // Don't use mock profile - let the user know there's an issue
      return;
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      const supabase = getSupabaseClient();
      await supabase.auth.signOut();
      setUser(null);
      setUserProfile(null);
      router.push('/');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error signing out';
      console.error('Error signing out:', error);
      setError(errorMessage);
    }
  };

  useEffect(() => {
    // Initialize auth state with server session
    const initializeAuth = async () => {
      console.log('🔄 Initializing auth...', { initialSession: !!initialSession });
      
      try {
        setError(null); // Clear any previous errors
        // Always get a fresh session from the client
        const supabase = getSupabaseClient();
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        console.log('📱 Client session check result:', { 
          session: !!session, 
          error: sessionError,
          userId: session?.user?.id,
          userEmail: session?.user?.email
        });
        
        if (sessionError) {
          console.error('❌ Error getting session:', sessionError);
          const errorMessage = `Session error: ${sessionError.message}`;
          setError(errorMessage);
          clearAuthCookies(); // Clear cookies and reset client on error
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
        const errorMessage = error instanceof Error ? error.message : 'Error initializing auth';
        console.error('❌ Error initializing auth:', error);
        setError(errorMessage);
        clearAuthCookies(); // Clear cookies and reset client on error
      } finally {
        console.log('✅ Auth initialization complete, setting loading to false');
        setLoading(false);
      }
    };

    console.log('🚀 Starting auth initialization...');
    initializeAuth().catch((error) => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to initialize auth';
      console.error('💥 Failed to initialize auth:', error);
      setError(errorMessage);
      clearAuthCookies(); // Clear cookies and reset client on error
      setLoading(false);
    });

    // Set up auth state change listener
    const supabase = getSupabaseClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state changed:', event, {
        hasSession: !!session,
        userId: session?.user?.id,
        userEmail: session?.user?.email
      });
      
      if (session?.user) {
        console.log('✅ Setting user from auth state change');
        setError(null); // Clear any previous errors
        setUser(session.user);
        await fetchUserProfile(session.user);
      } else {
        console.log('❌ No session in auth state change, clearing user');
        setUser(null);
        setUserProfile(null);
        if (event === 'SIGNED_OUT') {
          clearAuthCookies(); // Clear cookies and reset client on sign out
        }
      }
      
      if (event === 'SIGNED_OUT') {
        router.refresh(); // Refresh to update server session
      }
    });

    return () => {
      console.log('🧹 Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, [initialSession, router]);

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, error, signOut }}>
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