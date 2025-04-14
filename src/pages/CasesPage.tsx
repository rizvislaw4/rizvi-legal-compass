
import { useState, useEffect } from "react";
import AppLayout from "@/components/layouts/AppLayout";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

import CasesHeader from "@/components/case/CasesHeader";
import CaseFilters from "@/components/case/CaseFilters";
import CasesTable from "@/components/case/CasesTable";
import CaseForm from "@/components/case/CaseForm";
import statusColors from "@/utils/caseStatusColors";

type Case = {
  id: string;
  title: string;
  client: {
    full_name: string;
  };
  case_status: string;
  next_hearing_date: string | null;
  created_at: string;
};

const CasesPage = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [isAddCaseOpen, setIsAddCaseOpen] = useState(false);
  
  const navigate = useNavigate();
  const { isAdmin, isLawyer, isClient, user } = useAuth();
  
  // Determine if user can add new cases based on role
  const canAddCase = isAdmin || isLawyer;

  const fetchCases = async () => {
    setLoading(true);
    try {
      // Fetch cases from supabase
      const { data, error } = await supabase
        .from('cases')
        .select(`
          id, 
          title, 
          case_status,
          created_at,
          next_hearing_date,
          profiles!client_id (full_name)
        `);
      
      if (error) throw error;
      
      // Transform data to match our Case type
      const formattedCases = data.map((item: any) => ({
        id: item.id,
        title: item.title,
        client: {
          full_name: item.profiles?.full_name || "Unknown Client"
        },
        case_status: item.case_status || "Pending",
        next_hearing_date: item.next_hearing_date,
        created_at: new Date(item.created_at).toISOString().split('T')[0]
      }));
      
      setCases(formattedCases);
    } catch (error: any) {
      toast.error(`Error fetching cases: ${error.message}`);
      console.error("Error fetching cases:", error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchCases();
  }, [user]);
  
  const handlePrint = () => {
    toast.success("Case list sent to printer");
    window.print();
  };
  
  const filteredCases = cases.filter((c) => {
    // Apply search filter
    const matchesSearch = 
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.client.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply status filter if selected
    const matchesStatus = statusFilter ? c.case_status === statusFilter : true;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <CasesHeader 
          onAddCase={() => setIsAddCaseOpen(true)} 
          onPrint={handlePrint}
          canAddCase={canAddCase}
        />

        <CaseFilters 
          onSearchChange={setSearchTerm}
          onStatusFilterChange={setStatusFilter}
          searchTerm={searchTerm}
        />

        <CasesTable 
          cases={filteredCases} 
          loading={loading} 
          canUpdateCase={canAddCase}
          statusColors={statusColors}
        />
      </div>

      {/* Add Case Dialog */}
      <Dialog open={isAddCaseOpen} onOpenChange={setIsAddCaseOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Case</DialogTitle>
          </DialogHeader>
          <CaseForm onSuccess={() => {
            setIsAddCaseOpen(false);
            fetchCases();
          }} />
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default CasesPage;
