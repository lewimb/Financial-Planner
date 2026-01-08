import { cn } from "~/lib/utils";
import { formatRupiah } from "~/lib/utils/currencyFormatter";
import type { LucideIcon } from "lucide-react";

interface OverviewProps {
  title: string;
  subtitle?: string;
  value: number;
  icon: LucideIcon;
  color: string;
}

interface OverviewComponentProps {
  items: OverviewProps[];
}

export default function Overview({ items }: OverviewComponentProps) {
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
    orange: {
      bg: "bg-orange-300",
      text: "text-orange-600",
    },
  } as const;

  type color = keyof typeof colorMap;
  return (
    <div className="flex max-lg:flex-wrap gap-6 justify-between">
      {items.map((item: OverviewProps) => (
        <div
          className="shadow-lg border border-neutral-100 w-full p-6 rounded-lg"
          key={item.title}
        >
          <div className="pt-6 flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{item.title}</p>
              <p className="font-semibold text-2xl">
                {formatRupiah(item.value)}
              </p>
              {item.subtitle && (
                <p className="text-sm text-muted-foreground">{item.subtitle}</p>
              )}
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
