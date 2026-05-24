import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { MLInsightsPanel } from "./MLInsightsPanel";
import type {
  MLAnalysisResponse,
  MLAnomalyResponse,
  MLInsightsResponse,
} from "~/lib/types/ml";

interface Props {
  analysis: MLAnalysisResponse | null;
  anomaly: MLAnomalyResponse | null;
  insights: MLInsightsResponse | null;
}

export function ReportsTab({ analysis, anomaly, insights }: Props) {
  return (
    <div className="flex w-full flex-col gap-6">
      <Tabs defaultValue="ml">
        <TabsList>
          <TabsTrigger value="ml">ML Insights</TabsTrigger>
        </TabsList>

        <TabsContent className="space-y-6" value="ml">
          <MLInsightsPanel
            analysis={analysis}
            anomaly={anomaly}
            insights={insights}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
