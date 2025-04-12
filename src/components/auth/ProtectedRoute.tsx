
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "lawyer" | "client";
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { user, loading, isAdmin, isLawyer, isClient } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-law-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // If a specific role is required, check permissions
  if (requiredRole) {
    if (requiredRole === "admin" && !isAdmin) {
      return <Navigate to="/dashboard" replace />;
    }
    
    if (requiredRole === "lawyer" && !isLawyer && !isAdmin) {
      return <Navigate to="/dashboard" replace />;
    }
    
    if (requiredRole === "client" && !isClient && !isLawyer && !isAdmin) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
