import ReportsOverview from "~/lib/components/section/reports/ReportsOverview";
import Header from "../../lib/components/shared/Header";
import { ReportsTab } from "../../lib/components/section/reports/ReportsTab";
import type { Route } from "./+types/reports";
import { redirect } from "react-router";
import type { DashboardResponse } from "~/lib/types/dashboard";
import type {
  MLAnalysisResponse,
  MLAnomalyResponse,
  MLInsightsResponse,
} from "~/lib/types/ml";
import type {
  CategoryBreakdownResponse,
  MonthComparisonV2Response,
  NetWorthHistoryResponse,
  SavingsRateHistoryResponse,
  IncomeExpenseTrendResponse,
} from "~/lib/types/reports";
import { getToken } from "~/lib/utils/tokenStore";
import { useEffect, useState } from "react";

interface LoaderData {
  dashboard: DashboardResponse | null;
  categoryBreakdown: CategoryBreakdownResponse | null;
  monthComparison: MonthComparisonV2Response | null;
  netWorth: NetWorthHistoryResponse | null;
  savingsRate: SavingsRateHistoryResponse | null;
  trend: IncomeExpenseTrendResponse | null;
}

export async function clientLoader(_: Route.ClientLoaderArgs) {
  const token = getToken();
  if (!token) throw redirect("/login");

  const baseUrl = import.meta.env.VITE_REACT_BASE_API_URL || "";
  const headers = { Authorization: `Bearer ${token}` };
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

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

  const [
    dashboardRes,
    categoryBreakdown,
    monthComparison,
    netWorth,
    savingsRate,
    trend,
  ] = await Promise.all([
    safe(fetch(`${baseUrl}/auth/v1/dashboard`, { headers })),
    safe(fetch(`${baseUrl}/auth/v1/transactions/category-breakdown?month=${month}&year=${year}`, { headers })),
    safe(fetch(`${baseUrl}/auth/v1/reports/month-comparison-v2?month=${month}&year=${year}`, { headers })),
    safe(fetch(`${baseUrl}/auth/v1/reports/networth-history?year=${year}`, { headers })),
    safe(fetch(`${baseUrl}/auth/v1/reports/savings-rate-history?year=${year}`, { headers })),
    safe(fetch(`${baseUrl}/auth/v1/reports/income-expense-trend?year=${year}`, { headers })),
  ]);

  return {
    dashboard: (dashboardRes?.data as DashboardResponse) ?? null,
    categoryBreakdown: categoryBreakdown as CategoryBreakdownResponse | null,
    monthComparison: monthComparison as MonthComparisonV2Response | null,
    netWorth: netWorth as NetWorthHistoryResponse | null,
    savingsRate: savingsRate as SavingsRateHistoryResponse | null,
    trend: trend as IncomeExpenseTrendResponse | null,
  } satisfies LoaderData;
}

export default function Reports({ loaderData }: Route.ComponentProps) {
  const {
    dashboard,
    categoryBreakdown,
    monthComparison,
    netWorth,
    savingsRate,
    trend,
  } = (loaderData as unknown as LoaderData) ?? {
    dashboard: null,
    categoryBreakdown: null,
    monthComparison: null,
    netWorth: null,
    savingsRate: null,
    trend: null,
  };

  const [analysis, setAnalysis] = useState<MLAnalysisResponse | null>(null);
  const [anomaly, setAnomaly] = useState<MLAnomalyResponse | null>(null);
  const [insights, setInsights] = useState<MLInsightsResponse | null>(null);
  const [mlLoading, setMlLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    const baseUrl = import.meta.env.VITE_REACT_BASE_API_URL || "";
    const headers = { Authorization: `Bearer ${token}` };

    const loadML = async () => {
      const safe = async (p: Promise<Response>) => {
        try {
          const r = await p;
          return r.ok ? r.json() : null;
        } catch {
          return null;
        }
      };
      const [a, an, i] = await Promise.all([
        safe(fetch(`${baseUrl}/auth/v1/ml/analysis`, { headers })),
        safe(fetch(`${baseUrl}/auth/v1/ml/anomaly`, { headers })),
        safe(fetch(`${baseUrl}/auth/v1/ml/insights`, { headers })),
      ]);
      setAnalysis(a as MLAnalysisResponse | null);
      setAnomaly(an as MLAnomalyResponse | null);
      setInsights(i as MLInsightsResponse | null);
      setMlLoading(false);
    };
    loadML();
  }, []);

  return (
    <div className="space-y-6">
      <Header
        title="Reports"
        subtitle="Detailed analytics and financial insights"
      />
      <ReportsOverview data={dashboard} />
      <ReportsTab
        analysis={analysis}
        anomaly={anomaly}
        insights={insights}
        mlLoading={mlLoading}
        categoryBreakdown={categoryBreakdown}
        monthComparison={monthComparison}
        netWorth={netWorth}
        savingsRate={savingsRate}
        trend={trend}
      />
    </div>
  );
}
