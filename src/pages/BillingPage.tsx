import { useState } from "react";
import AppLayout from "@/components/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { NewInvoiceForm } from "@/components/billing/NewInvoiceForm";
import { BillingSummaryCards } from "@/components/billing/BillingSummaryCards";
import { BillingFilters } from "@/components/billing/BillingFilters";
import { InvoicesTable } from "@/components/billing/InvoicesTable";

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

export default function BillingPage() {
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
            <NewInvoiceForm />
          </div>
        </div>

        <BillingSummaryCards
          totalAmount="₹335,000"
          paidAmount="₹45,000"
          pendingAmount="₹205,000"
          overdueAmount="₹85,000"
        />

        <BillingFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <InvoicesTable invoices={filteredInvoices} />
      </div>
    </AppLayout>
  );
}
