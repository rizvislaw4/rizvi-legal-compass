
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const caseFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  clientId: z.string().uuid("Please select a client"),
  description: z.string().optional(),
  caseStatus: z.string().default("Pending"),
  nextHearingDate: z.string().optional(),
});

interface CaseFormProps {
  onSuccess?: () => void;
  initialData?: any; // For future edit functionality
}

export default function CaseForm({ onSuccess, initialData }: CaseFormProps) {
  const { isLawyer, isAdmin, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [clients, setClients] = useState<{ id: string; full_name: string }[]>([]);

  const form = useForm<z.infer<typeof caseFormSchema>>({
    resolver: zodResolver(caseFormSchema),
    defaultValues: initialData || {
      title: "",
      clientId: "",
      description: "",
      caseStatus: "Pending",
      nextHearingDate: "",
    },
  });

  // Fetch available clients
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name')
          .eq('role', 'client');
          
        if (error) throw error;
        setClients(data || []);
      } catch (error: any) {
        console.error("Error fetching clients:", error);
        toast.error(`Error loading clients: ${error.message}`);
      }
    };

    fetchClients();
  }, []);

  async function onSubmit(values: z.infer<typeof caseFormSchema>) {
    if (!isLawyer && !isAdmin) {
      toast.error("Only lawyers and administrators can create cases");
      return;
    }

    if (!user) {
      toast.error("You must be logged in to create a case");
      return;
    }

    setIsLoading(true);
    try {
      const newCase = {
        title: values.title,
        client_id: values.clientId,
        lawyer_id: user.id,
        description: values.description,
        case_status: values.caseStatus,
        next_hearing_date: values.nextHearingDate || null,
        status: "active", // Default status for new cases
      };

      const { error } = await supabase
        .from('cases')
        .insert([newCase]);

      if (error) throw error;
      
      toast.success("Case created successfully");
      form.reset();
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error(`Error creating case: ${error.message}`);
      console.error("Error creating case:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const canCreateCase = isLawyer || isAdmin;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Case Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter case title"
                  {...field}
                  disabled={isLoading || !canCreateCase}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="clientId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isLoading || !canCreateCase}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.full_name}
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter case description"
                  {...field}
                  disabled={isLoading || !canCreateCase}
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="caseStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Case Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isLoading || !canCreateCase}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="On Hold">On Hold</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nextHearingDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Next Hearing Date</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    disabled={isLoading || !canCreateCase}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {canCreateCase && (
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating case...
              </>
            ) : (
              "Create Case"
            )}
          </Button>
        )}
      </form>
    </Form>
  );
}
