import { NavLink } from "react-router";
import { ArrowRight } from "lucide-react";
import ProgressBar from "../../shared/ProgressBar";

export const budgetData = [
  {
    category: "Food & Dining",
    used: 420,
    limit: 600,
    percentage: 70, // (420 / 600) * 100
  },
  {
    category: "Transportation",
    used: 180,
    limit: 200,
    percentage: 90,
  },
  {
    category: "Entertainment",
    used: 95,
    limit: 150,
    percentage: 63.33,
  },
  {
    category: "Shopping",
    used: 340,
    limit: 400,
    percentage: 85,
  },
];

export default function DashboardBudgetOverview() {
  return (
    <div className="min-w-130 h-fit shadow-lg rounded-lg p-6 space-y-6 ">
      <div className="flex justify-between">
        <span className="font-semibold">Budget Overview</span>
        <NavLink
          className="text-blue-500 hover:text-blue-700 duration-300 text-sm flex gap-2 items-center"
          to={"/"}
        >
          View all
          <ArrowRight size={12} />
        </NavLink>
      </div>
      <div className="space-y-4">
        {budgetData.map((item) => (
          <div className="space-y-2" key={item.category}>
            <div className="flex justify-between items-center">
              <p className="text-sm font-semibold">{item.category}</p>
              <p className="text-muted-foreground text-sm">
                {item.used} / {item.limit}
              </p>
            </div>
            <ProgressBar start={item.used} limit={item.limit} />
          </div>
        ))}
      </div>
    </div>
  );
}
