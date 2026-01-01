import { ArrowRight } from "lucide-react";
import { NavLink } from "react-router";
import { Target } from "lucide-react";
import ProgressBar from "../../shared/ProgressBar";
import { formatRupiah } from "~/lib/utils/currencyFormatter";

export const financialGoals = [
  {
    id: 1,
    title: "Emergency Fund",
    saved: 6800,
    target: 10000,
  },
  {
    id: 2,
    title: "Vacation to Japan",
    saved: 2400,
    target: 5000,
  },
  {
    id: 3,
    title: "New Laptop",
    saved: 800,
    target: 1500,
  },
];

export default function DashboardFinancialGoals() {
  return (
    <div className="p-6 shadow-lg space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Financial Goals</h3>
        <NavLink
          className="text-blue-500 hover:text-blue-700 duration-300 text-sm flex gap-2 items-center"
          to={"/goals"}
        >
          View all
          <ArrowRight size={12} />
        </NavLink>
      </div>
      <div className="space-y-6">
        {financialGoals.map((item) => (
          <div className="space-y-2" key={item.id}>
            <div className="flex items-center gap-3">
              <Target size="16" className="text-muted-foreground" />
              <p className="text-sm font-semibold">{item.title}</p>
            </div>
            <div className="space-y-1">
              <ProgressBar start={item.saved} limit={item.target} />
              <div className="flex justify-between items-center text-muted-foreground text-xs">
                <span>{formatRupiah(item.saved)} saved</span>
                <span>
                  {(item.saved / item.target) * 100}% of{" "}
                  {formatRupiah(item.target)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
