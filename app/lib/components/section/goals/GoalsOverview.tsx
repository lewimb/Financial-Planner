import { Target, Calendar } from "lucide-react";
import { cn } from "~/lib/utils";
import { formatRupiah } from "~/lib/utils/currencyFormatter";

interface Props {
  total_goals: number;
  savings: number;
}

export default function GoalsOverview({ total_goals, savings }: Props) {
  const summary = [
    {
      label: "Active Goals",
      value: total_goals ?? 0,
      subtitle: "2 completed this year",
      icon: Target,
      color: "blue",
    },
    {
      label: "Accummulated ",
      value: formatRupiah(savings ?? 0),
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
