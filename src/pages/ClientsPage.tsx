import { useState } from "react";
import AppLayout from "@/components/layouts/AppLayout";
import { ClientsHeader } from "@/components/client/ClientsHeader";
import { ClientsFilters } from "@/components/client/ClientsFilters";
import { ClientsTable } from "@/components/client/ClientsTable";

// Mock data
const clients = [
  {
    id: "CLIENT-001",
    name: "Raj Singh",
    email: "raj.singh@example.com",
    phone: "+91 98765 43210",
    cases: 2,
    status: "Active",
  },
  {
    id: "CLIENT-002",
    name: "Mehta Industries Ltd.",
    email: "contact@mehtaindustries.com",
    phone: "+91 22 6789 0123",
    cases: 1,
    status: "Active",
  },
  {
    id: "CLIENT-003",
    name: "Anil Kumar",
    email: "anil.kumar@example.com",
    phone: "+91 87654 32109",
    cases: 1,
    status: "Active",
  },
  {
    id: "CLIENT-004",
    name: "Sharma Family",
    email: "vsharm@example.com",
    phone: "+91 76543 21098",
    cases: 1,
    status: "Inactive",
  },
  {
    id: "CLIENT-005",
    name: "Vimal Jain",
    email: "vimal.jain@example.com",
    phone: "+91 65432 10987",
    cases: 1,
    status: "Active",
  },
];

const statusColors: Record<string, string> = {
  Active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  Inactive: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
};

const ClientsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredClients = clients.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.id.toLowerCase().includes(searchTerm.toLowerCase())
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
        />
      </div>
    </AppLayout>
  );
};

export default ClientsPage;
