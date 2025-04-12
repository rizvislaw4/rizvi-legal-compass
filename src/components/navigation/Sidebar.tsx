
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
  Calendar
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";

const Sidebar = () => {
  const navItems = [
    { name: "Dashboard", icon: <BarChart3 className="h-5 w-5" />, path: "/" },
    { name: "Cases", icon: <Briefcase className="h-5 w-5" />, path: "/cases" },
    { name: "Clients", icon: <Users className="h-5 w-5" />, path: "/clients" },
    { name: "Documents", icon: <FilePlus className="h-5 w-5" />, path: "/documents" },
    { name: "Calendar", icon: <Calendar className="h-5 w-5" />, path: "/calendar" },
    { name: "Billing", icon: <CreditCard className="h-5 w-5" />, path: "/billing" },
    { name: "Staff", icon: <UserCog className="h-5 w-5" />, path: "/staff" },
    { name: "Settings", icon: <Settings className="h-5 w-5" />, path: "/settings" },
  ];

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
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
};

export default Sidebar;
