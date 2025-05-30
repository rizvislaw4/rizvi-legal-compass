
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useAuthProvider = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLawyer, setIsLawyer] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Use setTimeout to prevent potential deadlocks
        if (currentSession?.user) {
          setTimeout(() => {
            fetchProfile(currentSession.user.id);
          }, 0);
        } else {
          setProfile(null);
          setIsAdmin(false);
          setIsLawyer(false);
          setIsClient(false);
        }

        if (event === 'SIGNED_IN') {
          toast.success("Successfully signed in!");
          navigate('/dashboard');
        }
        if (event === 'SIGNED_OUT') {
          toast.info("Signed out");
          navigate('/auth');
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        fetchProfile(currentSession.user.id);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
      } else {
        setProfile(data);
        // Set role-based flags
        setIsAdmin(data.role === 'admin');
        setIsLawyer(data.role === 'lawyer');
        setIsClient(data.role === 'client');
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error: any) {
      toast.error(`Error signing in: ${error.message}`);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.fullName,
            role: userData.role || 'client',
          },
          emailRedirectTo: `${window.location.origin}/auth`,
        },
      });
      if (error) throw error;
      toast.success("Verification email sent! Please check your inbox.");
    } catch (error: any) {
      toast.error(`Error signing up: ${error.message}`);
      throw error;
    }
  };

  const createUserAccount = async (userData: any) => {
    try {
      // Only allow admins to create user accounts
      if (!isAdmin) {
        throw new Error("Only administrators can create user accounts");
      }

      const { data, error } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true,
        user_metadata: {
          full_name: userData.fullName,
          role: userData.role,
        },
      });

      if (error) throw error;
      toast.success(`Account created for ${userData.email}`);
      return data;
    } catch (error: any) {
      toast.error(`Error creating user account: ${error.message}`);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      toast.error(`Error signing out: ${error.message}`);
      throw error;
    }
  };

  return {
    session,
    user,
    profile,
    signIn,
    signUp,
    signOut,
    createUserAccount,
    loading,
    isAdmin,
    isLawyer,
    isClient,
  };
};
