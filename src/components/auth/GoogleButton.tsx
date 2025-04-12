
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const GoogleButton = () => {
  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error(`Error signing in with Google: ${error.message}`);
      console.error("Error signing in with Google:", error);
    }
  };

  return (
    <Button
      variant="outline"
      className="w-full"
      onClick={handleGoogleSignIn}
    >
      <img
        src="https://www.google.com/favicon.ico"
        alt="Google"
        className="h-4 w-4 mr-2"
      />
      Continue with Google
    </Button>
  );
};

export default GoogleButton;
