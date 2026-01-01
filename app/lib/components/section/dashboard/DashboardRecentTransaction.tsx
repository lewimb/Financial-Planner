import { NavLink } from "react-router";
import { ArrowRight } from "lucide-react";
import { cn } from "~/lib/utils";
import { formatDate } from "~/lib/utils/dateFormmatter";
import { formatRupiah } from "../../../utils/currencyFormatter";

export const transactions = [
  {
    id: 1,
    title: "Salary Deposit",
    date: "2024-06-01",
    type: "income",
    amount: 20000,
  },
  {
    id: 2,
    title: "Grocery Store",
    date: "2024-06-03",
    type: "expense",
    amount: 10000,
  },
  {
    id: 3,
    title: "Gas Station",
    date: "2024-06-05",
    type: "expense",
    amount: 15000,
  },
  {
    id: 4,
    title: "Freelance Project",
    date: "2024-06-07",
    type: "income",
    amount: -8500,
  },
  {
    id: 5,
    title: "Netflix Subscription",
    date: "2024-06-08",
    type: "expense",
    amount: 10000,
  },
];

export default function DashboardRecentTransaction() {
  return (
    <div className="p-6 shadow-lg rounded-lg space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Recent Transactions</h3>
        <NavLink
          className="text-blue-500 hover:text-blue-700 duration-300 text-sm flex gap-2 items-center"
          to={"/"}
        >
          View all
          <ArrowRight size={12} />
        </NavLink>
      </div>
      <div className="space-y-4">
        {transactions.map((item) => (
          <div className="flex items-center justify-between" key={item.id}>
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "p-4 rounded-full bg-green-100 text-green-600",
                  item.amount < 0 && "bg-red-100 text-red-600"
                )}
              >
                <ArrowRight
                  size={16}
                  className={cn("-rotate-45", item.amount < 0 && "rotate-45")}
                />
              </div>
              <div className="text-sm">
                <p className="font-semibold">{item.title}</p>
                <p className=" text-xs text-muted-foreground">
                  {formatDate(item.date)}
                </p>
              </div>
            </div>
            <p
              className={cn(
                "font-semibold text-green-600",
                item.amount < 0 && "text-red-600"
              )}
            >
              {formatRupiah(item.amount)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
