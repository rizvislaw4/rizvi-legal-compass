
import AppLayout from "@/components/layouts/AppLayout";
import { useState } from "react";
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
  Search
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

// Mock data
const cases = [
  {
    id: "CASE-001",
    title: "Singh vs. Patel Property Dispute",
    client: "Raj Singh",
    status: "Active",
    nextHearing: "2025-05-10",
    filedDate: "2025-03-15",
  },
  {
    id: "CASE-002",
    title: "Mehta Corporate Restructuring",
    client: "Mehta Industries Ltd.",
    status: "On Hold",
    nextHearing: "2025-06-22",
    filedDate: "2025-02-10",
  },
  {
    id: "CASE-003",
    title: "State vs. Kumar",
    client: "Anil Kumar",
    status: "Pending",
    nextHearing: "2025-04-30",
    filedDate: "2025-03-22",
  },
  {
    id: "CASE-004",
    title: "Sharma Family Trust",
    client: "Sharma Family",
    status: "Closed",
    nextHearing: "-",
    filedDate: "2024-11-15",
  },
  {
    id: "CASE-005",
    title: "Jain vs. City Municipal Corp",
    client: "Vimal Jain",
    status: "Active",
    nextHearing: "2025-05-05",
    filedDate: "2025-01-20",
  },
];

const statusColors: Record<string, string> = {
  Active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  "On Hold": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  Pending: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  Closed: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
};

const CasesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handlePrint = () => {
    toast({
      title: "Printing Cases",
      description: "Case list sent to printer"
    });
    window.print();
  };
  
  const filteredCases = cases.filter((c) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <Button 
              size="sm" 
              className="bg-law-primary hover:bg-law-primary/90"
              onClick={() => {
                toast({
                  title: "New Case",
                  description: "This would open the case creation form in a real app"
                });
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Case
            </Button>
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
                <DropdownMenuItem>All</DropdownMenuItem>
                <DropdownMenuItem>Active</DropdownMenuItem>
                <DropdownMenuItem>Pending</DropdownMenuItem>
                <DropdownMenuItem>On Hold</DropdownMenuItem>
                <DropdownMenuItem>Closed</DropdownMenuItem>
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
              {filteredCases.length > 0 ? (
                filteredCases.map((caseItem) => (
                  <TableRow key={caseItem.id}>
                    <TableCell className="font-medium">{caseItem.id}</TableCell>
                    <TableCell>{caseItem.title}</TableCell>
                    <TableCell>{caseItem.client}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[caseItem.status]}>
                        {caseItem.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{caseItem.nextHearing}</TableCell>
                    <TableCell>{caseItem.filedDate}</TableCell>
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
                              toast({
                                title: "View Case",
                                description: `Viewing details for ${caseItem.id}`
                              });
                            }}
                          >
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              toast({
                                title: "Edit Case",
                                description: `Editing ${caseItem.id}`
                              });
                            }}
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              toast({
                                title: "Update Status",
                                description: `Updating status for ${caseItem.id}`
                              });
                            }}
                          >
                            Update Status
                          </DropdownMenuItem>
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
    </AppLayout>
  );
};

export default CasesPage;
