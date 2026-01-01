import DashboardAnalytics from "~/lib/components/section/dashboard/DashboardAnalytics";
import DashboardHeader from "~/lib/components/section/dashboard/DashboardHeader";
import DashboardOverview from "~/lib/components/section/dashboard/DashboardOverview";
import DashboardRecentTransaction from "../../lib/components/section/dashboard/DashboardRecentTransaction";
import DashboardFinancialGoals from "~/lib/components/section/dashboard/DashboardFinancialGoals";

export default function Dashboard() {
  return (
    <section className="space-y-6">
      <DashboardHeader />
      <DashboardOverview />
      <DashboardAnalytics />
      <div className="grid grid-cols-2 gap-6">
        <DashboardRecentTransaction />
        <DashboardFinancialGoals />
      </div>
    </section>
  );
}
