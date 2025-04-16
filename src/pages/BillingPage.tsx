
import { useState, useEffect } from "react";
import AppLayout from "@/components/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { NewInvoiceForm } from "@/components/billing/NewInvoiceForm";
import { BillingSummaryCards } from "@/components/billing/BillingSummaryCards";
import { BillingFilters } from "@/components/billing/BillingFilters";
import { InvoicesTable } from "@/components/billing/InvoicesTable";
import { supabase } from "@/integrations/supabase/client";

interface Invoice {
  id: string;
  client: string;
  caseId: string;
  amount: string;
  date: string;
  dueDate: string;
  status: string;
}

export default function BillingPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  const fetchInvoices = async () => {
    try {
      const { data: invoicesData, error } = await supabase
        .from('invoices')
        .select(`
          id,
          amount,
          created_at,
          due_date,
          status,
          case_id,
          cases (
            id,
            client_id,
            profiles (
              full_name
            )
          )
        `);

      if (error) throw error;

      const formattedInvoices = invoicesData.map(invoice => ({
        id: invoice.id,
        client: invoice.cases?.profiles?.full_name || 'Unknown Client',
        caseId: invoice.case_id,
        amount: `₹${invoice.amount.toLocaleString()}`,
        date: new Date(invoice.created_at).toLocaleDateString(),
        dueDate: new Date(invoice.due_date).toLocaleDateString(),
        status: invoice.status
      }));

      setInvoices(formattedInvoices);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      toast({
        title: "Error",
        description: "Failed to fetch invoices",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

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

  // Calculate summary amounts
  const totalAmount = invoices.reduce((sum, inv) => sum + parseFloat(inv.amount.replace('₹', '').replace(',', '')), 0);
  const paidAmount = invoices.filter(inv => inv.status === 'Paid')
    .reduce((sum, inv) => sum + parseFloat(inv.amount.replace('₹', '').replace(',', '')), 0);
  const pendingAmount = invoices.filter(inv => inv.status === 'Pending')
    .reduce((sum, inv) => sum + parseFloat(inv.amount.replace('₹', '').replace(',', '')), 0);
  const overdueAmount = invoices.filter(inv => inv.status === 'Overdue')
    .reduce((sum, inv) => sum + parseFloat(inv.amount.replace('₹', '').replace(',', '')), 0);

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
          totalAmount={`₹${totalAmount.toLocaleString()}`}
          paidAmount={`₹${paidAmount.toLocaleString()}`}
          pendingAmount={`₹${pendingAmount.toLocaleString()}`}
          overdueAmount={`₹${overdueAmount.toLocaleString()}`}
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
