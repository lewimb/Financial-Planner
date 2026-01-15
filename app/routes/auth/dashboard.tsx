import DashboardAnalytics from "~/lib/components/section/dashboard/DashboardAnalytics";
import DashboardOverview from "~/lib/components/section/dashboard/DashboardOverview";
import DashboardRecentTransaction from "../../lib/components/section/dashboard/DashboardRecentTransaction";
import DashboardFinancialGoals from "~/lib/components/section/dashboard/DashboardFinancialGoals";
import Header from "~/lib/components/shared/Header";
import { Button } from "~/components/ui/button";
import { Link } from "react-router";

export default function Dashboard() {
  return (
    <section className="space-y-6">
      <Header title="Dashboard" subtitle="Overview of your financial health">
        <Link className="cursor-pointer" to="/auth/budgets">
          <Button>+ Create Budget</Button>
        </Link>
      </Header>
      <DashboardOverview />
      <DashboardAnalytics />
      <div className="grid grid-cols-2 gap-6">
        <DashboardRecentTransaction />
        <DashboardFinancialGoals />
      </div>
    </section>
  );
}
