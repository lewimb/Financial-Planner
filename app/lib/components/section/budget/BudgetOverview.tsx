import { InfoIcon, TrendingDown, CircleCheck } from "lucide-react";
import Overview from "../../shared/Overview";

export const overviewData = [
  {
    title: "Total Budget",
    value: 500000,
    icon: TrendingDown,
    color: "blue",
  },
  {
    title: "Spent This Month",
    subtitle: "68% of budget",
    value: 15430,
    icon: InfoIcon,
    color: "orange",
  },
  {
    title: "Remaining",
    subtitle: "32% available",
    value: 1400,
    icon: CircleCheck,
    color: "green",
  },
];

export default function BudgetOverview() {
  return <Overview items={overviewData} />;
}
