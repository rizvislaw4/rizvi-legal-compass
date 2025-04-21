
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { currencyConfig } from "@/utils/currencyConfig";
import { Loader2 } from "lucide-react";

const invoiceSchema = z.object({
  case_id: z.string().min(1, "Case is required"),
  amount: z.string().min(1, "Amount is required"),
  due_date: z.string().min(1, "Due date is required"),
});

type InvoiceFormValues = z.infer<typeof invoiceSchema>;

export function NewInvoiceForm() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [cases, setCases] = useState<Array<{ id: string; title: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      case_id: "",
      amount: "",
      due_date: "",
    },
  });

  const fetchCases = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("cases")
        .select("id, title");
      
      if (error) {
        console.error("Error fetching cases:", error);
        toast.error(`Error loading cases: ${error.message}`);
        return;
      }

      setCases(data || []);
    } catch (error: any) {
      console.error("Error in fetchCases:", error);
      toast.error("Failed to load cases");
    } finally {
      setIsLoading(false);
    }
  };

  const generateInvoiceId = (caseId: string) => {
    const timestamp = Date.now().toString().slice(-6);
    return `INV-${timestamp}`;
  };

  const onSubmit = async (data: InvoiceFormValues) => {
    try {
      setIsLoading(true);
      const invoiceId = generateInvoiceId(data.case_id);
      
      const { error } = await supabase
        .from("invoices")
        .insert({
          id: invoiceId,
          amount: parseFloat(data.amount),
          case_id: data.case_id,
          due_date: data.due_date,
          status: "Pending"
        });

      if (error) {
        console.error("Invoice creation error:", error);
        throw error;
      }

      toast({
        title: "Success",
        description: `Invoice ${invoiceId} created successfully`,
      });

      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      setOpen(false);
      form.reset();

    } catch (error: any) {
      console.error("Error creating invoice:", error);
      toast({
        title: "Error",
        description: `Failed to create invoice: ${error.message}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (isOpen) {
        fetchCases();
      }
    }}>
      <DialogTrigger asChild>
        <Button>New Invoice</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Invoice</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="case_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Case</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={isLoading ? "Loading cases..." : "Select a case"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {cases.length === 0 && isLoading ? (
                        <SelectItem value="loading" disabled>
                          <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Loading cases...
                          </div>
                        </SelectItem>
                      ) : cases.length === 0 ? (
                        <SelectItem value="none" disabled>No cases available</SelectItem>
                      ) : (
                        cases.map((case_) => (
                          <SelectItem key={case_.id} value={case_.id}>
                            {case_.title}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount ({currencyConfig.symbol})</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="Enter amount" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="due_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Invoice"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
