
import { AuthTabs } from "@/components/auth/AuthTabs";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

const AuthPage = () => {
  const { theme, setTheme } = useTheme();
  
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-law-dark p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-block bg-white dark:bg-gray-800 p-3 rounded-full shadow-sm mb-4">
            <img
              src="/logo.svg"
              alt="Rizvi Legal Compass"
              width={64}
              height={64}
            />
          </div>
          <h1 className="text-2xl font-bold text-law-primary dark:text-white">
            Rizvi Legal Compass
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Legal case management system
          </p>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Sign in</h2>
              <Button
                variant="ghost"
                size="icon"
                aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                onClick={toggleTheme}
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Select your user type to continue
            </p>
          </CardHeader>
          <CardContent>
            <AuthTabs />
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-4">
            <p className="text-xs text-muted-foreground">
              © 2025 Mahboob Rizvi Law Associates. All rights reserved.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
