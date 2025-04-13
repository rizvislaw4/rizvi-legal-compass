
import AppLayout from "@/components/layouts/AppLayout";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ChevronDown, 
  Filter, 
  MoreHorizontal, 
  Plus, 
  Printer,
  Search,
  Loader2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import CaseForm from "@/components/case/CaseForm";

const statusColors: Record<string, string> = {
  Active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  "On Hold": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  Pending: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  Closed: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
};

type Case = {
  id: string;
  title: string;
  client: {
    full_name: string;
  };
  case_status: string;
  next_hearing_date: string | null;
  created_at: string;
};

const CasesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddCaseOpen, setIsAddCaseOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { isAdmin, isLawyer, isClient, user } = useAuth();
  
  const fetchCases = async () => {
    setLoading(true);
    try {
      // Let RLS handle the filtering based on user role
      const { data, error } = await supabase
        .from('cases')
        .select(`
          id, 
          title, 
          case_status,
          created_at,
          next_hearing_date,
          profiles!client_id (full_name)
        `);
      
      if (error) throw error;
      
      // Transform data to match our Case type
      const formattedCases = data.map((item: any) => ({
        id: item.id,
        title: item.title,
        client: {
          full_name: item.profiles?.full_name || "Unknown Client"
        },
        case_status: item.case_status || "Pending",
        next_hearing_date: item.next_hearing_date,
        created_at: new Date(item.created_at).toISOString().split('T')[0]
      }));
      
      setCases(formattedCases);
    } catch (error: any) {
      toast.error(`Error fetching cases: ${error.message}`);
      console.error("Error fetching cases:", error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchCases();
  }, [user, isLawyer, isAdmin]);
  
  const handlePrint = () => {
    toast.success("Case list sent to printer");
    window.print();
  };
  
  const filteredCases = cases.filter((c) => {
    // Apply search filter
    const matchesSearch = 
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.client.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply status filter if selected
    const matchesStatus = statusFilter ? c.case_status === statusFilter : true;
    
    return matchesSearch && matchesStatus;
  });
  
  // Determine if user can add new cases based on role
  const canAddCase = isAdmin || isLawyer;

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Case Management</h1>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handlePrint}
            >
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            {canAddCase && (
              <Button 
                size="sm" 
                className="bg-law-primary hover:bg-law-primary/90"
                onClick={() => setIsAddCaseOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Case
              </Button>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search cases..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Button variant="outline" size="sm" className="flex-1 md:flex-none">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex-1 md:flex-none">
                  Status
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setStatusFilter(null)}>All</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("Active")}>Active</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("Pending")}>Pending</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("On Hold")}>On Hold</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("Closed")}>Closed</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Case ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Next Hearing</TableHead>
                <TableHead>Filed Date</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-law-primary" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredCases.length > 0 ? (
                filteredCases.map((caseItem) => (
                  <TableRow key={caseItem.id}>
                    <TableCell className="font-medium">{caseItem.id.slice(0, 8)}</TableCell>
                    <TableCell>{caseItem.title}</TableCell>
                    <TableCell>{caseItem.client.full_name}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[caseItem.case_status] || statusColors["Pending"]}>
                        {caseItem.case_status || "Pending"}
                      </Badge>
                    </TableCell>
                    <TableCell>{caseItem.next_hearing_date || "-"}</TableCell>
                    <TableCell>{caseItem.created_at}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              toast.info("Viewing details for " + caseItem.id.slice(0, 8));
                              // In a real app, navigate to case details page
                            }}
                          >
                            View Details
                          </DropdownMenuItem>
                          {canAddCase && (
                            <>
                              <DropdownMenuItem
                                onClick={() => {
                                  toast.info("Editing " + caseItem.id.slice(0, 8));
                                }}
                              >
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  toast.info("Updating status for " + caseItem.id.slice(0, 8));
                                }}
                              >
                                Update Status
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    No cases found matching your search criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Add Case Dialog */}
      <Dialog open={isAddCaseOpen} onOpenChange={setIsAddCaseOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Case</DialogTitle>
          </DialogHeader>
          <CaseForm onSuccess={() => {
            setIsAddCaseOpen(false);
            fetchCases();
          }} />
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default CasesPage;
