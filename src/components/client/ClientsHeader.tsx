
import { Button } from "@/components/ui/button";
import { Printer, Plus } from "lucide-react";
import { CreateClientDialog } from "./CreateClientDialog";
import { useToast } from "@/hooks/use-toast";

export const ClientsHeader = () => {
  const { toast } = useToast();
  
  const handlePrint = () => {
    toast({
      title: "Printing Clients",
      description: "Client list sent to printer"
    });
    window.print();
  };

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">Client Management</h1>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handlePrint}
        >
          <Printer className="h-4 w-4 mr-2" />
          Print
        </Button>
        <CreateClientDialog>
          <Button 
            size="sm" 
            className="bg-law-primary hover:bg-law-primary/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Client
          </Button>
        </CreateClientDialog>
      </div>
    </div>
  );
};
