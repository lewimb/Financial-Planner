import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { formatRupiah } from "../../../utils/currencyFormatter";
import type { DashboardResponse } from "~/lib/types/dashboard";

interface Props {
  data: DashboardResponse | null;
}

export default function ReportsOverview({ data }: Props) {
  const monthly_income = data?.monthly_income ?? null;
  const monthly_expense = data?.monthly_expense ?? null;
  const net_savings = data?.net_savings ?? null;
  const savings_rate =
    monthly_income && monthly_income > 0 && monthly_expense !== null
      ? Math.round(
          ((monthly_income - monthly_expense) / monthly_income) * 100,
        )
      : null;

  const items = [
    {
      id: "monthly-income",
      label: "Monthly Income",
      value: monthly_income,
      type: "currency" as const,
      positive: true,
    },
    {
      id: "monthly-expense",
      label: "Monthly Expenses",
      value: monthly_expense,
      type: "currency" as const,
      positive: false,
    },
    {
      id: "net-savings",
      label: "Net Savings",
      value: net_savings,
      type: "currency" as const,
      positive: true,
    },
    {
      id: "savings-rate",
      label: "Savings Rate",
      value: savings_rate,
      type: "percent" as const,
      positive: savings_rate !== null && savings_rate >= 0,
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-6">
      {items.map((item) => (
        <Card key={item.id}>
          <CardHeader>
            <CardTitle className="text-muted-foreground text-sm">
              {item.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              {item.value !== null ? (
                <span className="text-2xl font-bold">
                  {item.type === "currency"
                    ? formatRupiah(item.value)
                    : `${item.value}%`}
                </span>
              ) : (
                <span className="text-2xl font-bold text-muted-foreground">
                  —
                </span>
              )}
            </div>
            <p
              className={`text-xs leading-5 flex items-center gap-1 mt-1 ${
                item.positive ? "text-green-600" : "text-destructive"
              }`}
            >
              {item.positive ? (
                <TrendingUp className="size-3" />
              ) : (
                <TrendingDown className="size-3" />
              )}
              Current month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
