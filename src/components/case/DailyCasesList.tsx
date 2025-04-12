
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CaseUpdateForm from "./CaseUpdateForm";

const statusColors: Record<string, string> = {
  "Active": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  "On Hold": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  "Pending": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  "Closed": "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
};

// Format date to YYYY-MM-DD
const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export default function DailyCasesList() {
  const [loading, setLoading] = useState(true);
  const [cases, setCases] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const { isAdmin, isLawyer, user } = useAuth();

  useEffect(() => {
    fetchCasesForDate(selectedDate);
  }, [selectedDate, user]);

  const fetchCasesForDate = async (date: string) => {
    setLoading(true);
    try {
      let query = supabase
        .from('cases')
        .select(`
          id,
          title,
          client_id,
          lawyer_id,
          next_hearing_date,
          case_status,
          profiles!client_id(full_name)
        `)
        .eq('next_hearing_date', date);

      // If user is a lawyer, only show their cases
      if (isLawyer && !isAdmin && user) {
        query = query.eq('lawyer_id', user.id);
      }

      const { data, error } = await query;

      if (error) throw error;
      setCases(data || []);
    } catch (error) {
      console.error('Error fetching cases:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const handleCaseUpdate = () => {
    fetchCasesForDate(selectedDate);
    setSelectedCase(null);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md">Today's Cases</CardTitle>
        <div className="flex items-center space-x-2">
          <label htmlFor="date-select" className="text-sm text-muted-foreground">Date:</label>
          <input
            id="date-select"
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="border px-2 py-1 rounded text-sm"
          />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin text-law-primary" />
          </div>
        ) : cases.length === 0 ? (
          <p className="text-center text-muted-foreground py-6">
            No cases scheduled for this date.
          </p>
        ) : (
          <div className="space-y-4">
            {cases.map((caseItem) => (
              <div key={caseItem.id} className="border rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">{caseItem.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Client: {caseItem.profiles?.full_name || "Unknown"}
                    </p>
                  </div>
                  <Badge className={statusColors[caseItem.case_status] || statusColors["Pending"]}>
                    {caseItem.case_status || "Pending"}
                  </Badge>
                </div>

                {selectedCase === caseItem.id ? (
                  <CaseUpdateForm
                    caseId={caseItem.id}
                    currentStatus={caseItem.case_status || "Pending"}
                    currentNextHearingDate={caseItem.next_hearing_date}
                    onSuccess={handleCaseUpdate}
                  />
                ) : (
                  (isLawyer || isAdmin) && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setSelectedCase(caseItem.id)}
                      className="mt-2"
                    >
                      Update Status
                    </Button>
                  )
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
