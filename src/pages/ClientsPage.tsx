
import { useState, useEffect } from "react";
import AppLayout from "@/components/layouts/AppLayout";
import { ClientsHeader } from "@/components/client/ClientsHeader";
import { ClientsFilters } from "@/components/client/ClientsFilters";
import { ClientsTable } from "@/components/client/ClientsTable";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Status color mapping
const statusColors: Record<string, string> = {
  Active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  Inactive: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
};

const ClientsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("profiles")
          .select(`
            id,
            full_name,
            email,
            role,
            cases:cases(*)
          `)
          .eq("role", "client");

        if (error) {
          throw error;
        }

        // Format client data for the table
        const formattedClients = data.map(client => ({
          id: client.id,
          name: client.full_name,
          email: client.email,
          phone: "Not Available", // Phone not currently stored in profiles
          cases: client.cases ? client.cases.length : 0,
          status: "Active" // Default status
        }));
        
        setClients(formattedClients);
      } catch (error: any) {
        console.error("Error fetching clients:", error);
        toast.error(`Error loading clients: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const filteredClients = clients.filter((c) =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">
        <ClientsHeader />
        <ClientsFilters 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        <ClientsTable 
          clients={filteredClients}
          statusColors={statusColors}
          loading={loading}
        />
      </div>
    </AppLayout>
  );
};

export default ClientsPage;
