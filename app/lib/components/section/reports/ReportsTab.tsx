import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { ReportsNetWorth } from "./ReportsNetworth";
import ReportsMonthComparison from "./ReportsMonthComparison";
import { ReportsTransactions } from "./ReportTransactions";
import { ReportsCategoriesPie } from "./ReportCategoriesSpending";
import { ReportsSavingRate } from "./ReportsSavingRate";
import ReportsTrendsMetrics from "./ReportsTrendsMetric";

export function ReportsTab() {
  return (
    <div className="flex w-full flex-col gap-6">
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>
        <TabsContent className="space-y-6" value="overview">
          <div className="grid grid-cols-2 gap-6">
            <ReportsNetWorth />
            <ReportsMonthComparison />
          </div>
          <ReportsTransactions />
        </TabsContent>
        <TabsContent className="grid grid-cols-2 gap-6" value="categories">
          <ReportsCategoriesPie />
          <ReportsMonthComparison />
        </TabsContent>
        <TabsContent className="space-y-6" value="trends">
          <ReportsSavingRate />
          <ReportsTrendsMetrics />
        </TabsContent>
      </Tabs>
    </div>
  );
}
