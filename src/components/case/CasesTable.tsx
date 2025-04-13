
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface CaseTableProps {
  cases: any[];
  loading: boolean;
  canUpdateCase: boolean;
  statusColors: Record<string, string>;
}

const CasesTable = ({ 
  cases, 
  loading, 
  canUpdateCase,
  statusColors 
}: CaseTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Case ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Next Hearing</TableHead>
            <TableHead>Filed Date</TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                <div className="flex justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-law-primary" />
                </div>
              </TableCell>
            </TableRow>
          ) : cases.length > 0 ? (
            cases.map((caseItem) => (
              <TableRow key={caseItem.id}>
                <TableCell className="font-medium">{caseItem.id.slice(0, 8)}</TableCell>
                <TableCell>{caseItem.title}</TableCell>
                <TableCell>{caseItem.client.full_name}</TableCell>
                <TableCell>
                  <Badge className={statusColors[caseItem.case_status] || statusColors["Pending"]}>
                    {caseItem.case_status || "Pending"}
                  </Badge>
                </TableCell>
                <TableCell>{caseItem.next_hearing_date || "-"}</TableCell>
                <TableCell>{caseItem.created_at}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          toast.info("Viewing details for " + caseItem.id.slice(0, 8));
                          // In a real app, navigate to case details page
                        }}
                      >
                        View Details
                      </DropdownMenuItem>
                      {canUpdateCase && (
                        <>
                          <DropdownMenuItem
                            onClick={() => {
                              toast.info("Editing " + caseItem.id.slice(0, 8));
                            }}
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              toast.info("Updating status for " + caseItem.id.slice(0, 8));
                            }}
                          >
                            Update Status
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                No cases found matching your search criteria.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CasesTable;
