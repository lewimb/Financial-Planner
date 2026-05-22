import { ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react";
import { cn } from "~/lib/utils";
import { formatRupiah } from "~/lib/utils/currencyFormatter";
import type { Transaction } from "~/lib/types/transaction";

interface Props {
  items: Transaction[];
}

const colorMap = {
  green: { bg: "bg-green-300", text: "text-green-600" },
  red: { bg: "bg-red-300", text: "text-red-600" },
  blue: { bg: "bg-blue-300", text: "text-blue-600" },
} as const;

type color = keyof typeof colorMap;

function calculateTotal(items?: Transaction[]) {
  if (!items || items.length === 0) {
    return { totalExpense: 0, totalIncome: 0, netSavings: 0 };
  }

  const { totalIncome, totalExpense } = items.reduce(
    (acc, item) => {
      const amount = item.amount ?? 0;
      if (item.type === "INCOME") acc.totalIncome += amount;
      else if (item.type === "EXPENSE") acc.totalExpense += amount;
      return acc;
    },
    { totalIncome: 0, totalExpense: 0 },
  );

  return { totalExpense, totalIncome, netSavings: totalIncome - totalExpense };
}

export default function TransactionOverview({ items }: Props) {
  const { totalExpense, totalIncome, netSavings } = calculateTotal(items);

  const summary = [
    { label: "Total Income", value: totalIncome, icon: ArrowUpRight, color: "green" },
    { label: "Total Expenses", value: totalExpense, icon: ArrowDownRight, color: "red" },
    { label: "Net Savings", value: netSavings, icon: TrendingUp, color: "blue" },
  ];
  return (
    <div className="flex max-lg:flex-wrap gap-6 justify-between">
      {summary.map((item) => (
        <div
          className="shadow-lg border border-neutral-100 w-full p-6 rounded-lg"
          key={item.label}
        >
          <div className="pt-6 flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <p className="font-semibold text-2xl">
                {formatRupiah(item.value)}
              </p>
            </div>
            <div
              className={cn(
                "p-4 rounded-full",
                `${colorMap[item.color as color].bg}`,
              )}
            >
              <item.icon
                className={cn(
                  "size-6",
                  `${colorMap[item.color as color].text}`,
                )}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
