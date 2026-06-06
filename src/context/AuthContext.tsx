import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Profile {
  id: string;
  full_name: string;
  role: 'user' | 'super_admin';
  is_loan_authorized: boolean;
}

interface AuthContextType {
  profile: Profile | null;
  loading: boolean;
  isAdmin: boolean;
  canAccessLoans: boolean;
}

const AuthContext = createContext<AuthContextType>({
  profile: null,
  loading: true,
  isAdmin: false,
  canAccessLoans: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get session and profile
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const { data } = await supabase
          .from('profiles')
          .select('id, full_name, role, is_loan_authorized')
          .eq('id', session.user.id)
          .single();
        
        setProfile(data);
      } else {
        // For development/mock if no session
        // setProfile({ id: 'mock', full_name: 'Mock User', role: 'user', is_loan_authorized: false });
      }
      setLoading(false);
    };

    fetchProfile();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        const { data } = await supabase
          .from('profiles')
          .select('id, full_name, role, is_loan_authorized')
          .eq('id', session.user.id)
          .single();
        setProfile(data);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ 
      profile, 
      loading, 
      isAdmin: profile?.role === 'super_admin',
      canAccessLoans: profile?.is_loan_authorized || profile?.role === 'super_admin'
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
