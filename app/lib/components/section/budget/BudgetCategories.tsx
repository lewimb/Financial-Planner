import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Ellipsis,
  TrendingUp,
  CircleAlert,
  FolderOpen,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { formatRupiah } from "../../../utils/currencyFormatter";
import { cn } from "~/lib/utils";
import ProgressBar from "../../shared/ProgressBar";
import type { BudgetUsage } from "~/lib/types/budgets";
import { Popover, PopoverTrigger } from "~/components/ui/popover";
import { BudgetPopoverContent } from "./BudgetPopover";

type Period = "ALL" | "MONTHLY" | "YEARLY";

interface Props {
  items: BudgetUsage[];
}

const statusConfig: Record<
  string,
  { icon: React.ReactNode; message: string; className: string }
> = {
  SAFE: {
    icon: <CheckCircle className="size-3" />,
    message: "On Track",
    className: "text-green-500",
  },
  WARNING: {
    icon: <AlertTriangle className="size-3" />,
    message: "Near Limit",
    className: "text-orange-500",
  },
  EXCEEDED: {
    icon: <XCircle className="size-3" />,
    message: "Limit Exceeded",
    className: "text-red-500",
  },
};

const periods: { label: string; value: Period }[] = [
  { label: "All", value: "ALL" },
  { label: "Monthly", value: "MONTHLY" },
  { label: "Yearly", value: "YEARLY" },
];

function EmptyState() {
  return (
    <div className="col-span-2 flex flex-col items-center justify-center py-16 text-center gap-3">
      <FolderOpen className="size-12 text-muted-foreground/40" />
      <div>
        <p className="font-semibold text-base">No budgets yet</p>
        <p className="text-sm text-muted-foreground">
          Create a budget category to start tracking your spending.
        </p>
      </div>
      <Button size="sm">Add Budget</Button>
    </div>
  );
}

export default function BudgetCategories({ items }: Props) {
  const [period, setPeriod] = useState<Period>("ALL");
  const filteredItems = items.filter((item) => {
    return period === "ALL" || item.period === period;
  });

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-semibold">Budget Categories</h3>
        <div className="flex items-center gap-1 bg-neutral-100 rounded-lg p-1">
          {periods.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                period === p.value
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-500 hover:text-neutral-700",
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {!items || items.length === 0 ? (
          <EmptyState />
        ) : (
          filteredItems.map((item) => {
            const status = statusConfig[item.status];
            const nearLimit = (item.used / item.limit) * 100 >= 80;
            return (
              <div
                key={item.budget_id}
                className="shadow-lg p-6 space-y-6 rounded-lg border border-neutral-100"
              >
                <div className="flex items-center gap-3 justify-between">
                  <div className="flex gap-3 items-center">
                    <div>
                      <p className="font-semibold text-base">{item.category}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatRupiah(item.used)} spent
                      </p>
                    </div>
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost">
                        <Ellipsis className="size-4" />
                      </Button>
                    </PopoverTrigger>
                    <BudgetPopoverContent id={item.budget_id} />
                  </Popover>
                </div>
                <div className="space-y-2">
                  <div className="flex flex-nowrap items-end justify-between">
                    <div className="flex gap-1 items-end">
                      <span className="text-2xl font-semibold">
                        {formatRupiah(item.used)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        / {formatRupiah(item.limit)}
                      </span>
                    </div>
                  </div>
                  <ProgressBar
                    start={item.used}
                    limit={item.limit}
                    startingColor={nearLimit ? "#f97316" : undefined}
                    className="h-3"
                  />
                  <div
                    className={cn(
                      "flex items-center justify-between text-muted-foreground font-medium text-xs",
                      nearLimit && "text-orange-600",
                    )}
                  >
                    <span>{item.percentage}% used</span>
                    <div
                      className={cn(
                        "flex items-center gap-1 text-xs font-medium",
                        status.className,
                      )}
                    >
                      {status.icon}
                      <span>{status.message}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
