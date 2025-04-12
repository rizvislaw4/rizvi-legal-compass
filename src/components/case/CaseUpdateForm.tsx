
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
import { useState } from "react";
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

const caseUpdateSchema = z.object({
  caseId: z.string(),
  nextHearingDate: z.string().optional(),
  caseStatus: z.string(),
});

interface CaseUpdateFormProps {
  caseId: string;
  currentStatus: string;
  currentNextHearingDate?: string;
  onSuccess?: () => void;
}

export default function CaseUpdateForm({ 
  caseId, 
  currentStatus,
  currentNextHearingDate,
  onSuccess 
}: CaseUpdateFormProps) {
  const { isLawyer, isAdmin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof caseUpdateSchema>>({
    resolver: zodResolver(caseUpdateSchema),
    defaultValues: {
      caseId,
      nextHearingDate: currentNextHearingDate || '',
      caseStatus: currentStatus,
    },
  });

  async function onSubmit(values: z.infer<typeof caseUpdateSchema>) {
    if (!isLawyer && !isAdmin) {
      toast.error("Only lawyers and administrators can update cases");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('cases')
        .update({
          case_status: values.caseStatus,
          next_hearing_date: values.nextHearingDate || null,
        })
        .eq('id', values.caseId);

      if (error) throw error;
      
      toast.success("Case updated successfully");
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error(`Error updating case: ${error.message}`);
      console.error("Error updating case:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const canUpdateCase = isLawyer || isAdmin;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nextHearingDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Next Hearing Date</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  disabled={isLoading || !canUpdateCase}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="caseStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Case Status</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isLoading || !canUpdateCase}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select case status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {canUpdateCase && (
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating case...
              </>
            ) : (
              "Update Case"
            )}
          </Button>
        )}
      </form>
    </Form>
  );
}
