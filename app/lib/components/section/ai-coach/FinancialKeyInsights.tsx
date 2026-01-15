import { CheckCircle2, Info, TrendingUp } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "~/components/ui/card";

const keyInsights = [
  {
    title: "On track for goals",
    description: "4 of 5 goals progressing well",
    status: "success",
  },
  {
    title: "Food spending high",
    description: "15% above your typical average",
    status: "warning",
  },
  {
    title: "Income increased",
    description: "$850 freelance income this month",
    status: "info",
  },
];

export default function FinancialKeyInsights() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Key Insights</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {keyInsights.map((item) => (
          <div
            key={item.title}
            className="p-2 text-xs flex items-center gap-2 hover:-translate-y-1 duration-300 bg-neutral-100 rounded-md"
          >
            {Icon(item.status)}
            <div className="space-y-2">
              <p className="font-semibold">{item.title}</p>
              <p className="text-muted-foreground">{item.description}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function Icon(status: string) {
  switch (status) {
    case "success":
      return (
        <div className="p-2 bg-green-100 rounded-full">
          <CheckCircle2 className="size-3.5 text-green-600" />
        </div>
      );
    case "warning":
      return (
        <div className="p-2 bg-red-100 rounded-full">
          <Info className="size-3.5 text-red-600" />
        </div>
      );
    case "info":
      return (
        <div className="p-2 bg-blue-100 rounded-full">
          <TrendingUp className="size-3.5 text-blue-600" />
        </div>
      );
  }
}
