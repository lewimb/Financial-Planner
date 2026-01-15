import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

const recomendations = [
  {
    title: "Increase savings rate",
    action: "Boost from 14% to 20% to reach goals faster",
  },
  {
    title: "Review subscriptions",
    action: "Cancel unused services to save $45/month",
  },
  {
    title: "Emergency fund ready",
    action: "Consider opening a high-yield savings account",
  },
];

export default function FinancialRecommendation() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommendations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {recomendations.map((item) => (
          <div
            key={item.title}
            className="p-2 text-xs hover:-translate-y-1 duration-300 bg-neutral-100 rounded-md"
          >
            <p className="font-semibold">{item.title}</p>
            <p className="text-muted-foreground">{item.action}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
