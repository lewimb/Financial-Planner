import ReportsOverview from "~/lib/components/section/reports/ReportsOverview";
import Header from "../../lib/components/shared/Header";
import { ReportsTab } from "../../lib/components/section/reports/ReportsTab";
import type { Route } from "./+types/reports";
import tokenParser from "~/lib/utils/tokenParser";
import type { DashboardResponse } from "~/lib/types/dashboard";
import type {
  MLAnalysisResponse,
  MLAnomalyResponse,
  MLInsightsResponse,
} from "~/lib/types/ml";

interface LoaderData {
  token: string;
  dashboard: DashboardResponse | null;
  analysis: MLAnalysisResponse | null;
  anomaly: MLAnomalyResponse | null;
  insights: MLInsightsResponse | null;
}

const safeMLFetch = (url: string, headers: Record<string, string>) =>
  fetch(url, { headers })
    .then((r) => (r.ok ? r.json() : null))
    .catch(() => null);

export async function loader({ request }: Route.LoaderArgs) {
  const { token } = tokenParser(request);
  const baseUrl = process.env.API_BASE_URL;
  const headers = { Authorization: `Bearer ${token}` };

  const [dashboardRes, analysis, anomaly, insights] = await Promise.all([
    fetch(`${baseUrl}/auth/v1/dashboard`, { headers })
      .then((r) => r.json())
      .catch(() => null),
    safeMLFetch(`${baseUrl}/auth/v1/ml/analysis`, headers),
    safeMLFetch(`${baseUrl}/auth/v1/ml/anomaly`, headers),
    safeMLFetch(`${baseUrl}/auth/v1/ml/insights`, headers),
  ]);

  return {
    token,
    dashboard: (dashboardRes?.data as DashboardResponse) ?? null,
    analysis: analysis as MLAnalysisResponse | null,
    anomaly: anomaly as MLAnomalyResponse | null,
    insights: insights as MLInsightsResponse | null,
  };
}

export default function Reports({ loaderData }: Route.ComponentProps) {
  const { token, dashboard, analysis, anomaly, insights } =
    loaderData as unknown as LoaderData;

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
        token={token}
      />
    </div>
  );
}
