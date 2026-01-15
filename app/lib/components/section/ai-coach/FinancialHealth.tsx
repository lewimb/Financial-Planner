import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";

const financial_health = {
  score: 78,
  rating: "Good",
  components: {
    savings_rate: 0.14,
    budget_adherence: 0.68,
    goal_progress: 0.62,
  },
};

export default function FinancialHealth() {
  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>Financial Health Score</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold">{financial_health.score}</span>
          <Badge>Good</Badge>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground">Savings Rate</span>
            <span>
              {Math.floor(
                Math.min(financial_health.components.savings_rate * 100)
              )}
              %
            </span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground">Budget Adherence</span>
            <span>
              {Math.floor(
                Math.min(financial_health.components.budget_adherence * 100)
              )}
              %
            </span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground">Goal Progress</span>
            <span>
              {Math.floor(
                Math.min(financial_health.components.goal_progress * 100)
              )}
              %
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
