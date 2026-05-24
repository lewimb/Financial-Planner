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
import { getToken } from "~/lib/utils/tokenStore";

interface LoaderData {
  dashboard: DashboardResponse | null;
  analysis: MLAnalysisResponse | null;
  anomaly: MLAnomalyResponse | null;
  insights: MLInsightsResponse | null;
}

const safeMLFetch = (url: string, headers: Record<string, string>) =>
  fetch(url, { headers })
    .then((r) => (r.ok ? r.json() : null))
    .catch(() => null);

export async function clientLoader(_: Route.ClientLoaderArgs) {
  const token = getToken();
  if (!token) throw redirect("/login");

  const baseUrl = import.meta.env.VITE_REACT_BASE_API_URL || "";
  const headers = { Authorization: `Bearer ${token}` };

  const [dashboardRes, analysis, anomaly, insights] = await Promise.all([
    fetch(`${baseUrl}/auth/v1/dashboard`, { headers })
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null),
    safeMLFetch(`${baseUrl}/auth/v1/ml/analysis`, headers),
    safeMLFetch(`${baseUrl}/auth/v1/ml/anomaly`, headers),
    safeMLFetch(`${baseUrl}/auth/v1/ml/insights`, headers),
  ]);

  return {
    dashboard: (dashboardRes?.data as DashboardResponse) ?? null,
    analysis: analysis as MLAnalysisResponse | null,
    anomaly: anomaly as MLAnomalyResponse | null,
    insights: insights as MLInsightsResponse | null,
  };
}

export default function Reports({ loaderData }: Route.ComponentProps) {
  const { dashboard, analysis, anomaly, insights } =
    (loaderData as unknown as LoaderData) ?? {
      dashboard: null,
      analysis: null,
      anomaly: null,
      insights: null,
    };

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
      />
    </div>
  );
}
