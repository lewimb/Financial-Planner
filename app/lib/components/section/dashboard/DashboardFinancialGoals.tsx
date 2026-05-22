import { ArrowRight, Target } from "lucide-react";
import { NavLink } from "react-router";
import type { DashboardResponse } from "~/lib/types/dashboard";

interface Props {
  goalProgress: DashboardResponse["goal_summary"] | null;
}

export default function DashboardFinancialGoals({ goalProgress }: Props) {
  return (
    <div className="p-6 shadow-lg space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Financial Goals</h3>
        <NavLink
          className="text-blue-500 hover:text-blue-700 duration-300 text-sm flex gap-2 items-center"
          to="/auth/goals"
        >
          View all
          <ArrowRight size={12} />
        </NavLink>
      </div>

      {!goalProgress || goalProgress.total === 0 ? (
        <div className="flex flex-col items-center justify-center py-6 text-center space-y-2">
          <Target className="size-8 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">No goals yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 rounded-lg bg-muted space-y-1">
              <p className="text-2xl font-semibold">{goalProgress.total}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
            <div className="p-3 rounded-lg bg-green-50 space-y-1">
              <p className="text-2xl font-semibold text-green-600">
                {goalProgress.completed}
              </p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50 space-y-1">
              <p className="text-2xl font-semibold text-blue-600">
                {goalProgress.active}
              </p>
              <p className="text-xs text-muted-foreground">Active</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
