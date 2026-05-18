import { ChatInterface } from "~/lib/components/section/ai-coach/Chatbot";
import FinancialHealth from "~/lib/components/section/ai-coach/FinancialHealth";
import FinancialRecommendation from "~/lib/components/section/ai-coach/FinancialRecommendation";
import FinancialKeyInsights from "~/lib/components/section/ai-coach/FinancialKeyInsights";
import type { Route } from "./+types/ai-coach";
import tokenParser from "~/lib/utils/tokenParser";

export function loader({ request }: Route.LoaderArgs) {
  return tokenParser(request);
}

export default function AICoach({ loaderData }: Route.ComponentProps) {
  return (
    <div className="grid grid-cols-4 gap-6">
      <div className="col-span-3">
        <ChatInterface token={loaderData?.token} />
      </div>
      <div className="space-y-3 w-full">
        <FinancialHealth />
        <FinancialKeyInsights />
        <FinancialRecommendation />
      </div>
    </div>
  );
}
