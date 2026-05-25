import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { MLInsightsPanel } from "./MLInsightsPanel";
import { ReportsCategoriesPie } from "./ReportCategoriesSpending";
import ReportsMonthComparison from "./ReportsMonthComparison";
import { ReportsNetWorth } from "./ReportsNetworth";
import { ReportsSavingRate } from "./ReportsSavingRate";
import { ReportsTransactions } from "./ReportTransactions";
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

interface Props {
  analysis: MLAnalysisResponse | null;
  anomaly: MLAnomalyResponse | null;
  insights: MLInsightsResponse | null;
  mlLoading?: boolean;
  categoryBreakdown: CategoryBreakdownResponse | null;
  monthComparison: MonthComparisonV2Response | null;
  netWorth: NetWorthHistoryResponse | null;
  savingsRate: SavingsRateHistoryResponse | null;
  trend: IncomeExpenseTrendResponse | null;
}

export function ReportsTab({
  analysis,
  anomaly,
  insights,
  mlLoading,
  categoryBreakdown,
  monthComparison,
  netWorth,
  savingsRate,
  trend,
}: Props) {
  return (
    <div className="flex w-full flex-col gap-6">
      <Tabs defaultValue="ml">
        <TabsList>
          <TabsTrigger value="ml">ML Insights</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
          <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
        </TabsList>

        <TabsContent className="space-y-6" value="ml">
          <MLInsightsPanel analysis={analysis} anomaly={anomaly} insights={insights} mlLoading={mlLoading} />
        </TabsContent>

        <TabsContent className="space-y-6" value="trends">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold mb-2">Net Worth Growth</h3>
              <ReportsNetWorth data={netWorth} />
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-2">Savings Rate</h3>
              <ReportsSavingRate data={savingsRate} />
            </div>
          </div>
          <ReportsTransactions data={trend} />
        </TabsContent>

        <TabsContent className="space-y-6" value="comparison">
          <ReportsMonthComparison data={monthComparison} />
        </TabsContent>

        <TabsContent className="space-y-6" value="breakdown">
          <div className="grid grid-cols-2 gap-6">
            <ReportsCategoriesPie data={categoryBreakdown} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
