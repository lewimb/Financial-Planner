import DashboardAnalytics from "~/lib/components/section/dashboard/DashboardAnalytics";
import DashboardOverview from "~/lib/components/section/dashboard/DashboardOverview";
import DashboardRecentTransaction from "../../lib/components/section/dashboard/DashboardRecentTransaction";
import DashboardFinancialGoals from "~/lib/components/section/dashboard/DashboardFinancialGoals";
import Header from "~/lib/components/shared/Header";
import { Button } from "~/components/ui/button";
import { Link, redirect } from "react-router";
import type { Route } from "./+types/dashboard";
import type { DashboardResponse } from "~/lib/types/dashboard";
import { getToken } from "~/lib/utils/tokenStore";

export async function clientLoader(_: Route.ClientLoaderArgs) {
  const token = getToken();
  if (!token) throw redirect("/login");

  const baseUrl = import.meta.env.VITE_REACT_BASE_API_URL || "";
  try {
    const response = await fetch(`${baseUrl}/auth/v1/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.status === 401) throw redirect("/login");
    if (!response.ok) return null;
    const { data }: { data: DashboardResponse } = await response.json();
    return data;
  } catch {
    return null;
  }
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  const dashboard = loaderData as DashboardResponse | null;

  return (
    <section className="space-y-6">
      <Header title="Dashboard" subtitle="Overview of your financial health">
        <Link className="cursor-pointer" to="/auth/budgets">
          <Button>+ Create Budget</Button>
        </Link>
      </Header>
      <DashboardOverview
        monthlyIncome={dashboard?.monthly_income ?? 0}
        monthlyExpense={dashboard?.monthly_expense ?? 0}
        netSavings={dashboard?.net_savings ?? 0}
        goalProgress={dashboard?.goal_summary ?? null}
      />
      <DashboardAnalytics />
      <div className="grid grid-cols-2 gap-6">
        <DashboardRecentTransaction
          activeGoals={dashboard?.active_goals ?? []}
        />
        <DashboardFinancialGoals goalProgress={dashboard?.goal_summary ?? null} />
      </div>
    </section>
  );
}
