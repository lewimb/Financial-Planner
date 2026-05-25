import DashboardAnalytics from "~/lib/components/section/dashboard/DashboardAnalytics";
import DashboardOverview from "~/lib/components/section/dashboard/DashboardOverview";
import DashboardRecentTransaction from "../../lib/components/section/dashboard/DashboardRecentTransaction";
import DashboardFinancialGoals from "~/lib/components/section/dashboard/DashboardFinancialGoals";
import Header from "~/lib/components/shared/Header";
import { Button } from "~/components/ui/button";
import { Link, redirect } from "react-router";
import type { Route } from "./+types/dashboard";
import type { DashboardResponse } from "~/lib/types/dashboard";
import type { IncomeExpenseTrendResponse } from "~/lib/types/reports";
import type { BudgetUsage } from "~/lib/types/budgets";
import { getToken } from "~/lib/utils/tokenStore";

interface LoaderData {
  dashboard: DashboardResponse | null;
  trendData: IncomeExpenseTrendResponse["data"];
  budgetUsage: BudgetUsage[];
}

export async function clientLoader(_: Route.ClientLoaderArgs) {
  const token = getToken();
  if (!token) throw redirect("/login");

  const baseUrl = import.meta.env.VITE_REACT_BASE_API_URL || "";
  const headers = { Authorization: `Bearer ${token}` };
  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;

  const safe = async (p: Promise<Response>) => {
    try {
      const r = await p;
      if (r.status === 401) throw redirect("/login");
      return r.ok ? r.json() : null;
    } catch (e) {
      if (e instanceof Response) throw e;
      return null;
    }
  };

  const [dashboardRes, trendRes, usageRes] = await Promise.all([
    safe(fetch(`${baseUrl}/auth/v1/dashboard`, { headers })),
    safe(fetch(`${baseUrl}/auth/v1/reports/income-expense-trend?year=${year}`, { headers })),
    safe(fetch(`${baseUrl}/auth/v1/budgets/usage?year=${year}&month=${month}`, { headers })),
  ]);

  return {
    dashboard: (dashboardRes?.data as DashboardResponse) ?? null,
    trendData: (trendRes as IncomeExpenseTrendResponse)?.data ?? [],
    budgetUsage: Array.isArray(usageRes) ? (usageRes as BudgetUsage[]) : [],
  } satisfies LoaderData;
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  const { dashboard, trendData, budgetUsage } = (loaderData as unknown as LoaderData) ?? {
    dashboard: null,
    trendData: [],
    budgetUsage: [],
  };

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
      <DashboardAnalytics trendData={trendData} budgetUsage={budgetUsage} />
      <div className="grid grid-cols-2 gap-6">
        <DashboardRecentTransaction
          activeGoals={dashboard?.active_goals ?? []}
        />
        <DashboardFinancialGoals goalProgress={dashboard?.goal_summary ?? null} />
      </div>
    </section>
  );
}
