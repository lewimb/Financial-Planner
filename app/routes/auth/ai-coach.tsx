import { redirect } from "react-router";
import type { Route } from "./+types/ai-coach";
import { getToken } from "~/lib/utils/tokenStore";
import { ChatInterface } from "~/lib/components/section/ai-coach/Chatbot";
import FinancialHealth from "~/lib/components/section/ai-coach/FinancialHealth";
import FinancialRecommendation from "~/lib/components/section/ai-coach/FinancialRecommendation";
import FinancialKeyInsights from "~/lib/components/section/ai-coach/FinancialKeyInsights";
import type {
  FinancialHealthResponse,
  InsightsResponse,
  RecommendationsResponse,
} from "~/lib/types/ai-coach";

interface LoaderData {
  health: FinancialHealthResponse | null;
  insights: InsightsResponse | null;
  recommendations: RecommendationsResponse | null;
}

export async function clientLoader(_: Route.ClientLoaderArgs) {
  const token = getToken();
  if (!token) throw redirect("/login");

  const baseUrl = import.meta.env.VITE_REACT_BASE_API_URL || "";
  const headers = { Authorization: `Bearer ${token}` };
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

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

  const [health, insights, recommendations] = await Promise.all([
    safe(fetch(`${baseUrl}/auth/v1/financial-health`, { headers })),
    safe(fetch(`${baseUrl}/auth/v1/insights?month=${month}&year=${year}`, { headers })),
    safe(fetch(`${baseUrl}/auth/v1/recommendations`, { headers })),
  ]);

  return {
    health: health as FinancialHealthResponse | null,
    insights: insights as InsightsResponse | null,
    recommendations: recommendations as RecommendationsResponse | null,
  } satisfies LoaderData;
}

export default function AICoach({ loaderData }: Route.ComponentProps) {
  const { health, insights, recommendations } = (loaderData as unknown as LoaderData) ?? {
    health: null,
    insights: null,
    recommendations: null,
  };

  return (
    <div className="grid grid-cols-4 gap-6">
      <div className="col-span-3">
        <ChatInterface />
      </div>
      <div className="space-y-3 w-full">
        <FinancialHealth data={health} />
        <FinancialKeyInsights data={insights} />
        <FinancialRecommendation data={recommendations} />
      </div>
    </div>
  );
}
