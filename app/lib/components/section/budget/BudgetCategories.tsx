import { Button } from "~/components/ui/button";
import { Ellipsis, TrendingUp, CircleAlert } from "lucide-react";
import { formatRupiah } from "../../../utils/currencyFormatter";
import { cn } from "~/lib/utils";
import ProgressBar from "../../shared/ProgressBar";
export interface BudgetCategory {
  id: number;
  name: string;
  icon: string;
  transactions: number;
  spent: number;
  limit: number;
  changePercent: number; // vs last month
}

export const budgetCategories: BudgetCategory[] = [
  {
    id: 1,
    name: "Food & Dining",
    icon: "/dummy.svg",
    transactions: 24,
    spent: 520000,
    limit: 600000,
    changePercent: 12,
  },
  {
    id: 2,
    name: "Transportation",
    icon: "/dummy.svg",
    transactions: 8,
    spent: 10,
    limit: 200,
    changePercent: -5,
  },
  {
    id: 3,
    name: "Entertainment",
    icon: "/dummy.svg",
    transactions: 6,
    spent: 145,
    limit: 150,
    changePercent: 8,
  },
  {
    id: 4,
    name: "Shopping",
    icon: "/dummy.svg",
    transactions: 12,
    spent: 340,
    limit: 400,
    changePercent: 15,
  },
];

export default function BudgetCategories() {
  return (
    <section className="space-y-4">
      <h3 className="text-2xl font-semibold">Budget Categories</h3>
      <div className="grid grid-cols-2 gap-3">
        {budgetCategories.map((category) => {
          const nearLimit = (category.spent / category.limit) * 100 >= 80;

          return (
            <div
              key={category.id}
              className="shadow-lg p-6 space-y-6 rounded-lg border border-neutral-100"
            >
              <div className="flex items-center gap-3 justify-between">
                <div className="flex gap-3 items-center">
                  <img src={category.icon} className="size-8" alt="icon" />
                  <div>
                    <p className="font-semibold text-base">{category.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {category.transactions} transactions
                    </p>
                  </div>
                </div>
                <Button variant="ghost">
                  <Ellipsis className="size-4" />
                </Button>
              </div>
              <div className="space-y-2">
                <div className="flex flex-nowrap items-end justify-between">
                  <div className="flex gap-1 items-end">
                    <span className="text-2xl font-semibold">
                      {formatRupiah(category.spent)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      / {formatRupiah(category.limit)}
                    </span>
                  </div>
                  <div className="flex text-xs items-center text-red-600 gap-1">
                    <TrendingUp className={cn("size-3 ")} />
                    <span>{category.changePercent}</span>
                    <span>vs last month</span>
                  </div>
                </div>
                <ProgressBar
                  start={category.spent}
                  limit={category.limit}
                  startingColor={nearLimit ? "#f97316" : undefined}
                  className="h-3"
                />
                <div
                  className={cn(
                    "flex items-center justify-between text-muted-foreground font-medium text-xs",
                    nearLimit && "text-orange-600"
                  )}
                >
                  <span>
                    {Math.round((category.spent / category.limit) * 100)}% used
                  </span>
                  {nearLimit && (
                    <span className="flex items-center gap-1">
                      <CircleAlert className="size-3" />
                      Near Limit
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
