
import { useState, useEffect } from "react";
import AppLayout from "@/components/layouts/AppLayout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import CasesHeader from "@/components/case/CasesHeader";
import CaseFilters from "@/components/case/CaseFilters";
import CasesTable from "@/components/case/CasesTable";
import statusColors from "@/utils/caseStatusColors";

export default function ActiveCasesPage() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchActiveCases = async () => {
    try {
      const { data, error } = await supabase
        .from('cases')
        .select(`
          *,
          profiles!cases_client_id_fkey (
            full_name
          )
        `)
        .eq('case_status', 'Active');

      if (error) throw error;

      const formattedCases = data.map(caseItem => ({
        id: caseItem.id,
        title: caseItem.title,
        client: caseItem.profiles?.full_name || 'Unknown Client',
        status: caseItem.case_status,
        nextHearing: caseItem.next_hearing_date,
        createdAt: new Date(caseItem.created_at).toLocaleDateString()
      }));

      setCases(formattedCases);
    } catch (error) {
      console.error('Error fetching active cases:', error);
      toast({
        title: "Error",
        description: "Failed to fetch active cases",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveCases();
  }, []);

  const filteredCases = cases.filter(caseItem =>
    caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    caseItem.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    caseItem.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Active Cases</h1>
        </div>

        <CaseFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onStatusFilterChange={setStatusFilter}
        />

        <CasesTable
          cases={filteredCases}
          loading={loading}
          canUpdateCase={true}
          statusColors={statusColors}
        />
      </div>
    </AppLayout>
  );
}
