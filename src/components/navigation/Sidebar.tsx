
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  Users,
  FilePlus,
  CreditCard,
  Settings,
  BarChart3,
  UserCog,
  Calendar,
  ShieldCheck,
  UserPlus
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import { CreateClientDialog } from "@/components/client/CreateClientDialog";

const Sidebar = () => {
  const { isAdmin, isLawyer } = useAuth();
  
  const commonNavItems = [
    { name: "Dashboard", icon: <BarChart3 className="h-5 w-5" />, path: "/dashboard" },
    { name: "Cases", icon: <Briefcase className="h-5 w-5" />, path: "/cases" },
    { name: "Calendar", icon: <Calendar className="h-5 w-5" />, path: "/calendar" },
  ];

  const adminItems = [
    { name: "Admin Panel", icon: <ShieldCheck className="h-5 w-5" />, path: "/admin" },
    { name: "Clients", icon: <Users className="h-5 w-5" />, path: "/clients" },
    { name: "Staff", icon: <UserCog className="h-5 w-5" />, path: "/staff" },
  ];

  const lawyerItems = [
    { name: "Clients", icon: <Users className="h-5 w-5" />, path: "/clients" },
  ];

  const otherItems = [
    { name: "Documents", icon: <FilePlus className="h-5 w-5" />, path: "/documents" },
    { name: "Billing", icon: <CreditCard className="h-5 w-5" />, path: "/billing" },
    { name: "Settings", icon: <Settings className="h-5 w-5" />, path: "/settings" },
  ];

  let navItems = [...commonNavItems];
  
  if (isAdmin) {
    navItems = [...navItems, ...adminItems];
  } else if (isLawyer) {
    navItems = [...navItems, ...lawyerItems];
  }
  
  navItems = [...navItems, ...otherItems];

  return (
    <aside className="w-64 border-r bg-white dark:bg-law-dark h-[calc(100vh-4rem)] shrink-0">
      <ScrollArea className="h-full py-6">
        <div className="px-3 py-2">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <NavLink key={item.path} to={item.path} className={({ isActive }) => cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                isActive 
                  ? "bg-law-primary text-white" 
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              )}>
                {item.icon}
                {item.name}
              </NavLink>
            ))}

            {/* Add Create Client button for admins and lawyers */}
            {(isAdmin || isLawyer) && (
              <div className="mt-4">
                <CreateClientDialog>
                  <Button variant="outline" className="w-full flex items-center gap-2 border-dashed">
                    <UserPlus className="h-4 w-4" />
                    Create New Client
                  </Button>
                </CreateClientDialog>
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
};

export default Sidebar;
