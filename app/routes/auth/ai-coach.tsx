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

  // /ai-coach/context bundles health + insights + recommendations from one
  // consistent snapshot, so the chatbot and these panels never disagree —
  // three separate fetches could race against a mutation in between.
  try {
    const res = await fetch(`${baseUrl}/auth/v1/ai-coach/context`, { headers });
    if (res.status === 401) throw redirect("/login");
    if (!res.ok) {
      return { health: null, insights: null, recommendations: null } satisfies LoaderData;
    }
    const body = await res.json();
    return {
      health: (body.health as FinancialHealthResponse) ?? null,
      insights: (body.insights as InsightsResponse) ?? null,
      recommendations: (body.recommendations as RecommendationsResponse) ?? null,
    } satisfies LoaderData;
  } catch (e) {
    if (e instanceof Response) throw e;
    return { health: null, insights: null, recommendations: null } satisfies LoaderData;
  }
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
