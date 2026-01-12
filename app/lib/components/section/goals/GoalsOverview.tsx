import { TrendingUp, Target, Calendar } from "lucide-react";
import { cn } from "~/lib/utils";
import { formatRupiah } from "~/lib/utils/currencyFormatter";

export default function GoalsOverview() {
  const summary = [
    {
      label: "Active Goals",
      value: 4,
      subtitle: "2 completed this year",
      icon: Target,
      color: "blue",
    },
    {
      label: "Total Expenses",
      value: formatRupiah(200),
      subtitle: "Across all goals",
      icon: TrendingUp,
      color: "green",
      currency: "USD",
    },
    {
      label: "Net Savings",
      value: 14,
      subtitle: "Emergency Fund - $10,000",
      icon: Calendar,
      color: "purple",
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
    purple: {
      bg: "bg-purple-300",
      text: "text-purple-600",
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
              <p className="font-semibold text-2xl">{item.value}</p>
            </div>
            <div
              className={cn(
                "p-4 rounded-full",
                `${colorMap[item.color as color].bg}`
              )}
            >
              <item.icon
                className={cn(
                  "size-6",
                  `${colorMap[item.color as color].text}`
                )}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
