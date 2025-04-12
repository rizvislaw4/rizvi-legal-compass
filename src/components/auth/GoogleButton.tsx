
import { Button } from "../ui/button";

const GoogleButton = () => {
  return (
    <Button
      variant="outline"
      className="w-full"
      onClick={() => {
        // In a real app, this would redirect to Google OAuth
        window.location.href = "/api/auth/google";
      }}
    >
      <img
        src="https://www.google.com/favicon.ico"
        alt="Google"
        className="h-4 w-4 mr-2"
      />
      Sign in with Google
    </Button>
  );
};

export default GoogleButton;
