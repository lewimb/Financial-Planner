import DashboardGraph from "./DashboardGraph";
import DashboardBudgetOverview from "./DashboardBudgetOverview";
export default function DashboardAnalytics() {
  return (
    <div className="flex gap-6">
      <div className="shadow-lg w-full">
        <DashboardGraph />
      </div>
      <DashboardBudgetOverview />
    </div>
  );
}
