import { ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react";
import { cn } from "~/lib/utils";
import { formatRupiah } from "~/lib/utils/currencyFormatter";
import type { Transaction } from "~/lib/types/transaction";

interface Props {
  items: Transaction[];
}

function calculateTotal(items: Transaction[]) {
  const totalIncome = items.reduce(
    (sum, item) =>
      item.transactionTypes === "income" ? sum + item.amount : sum,
    0,
  );

  const totalExpense = items.reduce(
    (sum, item) =>
      item.transactionTypes === "expense" ? sum + item.amount : sum,
    0,
  );

  const netSavings = totalIncome - totalExpense;

  return {
    totalExpense,
    totalIncome,
    netSavings,
  };
}

export default function TransactionOverview({ items }: Props) {
  const { totalExpense, totalIncome, netSavings } = calculateTotal(items);

  const summary = [
    {
      label: "Total Income",
      value: totalIncome,
      icon: ArrowUpRight,
      color: "green",
      currency: "USD",
    },
    {
      label: "Total Expenses",
      value: totalExpense,
      icon: ArrowDownRight,
      color: "red",
      currency: "USD",
    },
    {
      label: "Net Savings",
      value: netSavings,
      icon: TrendingUp,
      color: "blue",
      currency: "USD",
    },
  ];

  const colorMap = {
    green: {
      bg: "bg-green-300",
      text: "text-green-600",
    },
    red: {
      bg: "bg-red-300",
      text: "text-red-600",
    },
    blue: {
      bg: "bg-blue-300",
      text: "text-blue-600",
    },
  } as const;

  type color = keyof typeof colorMap;
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
