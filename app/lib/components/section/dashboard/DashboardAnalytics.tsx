import DashboardGraph from "./DashboardGraph";
import DashboardBudgetOverview from "./DashboardBudgetOverview";
import type { IncomeExpenseTrendPoint } from "~/lib/types/reports";
import type { BudgetUsage } from "~/lib/types/budgets";

interface Props {
  trendData: IncomeExpenseTrendPoint[];
  budgetUsage: BudgetUsage[];
}

export default function DashboardAnalytics({ trendData, budgetUsage }: Props) {
  return (
    <div className="flex gap-6">
      <div className="shadow-lg w-full">
        <DashboardGraph data={trendData} />
      </div>
      <DashboardBudgetOverview data={budgetUsage} />
    </div>
  );
}
