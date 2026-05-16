import * as React from "react";
import type { BudgetUsage } from "~/routes/auth/budgets";
import { ChartPieDonutActive } from "../../shared/PieChart";
import { ChartPie } from "lucide-react";
import { Button } from "~/components/ui/button";

interface Props {
  items: BudgetUsage[];
  total: number;
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
      <ChartPie className="size-12 text-muted-foreground/40" />
      <div>
        <p className="font-semibold text-base">No spending data</p>
        <p className="text-sm text-muted-foreground">
          Your spending breakdown will appear here once you have active budgets.
        </p>
      </div>
    </div>
  );
}

export default function BudgetBreakdown({ items, total }: Props) {
  const [view, setView] = React.useState<"MONTHLY" | "YEARLY">("MONTHLY");

  if (!items || items.length === 0) return <EmptyState />;
  const COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444"];

  // 🔥 filter by period
  const filteredItems = items.filter((i) => i.period === view);

  if (filteredItems.length === 0) return <EmptyState />;

  // 🔥 chart data
  const chartData = filteredItems.map((val, idx) => {
    return {
      category: val.category,
      spending: val.used,
      limit: val.limit,
      fill: COLORS[idx % COLORS.length],
    };
  });

  return (
    <section className="space-y-4">
      {/* 🔥 Toggle */}
      <div className="flex gap-2">
        <Button
          variant={view === "MONTHLY" ? "default" : "outline"}
          onClick={() => setView("MONTHLY")}
        >
          Monthly
        </Button>
        <Button
          variant={view === "YEARLY" ? "default" : "outline"}
          onClick={() => setView("YEARLY")}
        >
          Yearly
        </Button>
      </div>

      {/* 🔥 Chart */}
      <ChartPieDonutActive
        chartData={chartData}
        title={`Spending Breakdown (${view})`}
      >
        <div className="w-full space-y-3">
          {chartData.map((item, index) => {
            const percent =
              item.limit > 0 ? Math.round((item.limit / total) * 100) : 0;

            return (
              <div key={index}>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{item.category}</span>

                  <div className="space-x-3">
                    <span className="font-semibold">{item.spending}</span>

                    <span className="text-xs text-muted-foreground">
                      {percent}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ChartPieDonutActive>
    </section>
  );
}
