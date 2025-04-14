
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Calendar, Clock, CreditCard, Users } from "lucide-react";
import AppLayout from "@/components/layouts/AppLayout";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import DailyCasesList from "@/components/case/DailyCasesList";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { toast } = useToast();
  const { profile, isAdmin, isLawyer, isClient } = useAuth();
  const navigate = useNavigate();
  
  const handlePrint = () => {
    toast({
      title: "Printing Dashboard",
      description: "Dashboard report sent to printer"
    });
    window.print();
  };

  const getRoleSpecificWelcome = () => {
    const fullName = profile?.full_name || "User";
    if (isAdmin) return `Welcome back, ${fullName} (Admin)`;
    if (isLawyer) return `Welcome back, ${fullName} (Lawyer)`;
    if (isClient) return `Welcome back, ${fullName}`;
    return `Welcome back, ${fullName}`;
  };

  return (
    <AppLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{getRoleSpecificWelcome()}</h1>
          <p className="text-muted-foreground">Here's an overview of your cases and schedule</p>
        </div>
        <Button variant="outline" onClick={handlePrint}>
          Print Dashboard
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground mt-1">+2 since last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hearings This Week</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground mt-1">Next: Tomorrow, 10:00 AM</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground mt-1">+5 since last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹185,000</div>
            <p className="text-xs text-muted-foreground mt-1">From 7 clients</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-6">
        {(isLawyer || isAdmin) && (
          <DailyCasesList />
        )}
        
        <Card>
          <CardHeader>
            <CardTitle>
              {isClient ? "Your Cases" : "Recent Cases"}
            </CardTitle>
            <CardDescription>
              {isClient 
                ? "Your ongoing legal matters" 
                : "Newly added or recently updated cases"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0">
                <div className="space-y-1">
                  <p className="font-medium">Singh vs. Patel Property Dispute</p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-1 h-3 w-3" /> Updated 2 days ago
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  View
                </Button>
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">View All Cases</Button>
          </CardFooter>
        </Card>
        
        {!isClient && (
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Hearings</CardTitle>
              <CardDescription>Your schedule for the next 7 days</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <div className="space-y-1">
                    <p className="font-medium">State vs. Mehta</p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="mr-1 h-3 w-3" /> Tomorrow, 11:30 AM
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => navigate('/calendar')}
              >
                View Calendar
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default Dashboard;
