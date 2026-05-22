import { ArrowUp, ArrowDown, Target, TrendingUp } from "lucide-react";
import { cn } from "~/lib/utils";
import { formatRupiah } from "~/lib/utils/currencyFormatter";
import type { DashboardResponse } from "~/lib/types/dashboard";

interface Props {
  monthlyIncome: number;
  monthlyExpense: number;
  netSavings: number;
  goalProgress: DashboardResponse["goal_summary"] | null;
}

export default function DashboardOverview({
  monthlyIncome,
  monthlyExpense,
  netSavings,
  goalProgress,
}: Props) {
  const cards = [
    {
      title: "Income (This Month)",
      icon: ArrowUp,
      amount: monthlyIncome,
      positive: true,
    },
    {
      title: "Expenses (This Month)",
      icon: ArrowDown,
      amount: monthlyExpense,
      positive: false,
    },
    {
      title: "Net Savings",
      icon: TrendingUp,
      amount: netSavings,
      positive: netSavings >= 0,
    },
  ];

  const completionRate =
    goalProgress && goalProgress.total > 0
      ? Math.round((goalProgress.completed / goalProgress.total) * 100)
      : 0;

  return (
    <div>
      <div className="grid grid-cols-4 gap-4">
        {cards.map((card) => (
          <div
            key={card.title}
            className="p-6 rounded-lg shadow-lg flex flex-col gap-6"
          >
            <div className="flex items-center justify-between text-sm font-medium text-muted-foreground pb-6">
              <p>{card.title}</p>
              <card.icon className="size-4" />
            </div>
            <div className="space-y-3">
              <p className="text-2xl font-semibold">
                {formatRupiah(card.amount)}
              </p>
              <div className="flex gap-2">
                <div
                  className={cn(
                    "flex gap-2 items-center",
                    card.positive ? "text-green-600" : "text-red-600",
                  )}
                >
                  <TrendingUp
                    className={cn(!card.positive && "rotate-x-180")}
                    size={16}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="p-6 rounded-lg shadow-lg flex flex-col gap-6">
          <div className="flex items-center justify-between text-sm font-medium text-muted-foreground pb-6">
            <p>Saving Goals</p>
            <Target className="h-4 w-4" />
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-semibold">{completionRate}%</p>
            <span className="text-sm text-muted-foreground">
              {goalProgress
                ? `${goalProgress.completed} of ${goalProgress.total} completed`
                : "No goals yet"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
