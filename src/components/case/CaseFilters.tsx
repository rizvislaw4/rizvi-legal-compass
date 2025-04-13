
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Filter, ChevronDown, Search } from "lucide-react";

interface CaseFiltersProps {
  onSearchChange: (term: string) => void;
  onStatusFilterChange: (status: string | null) => void;
  searchTerm: string;
}

const CaseFilters = ({ 
  onSearchChange, 
  onStatusFilterChange, 
  searchTerm 
}: CaseFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
      <div className="relative w-full md:w-72">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search cases..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8"
        />
      </div>
      <div className="flex gap-2 w-full md:w-auto">
        <Button variant="outline" size="sm" className="flex-1 md:flex-none">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex-1 md:flex-none">
              Status
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onStatusFilterChange(null)}>All</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusFilterChange("Active")}>Active</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusFilterChange("Pending")}>Pending</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusFilterChange("On Hold")}>On Hold</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusFilterChange("Closed")}>Closed</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default CaseFilters;
