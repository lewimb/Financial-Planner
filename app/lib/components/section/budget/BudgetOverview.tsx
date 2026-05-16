import { InfoIcon, TrendingDown, CircleCheck } from "lucide-react";
import Overview from "../../shared/Overview";

interface Props {
  totalBudget?: number;
  totalSpending?: number;
  remainingBudget?: number;
  remainingPercentage?: number;
}

export default function BudgetOverview({
  totalBudget = 0,
  totalSpending = 1,
  remainingBudget = 0,
  remainingPercentage,
}: Props) {
  const expensePercentage = (totalSpending / totalBudget) * 100;

  const overviewData = [
    {
      title: "Total Budget This Month",
      value: totalBudget,
      icon: TrendingDown,
      color: "blue",
    },
    {
      title: "Spent This Month",
      subtitle: `${expensePercentage}% of budget`,
      value: totalSpending,
      icon: InfoIcon,
      color: "orange",
    },
    {
      title: "Remaining This Month",
      subtitle: `${remainingPercentage}% available`,
      value: remainingBudget,
      icon: CircleCheck,
      color: "green",
    },
  ];

  return <Overview items={overviewData} />;
}
