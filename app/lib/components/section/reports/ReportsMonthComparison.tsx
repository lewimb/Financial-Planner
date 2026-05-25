import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { ArrowUpRight } from "lucide-react";
import { cn } from "~/lib/utils";
import { formatRupiah } from "~/lib/utils/currencyFormatter";
import { Separator } from "~/components/ui/separator";
import type { MonthComparisonV2Response } from "~/lib/types/reports";

interface Props {
  data: MonthComparisonV2Response | null;
}

export default function ReportsMonthComparison({ data }: Props) {
  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Month-over-Month Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No data available.</p>
        </CardContent>
      </Card>
    );
  }

  const rows = [
    {
      title: "Income",
      currentValue: data.current.income,
      pct: data.changes.income_pct,
      isPositive: data.changes.income_pct >= 0,
      isCurrency: true,
    },
    {
      title: "Expenses",
      currentValue: data.current.expense,
      pct: data.changes.expense_pct,
      isPositive: data.changes.expense_pct <= 0,
      isCurrency: true,
    },
    {
      title: "Savings",
      currentValue: data.current.savings,
      pct: data.changes.savings_pct,
      isPositive: data.changes.savings_pct >= 0,
      isCurrency: true,
    },
  ];

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Month-over-Month Comparison</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {rows.map((item, idx) => (
            <div key={idx}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="text-xs text-muted-foreground">
                    Current vs Previous Month
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-end">
                    {item.isCurrency
                      ? formatRupiah(item.currentValue)
                      : item.currentValue}
                  </p>
                  <p
                    className={cn(
                      "flex items-center gap-1 text-xs justify-end text-green-600",
                      !item.isPositive && "text-destructive"
                    )}
                  >
                    <ArrowUpRight
                      className={cn(
                        "size-3.5",
                        !item.isPositive && "rotate-z-90"
                      )}
                    />
                    {item.pct.toFixed(1)}%
                  </p>
                </div>
              </div>
              {idx < rows.length - 1 && <Separator className="mt-2 size-1" />}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
