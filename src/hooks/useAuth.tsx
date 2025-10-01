import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { CLINIC_CONFIG } from '@/config/clinic';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  userRole: string | null;
  signUp: (email: string, password: string, userData?: any) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  createAdminUser: (userId: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Fetch user role when user logs in
        if (session?.user) {
          fetchUserRole(session.user.id);
        } else {
          setUserRole(null);
        }
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserRole(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();
      
      if (data && !error) {
        console.log('User role found:', data.role);
        setUserRole(data.role);
      } else {
        console.log('No role found for user:', userId, 'Error:', error);
        setUserRole(null);
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
      setUserRole(null);
    }
  };

  const signUp = async (email: string, password: string, userData?: any) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: userData
      }
    });

    // If signup is successful and user is created, assign default role
    if (data.user && !error) {
      await assignDefaultRole(data.user.id, userData?.role || 'patient');
    }
    
    return { error };
  };

  const assignDefaultRole = async (userId: string, role: 'admin' | 'patient' = 'patient') => {
    try {
      // Check if this is the first user (make them admin)
      const { data: existingUsers } = await supabase
        .from('user_roles')
        .select('id')
        .limit(1);
      
      const finalRole = (existingUsers?.length === 0) ? 'admin' : role;
      
      console.log('Assigning role:', finalRole, 'to user:', userId);
      
      if (finalRole === 'admin') {
        // Use the RLS-bypassing function for admin
        const { data, error } = await supabase.rpc('make_user_admin', {
          user_uuid: userId
        });
        
        if (error) {
          console.error('Error assigning admin role:', error);
        } else {
          console.log('Admin role assigned successfully');
        }
      } else {
        // Get the clinic ID from configuration
        const defaultClinicId = CLINIC_CONFIG.id;
        
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: userId,
            clinic_id: defaultClinicId,
            role: finalRole
          });

        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            clinic_id: defaultClinicId,
            email: ''
          });

        if (roleError) {
          console.error('Error assigning patient role:', roleError);
        }
        if (profileError) {
          console.error('Error creating profile:', profileError);
        }
      }

      // Refresh the user role after assignment
      await fetchUserRole(userId);
      
    } catch (error) {
      console.error('Error in assignDefaultRole:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUserRole(null);
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    return { error };
  };

  const createAdminUser = async (userId: string) => {
    try {
      // Use the database function that bypasses RLS
      const { data, error } = await supabase.rpc('make_user_admin', {
        user_uuid: userId
      });

      if (error) {
        console.error('Error calling make_user_admin function:', error);
        return { error };
      }

      if (!data) {
        return { error: { message: 'Failed to assign admin role' } };
      }

      // Refresh user role
      await fetchUserRole(userId);
      
      return { error: null };
    } catch (error) {
      console.error('Error in createAdminUser:', error);
      return { error };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      userRole,
      signUp,
      signIn,
      signOut,
      resetPassword,
      createAdminUser
    }}>
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