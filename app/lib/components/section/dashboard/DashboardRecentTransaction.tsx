import { NavLink } from "react-router";
import { ArrowRight, Target } from "lucide-react";
import { formatDate } from "~/lib/utils/dateFormmatter";
import { formatRupiah } from "../../../utils/currencyFormatter";
import ProgressBar from "../../shared/ProgressBar";
import type { Goal } from "~/lib/types/goals";

interface Props {
  activeGoals: Goal[];
}

export default function DashboardRecentTransaction({ activeGoals }: Props) {
  return (
    <div className="p-6 shadow-lg rounded-lg space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Active Goals</h3>
        <NavLink
          className="text-blue-500 hover:text-blue-700 duration-300 text-sm flex gap-2 items-center"
          to="/auth/goals"
        >
          View all
          <ArrowRight size={12} />
        </NavLink>
      </div>
      {activeGoals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-6 text-center space-y-2">
          <Target className="size-8 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">No active goals.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activeGoals.slice(0, 4).map((goal) => {
            const progress =
              goal.target_amount > 0
                ? Math.round((goal.current_amount / goal.target_amount) * 100)
                : 0;
            return (
              <div key={goal.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm">{goal.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(goal.deadline)}
                  </p>
                </div>
                <ProgressBar
                  start={goal.current_amount}
                  limit={goal.target_amount}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{formatRupiah(goal.current_amount)}</span>
                  <span>{progress}% of {formatRupiah(goal.target_amount)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
