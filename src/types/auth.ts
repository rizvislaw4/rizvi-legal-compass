
import { Session, User } from "@supabase/supabase-js";

export type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: any | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: any) => Promise<void>;
  signOut: () => Promise<void>;
  createUserAccount: (userData: any) => Promise<any>;
  loading: boolean;
  isAdmin: boolean;
  isLawyer: boolean;
  isClient: boolean;
};
