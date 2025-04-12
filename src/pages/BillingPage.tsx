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
  Search,
  Download
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

// Mock data
const invoices = [
  {
    id: "INV-001",
    client: "Raj Singh",
    caseId: "CASE-001",
    amount: "₹45,000",
    date: "2025-03-15",
    dueDate: "2025-04-15",
    status: "Paid",
  },
  {
    id: "INV-002",
    client: "Mehta Industries Ltd.",
    caseId: "CASE-002",
    amount: "₹120,000",
    date: "2025-03-10",
    dueDate: "2025-04-10",
    status: "Partial",
  },
  {
    id: "INV-003",
    client: "Anil Kumar",
    caseId: "CASE-003",
    amount: "₹35,000",
    date: "2025-03-22",
    dueDate: "2025-04-22",
    status: "Pending",
  },
  {
    id: "INV-004",
    client: "Sharma Family",
    caseId: "CASE-004",
    amount: "₹85,000",
    date: "2025-02-15",
    dueDate: "2025-03-15",
    status: "Overdue",
  },
  {
    id: "INV-005",
    client: "Vimal Jain",
    caseId: "CASE-005",
    amount: "₹50,000",
    date: "2025-03-20",
    dueDate: "2025-04-20",
    status: "Pending",
  },
];

const statusColors: Record<string, string> = {
  Paid: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  Partial: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  Pending: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  Overdue: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

const BillingPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  
  const handlePrint = () => {
    toast({
      title: "Printing Invoices",
      description: "Invoice list sent to printer"
    });
    window.print();
  };
  
  const filteredInvoices = invoices.filter((inv) =>
    inv.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.caseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate summary data
  const totalAmount = "₹335,000";
  const paidAmount = "₹45,000";
  const pendingAmount = "₹205,000";
  const overdueAmount = "₹85,000";

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Billing Management</h1>
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
                  title: "New Invoice",
                  description: "This would open the invoice creation form in a real app"
                });
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Invoice
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Invoiced</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAmount}</div>
              <p className="text-xs text-muted-foreground mt-1">From 5 clients</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Paid</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{paidAmount}</div>
              <p className="text-xs text-muted-foreground mt-1">13% of total</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{pendingAmount}</div>
              <p className="text-xs text-muted-foreground mt-1">61% of total</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">{overdueAmount}</div>
              <p className="text-xs text-muted-foreground mt-1">26% of total</p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search invoices..."
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
                <DropdownMenuItem>Paid</DropdownMenuItem>
                <DropdownMenuItem>Partial</DropdownMenuItem>
                <DropdownMenuItem>Pending</DropdownMenuItem>
                <DropdownMenuItem>Overdue</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Case ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Invoice Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.id}</TableCell>
                    <TableCell>{invoice.client}</TableCell>
                    <TableCell>{invoice.caseId}</TableCell>
                    <TableCell>{invoice.amount}</TableCell>
                    <TableCell>{invoice.date}</TableCell>
                    <TableCell>{invoice.dueDate}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[invoice.status]}>
                        {invoice.status}
                      </Badge>
                    </TableCell>
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
                                title: "View Invoice",
                                description: `Viewing details for ${invoice.id}`
                              });
                            }}
                          >
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              toast({
                                title: "Download Invoice",
                                description: `Downloading ${invoice.id}`
                              });
                            }}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              toast({
                                title: "Update Payment",
                                description: `Updating payment status for ${invoice.id}`
                              });
                            }}
                          >
                            Update Payment
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    No invoices found matching your search criteria.
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

export default BillingPage;
