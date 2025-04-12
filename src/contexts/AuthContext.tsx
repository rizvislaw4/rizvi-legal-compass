
import { createContext, useContext } from "react";
import { useAuthProvider } from "@/hooks/useAuthProvider";
import { AuthContextType } from "@/types/auth";

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  profile: null,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  createUserAccount: async () => null,
  loading: true,
  isAdmin: false,
  isLawyer: false,
  isClient: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuthProvider();
  
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
