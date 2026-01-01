import {
  DollarSign,
  ArrowUp,
  ArrowDown,
  Target,
  TrendingUp,
} from "lucide-react";
import { cn } from "~/lib/utils";
import { formatRupiah } from "~/lib/utils/currencyFormatter";

export default function DashboardOverview() {
  const cardObj = [
    {
      title: "Total Balance",
      percentageChange: 12.5,
      icon: DollarSign,
      amount: 200000,
    },
    {
      title: "Income (This Month)",
      percentageChange: 12.5,
      icon: ArrowUp,
      amount: 200000,
    },
    {
      title: "Expenses (This Month)",
      percentageChange: -12.5,
      icon: ArrowDown,
      amount: 200000,
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-4 gap-4">
        {cardObj.map((card) => (
          <div
            key={card.title}
            className="p-6 rounded-lg shadow-lg flex flex-col gap-6"
          >
            <div className="flex items-center justify-between text-sm font-medium text-muted-foreground pb-6">
              <p className="">{card.title}</p>
              <card.icon className="size-4" />
            </div>
            <div className="space-y-3">
              <p className="text-2xl font-semibold">
                {formatRupiah(card.amount)}
              </p>
              <div className="flex gap-2">
                <div
                  className={cn(
                    "text-green-600 flex gap-2 items-center",
                    card.percentageChange < 0 && "text-red-600"
                  )}
                >
                  <TrendingUp
                    className={cn(card.percentageChange < 0 && "rotate-x-180 ")}
                    size={16}
                  />
                  <span className="text-sm">
                    {card.percentageChange.toFixed(2)}%
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  from last month
                </span>
              </div>
            </div>
          </div>
        ))}
        <div className="p-6 rounded-lg shadow-lg flex flex-col gap-6">
          <div className="flex items-center justify-between text-sm font-medium text-muted-foreground pb-6">
            <p className="">Saving Goals</p>
            <Target className="h-4 w-4" />
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-semibold">68%</p>
            <span className="text-sm text-muted-foreground">
              $6,800 of $10,000 saved
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
