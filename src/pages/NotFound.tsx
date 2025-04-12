
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50 dark:bg-law-dark">
      <div className="text-center space-y-4 max-w-md">
        <h1 className="text-6xl font-bold text-law-primary dark:text-white">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Page Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Button 
          onClick={() => navigate('/')}
          className="mt-6 bg-law-primary hover:bg-law-primary/90"
        >
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
