import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { ArrowUpRight } from "lucide-react";
import { cn } from "~/lib/utils";
import { formatRupiah } from "~/lib/utils/currencyFormatter";
import { Separator } from "~/components/ui/separator";

export const M_O_M_DATA = [
  {
    title: "Income",
    currentValue: 5420,
    previousValue: 5300,
    percentageChange: 2.3, // (5420-5300)/5300
    isPositive: true,
  },
  {
    title: "Expenses",
    currentValue: 3240,
    previousValue: 3500,
    percentageChange: -7.4, // (3240-3500)/3500
    isPositive: false,
  },
  {
    title: "Savings",
    currentValue: 2180,
    previousValue: 1800,
    percentageChange: 21.1, // (2180-1800)/1800
    isPositive: true,
  },
  {
    title: "Transactions",
    currentValue: 52,
    previousValue: 48,
    percentageChange: 8.3, // (52-48)/48
    isPositive: false,
  },
];

export default function ReportsMonthComparison() {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Month-over-Month Comparison</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {M_O_M_DATA.map((item, idx) => (
            <div key={idx}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="text-xs text-muted-foreground">
                    Current vs Previous Month
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-end    ">
                    {item.title !== "Transactions"
                      ? formatRupiah(item.currentValue)
                      : item.currentValue}
                  </p>
                  <p
                    className={cn(
                      "flex items-center gap-1 text-xs justify-end text-green-600",
                      item.isPositive === false && "text-destructive"
                    )}
                  >
                    <ArrowUpRight
                      className={cn(
                        "size-3.5",
                        item.isPositive === false && "rotate-z-90"
                      )}
                    />
                    {item.percentageChange}%
                  </p>
                </div>
              </div>
              {idx < M_O_M_DATA.length - 1 && (
                <Separator className="mt-2 size-1" />
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
