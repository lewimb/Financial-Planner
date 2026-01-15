import { ChatInterface } from "~/lib/components/section/ai-coach/Chatbot";
import FinancialHealth from "~/lib/components/section/ai-coach/FinancialHealth";
import FinancialRecommendation from "~/lib/components/section/ai-coach/FinancialRecommendation";
import FinancialKeyInsights from "~/lib/components/section/ai-coach/FinancialKeyInsights";
export default function AICoach() {
  return (
    <div className="grid grid-cols-4 gap-6">
      <div className="col-span-3">
        <ChatInterface />
      </div>
      <div className="space-y-3 w-full">
        <FinancialHealth />
        <FinancialKeyInsights />
        <FinancialRecommendation />
      </div>
    </div>
  );
}
