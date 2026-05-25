import { NavLink } from "react-router";
import { ArrowRight } from "lucide-react";
import ProgressBar from "../../shared/ProgressBar";
import type { BudgetUsage } from "~/lib/types/budgets";

interface Props {
  data: BudgetUsage[];
}

export default function DashboardBudgetOverview({ data }: Props) {
  return (
    <div className="min-w-130 h-fit shadow-lg rounded-lg p-6 space-y-6 ">
      <div className="flex justify-between">
        <span className="font-semibold">Budget Overview</span>
        <NavLink
          className="text-blue-500 hover:text-blue-700 duration-300 text-sm flex gap-2 items-center"
          to={"/auth/budgets"}
        >
          View all
          <ArrowRight size={12} />
        </NavLink>
      </div>
      <div className="space-y-4">
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground">No budgets found.</p>
        ) : (
          data.map((item) => (
            <div className="space-y-2" key={item.budget_id}>
              <div className="flex justify-between items-center">
                <p className="text-sm font-semibold">{item.category}</p>
                <p className="text-muted-foreground text-sm">
                  {item.used} / {item.limit}
                </p>
              </div>
              <ProgressBar start={item.used} limit={item.limit} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
