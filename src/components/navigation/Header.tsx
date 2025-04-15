import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { Moon, Sun, User, Menu, Search, Bell } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import Sidebar from "./Sidebar";
import UserMenu from "./UserMenu";
import { useToast } from "@/hooks/use-toast";
import NotificationsPopover from "../notifications/NotificationsPopover";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    toast({
      title: `${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)} Mode`,
      description: `Switched to ${newTheme} mode`,
    });
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-law-dark border-b shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0">
                <Sidebar />
              </SheetContent>
            </Sheet>
          )}
          <div className="flex items-center gap-2">
            <img
              src="/logo.svg"
              alt="Rizvi Legal Compass"
              width={32}
              height={32}
              className="hidden md:block"
            />
            <h1 className="text-lg font-semibold text-law-primary dark:text-white">
              Rizvi Legal Compass
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Search"
            className="relative"
            onClick={() => {
              toast({
                title: "Search",
                description: "Search functionality coming soon",
              });
            }}
          >
            <Search className="h-5 w-5" />
          </Button>
          
          <NotificationsPopover />
          
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
          
          <UserMenu />
        </div>
      </div>
    </header>
  );
}

export default Header;
