import ReportsOverview from "~/lib/components/section/reports/ReportsOverview";
import Header from "../../lib/components/shared/Header";
import { ReportsTab } from "../../lib/components/section/reports/ReportsTab";
export default function Reports() {
  return (
    <div className="space-y-6">
      <Header
        title="Reports"
        subtitle="Detailed analytics and financial insights"
      />
      <ReportsOverview />
      <ReportsTab />
    </div>
  );
}
