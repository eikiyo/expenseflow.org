/**
 * AUTH PROVIDER
 * 
 * This component manages authentication state and user profile data.
 * Provides auth context to the entire application with proper session handling.
 * 
 * Dependencies: @supabase/auth-helpers-nextjs, react
 * Used by: Root layout client
 * 
 * @author ExpenseFlow Team
 * @since 2024-01-01
 */

'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseClient } from '@/lib/supabase';
import type { User, Session } from '@supabase/auth-helpers-nextjs';
import type { ExpenseUser } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  userProfile: ExpenseUser | null;
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
  const [userProfile, setUserProfile] = useState<ExpenseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  // Get single supabase client instance
  const supabase = getSupabaseClient();

  useEffect(() => {
    // Initialize auth state with server session
    const initializeAuth = async () => {
      console.log('🔄 Initializing auth...', { initialSession: !!initialSession });
      try {
        // If we have an initial session, fetch the user profile
        if (initialSession?.user) {
          console.log('✅ Found initial session:', initialSession.user.id);
          setUser(initialSession.user);
          await fetchUserProfile(initialSession.user);
        } else {
          console.log('🔍 No initial session, checking client session...');
          // If no initial session, check client session
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            console.log('✅ Found client session:', session.user.id);
            setUser(session.user);
            await fetchUserProfile(session.user);
          } else {
            console.log('❌ No session found');
          }
        }
      } catch (error) {
        console.error('❌ Error initializing auth:', error);
      } finally {
        console.log('✅ Auth initialization complete, setting loading to false');
        setLoading(false);
      }
    };

    initializeAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state changed:', event, session?.user?.id);
      
      if (session?.user) {
        setUser(session.user);
        await fetchUserProfile(session.user);
      } else {
        setUser(null);
        setUserProfile(null);
      }
      
      // Don't set loading to false here as it's already handled in initializeAuth
      if (event === 'SIGNED_OUT') {
        router.refresh(); // Refresh to update server session
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [initialSession, supabase, router]);

  // Fetch user profile helper function
  const fetchUserProfile = async (authUser: User) => {
    console.log('🔄 Fetching user profile for:', authUser.id);
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (profileError) {
        console.error('❌ Error fetching user profile:', profileError);
        
        // If profiles table doesn't exist or user profile doesn't exist, create a mock profile
        if (profileError.code === 'PGRST116' || profileError.code === '42P01') {
          console.log('🔄 Creating mock profile from auth user data...');
          const mockProfile: ExpenseUser = {
            id: authUser.id,
            email: authUser.email || '',
            full_name: authUser.user_metadata?.full_name || authUser.email || 'User',
            avatar_url: authUser.user_metadata?.avatar_url,
            role: 'user',
            department: undefined,
            manager_id: undefined,
            expense_limit: undefined
          };
          console.log('✅ Created mock profile:', mockProfile);
          setUserProfile(mockProfile);
          return;
        }

        // Try to create profile if table exists but user doesn't have one
        if (profileError.code === 'PGRST116') {
          console.log('🔄 Creating new profile...');
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
              id: authUser.id,
              email: authUser.email || '',
              full_name: authUser.user_metadata?.full_name || authUser.email || '',
              avatar_url: authUser.user_metadata?.avatar_url,
              role: 'user'
            })
            .select()
            .single();

          if (createError) {
            console.error('❌ Error creating user profile:', createError);
            // Fallback to mock profile
            const mockProfile: ExpenseUser = {
              id: authUser.id,
              email: authUser.email || '',
              full_name: authUser.user_metadata?.full_name || authUser.email || 'User',
              avatar_url: authUser.user_metadata?.avatar_url,
              role: 'user',
              department: undefined,
              manager_id: undefined,
              expense_limit: undefined
            };
            setUserProfile(mockProfile);
          } else {
            console.log('✅ Created new profile:', newProfile);
            setUserProfile(newProfile);
          }
        }
      } else {
        console.log('✅ Found existing profile:', profile);
        setUserProfile(profile);
      }
    } catch (error) {
      console.error('❌ Error in fetchUserProfile:', error);
      // Fallback to mock profile on any error
      const mockProfile: ExpenseUser = {
        id: authUser.id,
        email: authUser.email || '',
        full_name: authUser.user_metadata?.full_name || authUser.email || 'User',
        avatar_url: authUser.user_metadata?.avatar_url,
        role: 'user',
        department: undefined,
        manager_id: undefined,
        expense_limit: undefined
      };
      console.log('✅ Using fallback mock profile:', mockProfile);
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