
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      // Redirect to Dashboard if authenticated, otherwise to AuthPage
      navigate(user ? "/dashboard" : "/auth");
    }
  }, [navigate, user, loading]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-law-primary" />
        <h1 className="text-2xl font-semibold mb-2">Redirecting...</h1>
        <p>Please wait while we redirect you to the application.</p>
      </div>
    </div>
  );
};

export default Index;
