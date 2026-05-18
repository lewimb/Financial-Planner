import DashboardAnalytics from "~/lib/components/section/dashboard/DashboardAnalytics";
import DashboardOverview from "~/lib/components/section/dashboard/DashboardOverview";
import DashboardRecentTransaction from "../../lib/components/section/dashboard/DashboardRecentTransaction";
import DashboardFinancialGoals from "~/lib/components/section/dashboard/DashboardFinancialGoals";
import Header from "~/lib/components/shared/Header";
import { Button } from "~/components/ui/button";
import { Link } from "react-router";
import type { Route } from "./+types/dashboard";
import tokenParser from "~/lib/utils/tokenParser";
import type { DashboardResponse } from "~/lib/types/dashboard";

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const { token } = tokenParser(request);
    const baseUrl = process.env.VITE_REACT_BASE_API_URL;

    const response = await fetch(`${baseUrl}/auth/v1/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    });

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
