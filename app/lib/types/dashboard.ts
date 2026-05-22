import type { Goal } from "./goals";

export interface DashboardResponse {
  monthly_income: number;
  monthly_expense: number;
  net_savings: number;
  budget_summary: {
    total: number;
    safe: number;
    warning: number;
    exceeded: number;
  };
  goal_summary: {
    total: number;
    active: number;
    completed: number;
  };
  active_goals: Goal[];
}
