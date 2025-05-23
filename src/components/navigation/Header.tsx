
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { Moon, Sun, User, Menu, Search, Bell, UserPlus, Users } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import Sidebar from "./Sidebar";
import UserMenu from "./UserMenu";
import { useToast } from "@/hooks/use-toast";
import NotificationsPopover from "../notifications/NotificationsPopover";
import { GlobalSearch } from "@/components/search/GlobalSearch";
import { CreateClientDialog } from "@/components/client/CreateClientDialog";
import { Link } from "react-router-dom";

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
          <GlobalSearch />
          
          {/* View Clients button as a link */}
          <Link to="/clients">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              aria-label="View Clients"
            >
              <Users className="h-4 w-4" />
              <span className="hidden md:inline">View Clients</span>
            </Button>
          </Link>

          {/* Add Client button with dialog */}
          <CreateClientDialog>
            <Button
              variant="default"
              size="sm"
              className="flex items-center gap-2 bg-law-primary hover:bg-law-primary/90 text-white"
              aria-label="Add Client"
            >
              <UserPlus className="h-4 w-4" />
              <span className="hidden md:inline">Add Client</span>
            </Button>
          </CreateClientDialog>
          
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

