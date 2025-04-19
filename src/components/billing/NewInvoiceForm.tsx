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

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      case_id: "",
      amount: "",
      due_date: "",
    },
  });

  const fetchCases = async () => {
    const { data, error } = await supabase
      .from("cases")
      .select("id, title");
    
    if (error) {
      console.error("Error fetching cases:", error);
      return;
    }

    setCases(data || []);
  };

  const generateInvoiceId = (caseId: string) => {
    const caseNumber = caseId.split('-')[1] || '000';
    const timestamp = Date.now().toString().slice(-4);
    return `INV-${caseNumber}-${timestamp}`;
  };

  const onSubmit = async (data: InvoiceFormValues) => {
    try {
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

      if (error) throw error;

      toast({
        title: "Success",
        description: `Invoice ${invoiceId} created successfully`,
      });

      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      setOpen(false);
      form.reset();

    } catch (error) {
      console.error("Error creating invoice:", error);
      toast({
        title: "Error",
        description: "Failed to create invoice",
        variant: "destructive",
      });
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
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a case" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {cases.map((case_) => (
                        <SelectItem key={case_.id} value={case_.id}>
                          {case_.title}
                        </SelectItem>
                      ))}
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
                    <Input type="number" step="0.01" placeholder="Enter amount" {...field} />
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
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">Create Invoice</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
