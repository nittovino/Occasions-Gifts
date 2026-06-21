
import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/hooks/useToast';

const AuthContext = createContext(undefined);

export const SupabaseAuthProvider = ({ children }) => {
  const { showToast } = useToast();

  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const createOrUpdateProfile = async (currentUser) => {
    try {
      const { data: existing, error: fetchErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .maybeSingle();

      if (existing && !fetchErr) {
        return existing;
      }

      const { data: newProfile, error: upsertErr } = await supabase
        .from('profiles')
        .upsert({
          id: currentUser.id,
          email: currentUser.email,
          role: 'customer'
        }, { onConflict: 'id' })
        .select()
        .maybeSingle();

      if (upsertErr) {
        if (upsertErr.code === '23505') {
          const { data: retryProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentUser.id)
            .maybeSingle();
          return retryProfile || {};
        }
        console.error("Profile upsert error:", upsertErr);
        return {};
      }

      return newProfile || {};
    } catch (err) {
      console.error("Unexpected error in createOrUpdateProfile:", err);
      return {};
    }
  };

  const fetchAdminRole = async (userId) => {
    try {
      const { data } = await supabase
        .from('admin_users')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();
      return data?.role || null;
    } catch (err) {
      console.error("Error fetching admin role:", err);
      return null;
    }
  };

  const handleSession = useCallback(async (currentSession) => {
    setSession(currentSession);
    
    if (currentSession?.user) {
      try {
        const userProfile = await createOrUpdateProfile(currentSession.user);
        const adminRole = await fetchAdminRole(currentSession.user.id);
        
        const finalAdminRole = adminRole || (userProfile?.role?.includes('admin') || userProfile?.role?.includes('manager') ? userProfile.role : null);

        setUser({ 
          ...currentSession.user, 
          ...userProfile,
          adminRole: finalAdminRole,
          full_name: currentSession.user.user_metadata?.name || userProfile?.full_name || 'Member'
        });
        setIsAuthenticated(true);
      } catch (err) {
        console.error("Error fetching/setting user profile:", err);
        setUser({
          ...currentSession.user,
          full_name: currentSession.user.user_metadata?.name || 'Member'
        });
        setIsAuthenticated(true);
      }
    } else {
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      setLoading(true);

      try {
        // 1. Check Supabase session first via getSession()
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting initial session:", error);
        }

        // Only fall back to localStorage token if the getSession somehow failed to detect it 
        // (Supabase JS normally reads localStorage natively anyway, avoiding explicit overrides)
        if (isMounted) {
          await handleSession(initialSession);
          setLoading(false);
        }
      } catch (err) {
        console.error("Fatal error during auth initialization:", err);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // 3. Set up onAuthStateChange listener to track session changes in real-time (syncs across tabs)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (isMounted) {
          await handleSession(currentSession);
        }
      }
    );

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, [handleSession]);

  const signUp = useCallback(async (email, password, options) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options,
    });

    if (error) {
      showToast(error.message || "Something went wrong", "error", 5000, "Sign up Failed");
    }

    return { data, error };
  }, [showToast]);

  const signIn = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      showToast(error.message || "Something went wrong", "error", 5000, "Sign in Failed");
      throw error;
    }

    return { data, error };
  }, [showToast]);

  const signInWithOAuth = useCallback(async (provider) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `https://occasions-gifts.com/auth/callback`,
        skipBrowserRedirect: false
      },
    });

    if (error) {
      showToast(error.message || "Something went wrong during OAuth sign in", "error", 5000, "OAuth Sign in Failed");
      throw error;
    }

    return { data, error };
  }, [showToast]);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      showToast(error.message || "Something went wrong", "error", 5000, "Sign out Failed");
      throw error;
    }

    return { error };
  }, [showToast]);

  const value = useMemo(() => ({
    user,
    session,
    isAuthenticated,
    loading,
    signUp,
    signIn,
    signInWithOAuth,
    signOut,
  }), [user, session, isAuthenticated, loading, signUp, signIn, signInWithOAuth, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a SupabaseAuthProvider');
  }
  return context;
};

export const useSupabaseAuth = () => {
  const context = useAuth();
  
  return {
    ...context,
    currentUser: context.user,
    login: context.signIn,
    logout: context.signOut,
    signup: context.signUp,
    signInWithGoogle: () => context.signInWithOAuth('google'),
    isAdmin: !!context.user?.adminRole,
    adminRole: context.user?.adminRole,
    isStoreOwner: context.user?.role === 'store_owner' || context.user?.store_id != null || context.user?.user_metadata?.role === 'store_owner',
  };
};
