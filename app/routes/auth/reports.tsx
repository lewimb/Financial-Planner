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
import { useSearchParams } from "react-router";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Input } from "~/components/ui/input";

const monthOptions = [
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

interface LoaderData {
  dashboard: DashboardResponse | null;
  categoryBreakdown: CategoryBreakdownResponse | null;
  monthComparison: MonthComparisonV2Response | null;
  netWorth: NetWorthHistoryResponse | null;
  savingsRate: SavingsRateHistoryResponse | null;
  trend: IncomeExpenseTrendResponse | null;
  month: number;
  year: number;
}

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const token = getToken();
  if (!token) throw redirect("/login");

  const baseUrl = import.meta.env.VITE_REACT_BASE_API_URL || "";
  const headers = { Authorization: `Bearer ${token}` };
  const now = new Date();
  const params = new URL(request.url).searchParams;
  const monthParam = Number(params.get("month"));
  const yearParam = Number(params.get("year"));
  const month =
    Number.isInteger(monthParam) && monthParam >= 1 && monthParam <= 12
      ? monthParam
      : now.getMonth() + 1;
  const year =
    Number.isInteger(yearParam) && yearParam >= 1900
      ? yearParam
      : now.getFullYear();

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
    month,
    year,
  } satisfies LoaderData;
}

export default function Reports({ loaderData }: Route.ComponentProps) {
  const now = new Date();
  const {
    dashboard,
    categoryBreakdown,
    monthComparison,
    netWorth,
    savingsRate,
    trend,
    month,
    year,
  } = (loaderData as unknown as LoaderData) ?? {
    dashboard: null,
    categoryBreakdown: null,
    monthComparison: null,
    netWorth: null,
    savingsRate: null,
    trend: null,
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  };

  const [, setSearchParams] = useSearchParams();

  const handleMonthChange = (value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("month", value);
      return next;
    });
  };

  const handleYearChange = (value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("year", value);
      return next;
    });
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
    const query = `?year=${year}&month=${month}`;

    setMlLoading(true);
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
        safe(fetch(`${baseUrl}/auth/v1/ml/analysis${query}`, { headers })),
        safe(fetch(`${baseUrl}/auth/v1/ml/anomaly${query}`, { headers })),
        safe(fetch(`${baseUrl}/auth/v1/ml/insights${query}`, { headers })),
      ]);
      setAnalysis(a as MLAnalysisResponse | null);
      setAnomaly(an as MLAnomalyResponse | null);
      setInsights(i as MLInsightsResponse | null);
      setMlLoading(false);
    };
    loadML();
  }, [month, year]);

  return (
    <div className="space-y-6">
      <Header
        title="Reports"
        subtitle="Detailed analytics and financial insights"
      >
        <div className="flex items-end gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="reports-month">Month</Label>
            <Select value={String(month)} onValueChange={handleMonthChange}>
              <SelectTrigger id="reports-month" className="w-36">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {monthOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="reports-year">Year</Label>
            <Input
              id="reports-year"
              type="number"
              value={year}
              onChange={(e) => handleYearChange(e.target.value)}
              className="w-24"
            />
          </div>
        </div>
      </Header>
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
