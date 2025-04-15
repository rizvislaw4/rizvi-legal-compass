
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BillingSummaryProps {
  totalAmount: string;
  paidAmount: string;
  pendingAmount: string;
  overdueAmount: string;
}

export function BillingSummaryCards({
  totalAmount,
  paidAmount,
  pendingAmount,
  overdueAmount,
}: BillingSummaryProps) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Invoiced</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalAmount}</div>
          <p className="text-xs text-muted-foreground mt-1">From 5 clients</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Paid</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{paidAmount}</div>
          <p className="text-xs text-muted-foreground mt-1">13% of total</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Pending</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{pendingAmount}</div>
          <p className="text-xs text-muted-foreground mt-1">61% of total</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Overdue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">{overdueAmount}</div>
          <p className="text-xs text-muted-foreground mt-1">26% of total</p>
        </CardContent>
      </Card>
    </div>
  );
}
