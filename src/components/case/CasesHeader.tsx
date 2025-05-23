
import { Button } from "@/components/ui/button";
import { Printer, Plus } from "lucide-react";

interface CasesHeaderProps {
  onAddCase: () => void;
  onPrint: () => void;
  canAddCase?: boolean; // Optional with default value
}

const CasesHeader = ({ 
  onAddCase, 
  onPrint, 
  canAddCase = true // Default to true so button is always visible
}: CasesHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">Case Management</h1>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onPrint}
        >
          <Printer className="h-4 w-4 mr-2" />
          Print
        </Button>
        
        {/* Always show the button by removing conditional rendering */}
        <Button 
          size="sm" 
          className="bg-law-primary hover:bg-law-primary/90"
          onClick={onAddCase}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Case
        </Button>
      </div>
    </div>
  );
};

export default CasesHeader;
