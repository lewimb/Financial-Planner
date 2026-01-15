import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { TrendingUp } from "lucide-react";
import { formatRupiah } from "~/lib/utils/currencyFormatter";
import { cn } from "../../../utils";

const reportTrendsMetricsData = {
  metrics: [
    {
      id: "saving-rate-trend",
      label: "Savings Rate Trend",
      value: 40,
      change: 14.3,
      trend: true,
      message:
        "Your savings rate has improved significantly over the past 6 months",
    },
    {
      id: "food-dining-spending",
      label: "Food & Dining Spending",
      value: 520,
      change: 12.5,
      trend: true,
      message:
        "Spending in this category is increasing - consider meal planning",
    },
    {
      id: "transportation-spending",
      label: "Transportation Costs",
      value: 180,
      change: -8.2,
      trend: false,
      message: "Transportation costs are decreasing - great progress!",
    },
    {
      id: "monthly-income",
      label: "Monthly Income",
      value: 5420,
      change: 15.8,
      trend: true,
      message: "Income growth is strong, primarily from freelance work",
    },
  ],
};

export default function ReportsTrendsMetrics() {
  return (
    <section>
      <div className="grid grid-cols-2 gap-6">
        {reportTrendsMetricsData.metrics.map((metric) => (
          <Card key={metric.id}>
            <CardHeader>
              <CardTitle>{metric.label}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-semibold">
                  {metric.id === "saving-rate-trend"
                    ? metric.value + "%"
                    : formatRupiah(metric.value)}
                </span>
                <div
                  className={cn(
                    "text-green-600 text-sm flex gap-1 items-center",
                    !metric.trend && "text-destructive"
                  )}
                >
                  <TrendingUp
                    className={cn("size-4", !metric.trend && "rotate-x-180")}
                  />
                  <span>{metric.change}</span>
                </div>
              </div>
              <p className="text-muted-foreground">{metric.message}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
