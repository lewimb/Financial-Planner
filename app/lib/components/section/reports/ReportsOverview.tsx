import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { TrendingUp } from "lucide-react";
import { formatRupiah } from "../../../utils/currencyFormatter";

const overviewData = [
  {
    id: "average-income",
    label: "Average Income",
    value: 5185,
    currency: "$",
    change_percentage: 8.4,
    trend: "up",
    comparison_period: "last period",
    status: "positive",
  },
  {
    id: "average-expenses",
    label: "Average Expenses",
    value: 3295,
    currency: "$",
    change_percentage: -3.2,
    trend: "down",
    comparison_period: "last period",
    status: "positive",
  },
  {
    id: "net-savings",
    label: "Net Savings",
    value: 1890,
    currency: "$",
    change_percentage: 22.1,
    trend: "up",
    comparison_period: "last period",
    status: "positive",
  },
  {
    id: "savings-rate",
    label: "Savings Rate",
    value: 36.4,
    unit: "%",
    change_percentage: 4.8,
    trend: "up",
    comparison_period: "last period",
    status: "positive",
  },
];

export default function ReportsOverview() {
  return (
    <div className="grid grid-cols-4 gap-6">
      {overviewData.map((item) => (
        <Card key={item.id}>
          <CardHeader>
            <CardTitle className="text-muted-foreground text-sm">
              {item.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <span className="text-2xl font-bold">
                {item.id !== "savings-rate"
                  ? formatRupiah(item.value)
                  : item.value}
              </span>
              <span className="ml-2 text-2xl font-semibold">
                {item.unit || ""}
              </span>
            </div>
            <p className="text-green-600 text-xs leading-5 flex items-center gap-2 ">
              <TrendingUp className="size-3" />
              {item.change_percentage}% vs last period
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
