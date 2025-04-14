
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  caseId: z.string({ 
    required_error: "Please select a case" 
  }),
  hearingDate: z.date({
    required_error: "Please select a date for the hearing",
  }),
});

type FormValues = z.infer<typeof formSchema>;

type Case = {
  id: string;
  title: string;
};

interface CaseHearingFormProps {
  onSuccess: () => void;
  selectedDate?: Date;
}

const CaseHearingForm = ({ onSuccess, selectedDate }: CaseHearingFormProps) => {
  const [cases, setCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hearingDate: selectedDate || new Date(),
    },
  });
  
  // Fetch all active cases for dropdown
  useEffect(() => {
    const fetchCases = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('cases')
          .select('id, title');
        
        if (error) throw error;
        setCases(data || []);
      } catch (error: any) {
        toast.error(`Error loading cases: ${error.message}`);
        console.error("Error loading cases:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCases();
  }, []);
  
  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('cases')
        .update({ next_hearing_date: values.hearingDate.toISOString().split('T')[0] })
        .eq('id', values.caseId);
      
      if (error) throw error;
      
      onSuccess();
    } catch (error: any) {
      toast.error(`Error scheduling hearing: ${error.message}`);
      console.error("Error scheduling hearing:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="caseId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Case</FormLabel>
              <Select
                disabled={isLoading}
                onValueChange={field.onChange}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a case" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {cases.length > 0 ? (
                    cases.map((caseItem) => (
                      <SelectItem key={caseItem.id} value={caseItem.id}>
                        {caseItem.title}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="loading" disabled>
                      No cases available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="hearingDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Hearing Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-3">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Schedule Hearing"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CaseHearingForm;
