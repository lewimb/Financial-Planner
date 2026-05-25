import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import type { FinancialHealthResponse } from "~/lib/types/ai-coach";

const RATING_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  Excellent: "default",
  Good: "default",
  Fair: "secondary",
  Poor: "destructive",
};

interface Props {
  data: FinancialHealthResponse | null;
}

export default function FinancialHealth({ data }: Props) {
  if (!data) {
    return (
      <Card className="h-fit">
        <CardHeader>
          <CardTitle>Financial Health Score</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Loading…</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle>Financial Health Score</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold">{data.score}</span>
          <Badge variant={RATING_VARIANT[data.rating] ?? "secondary"}>
            {data.rating}
          </Badge>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground">Savings Rate</span>
            <span>{Math.floor(data.components.savings_rate * 100)}%</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground">Budget Adherence</span>
            <span>{Math.floor(data.components.budget_adherence * 100)}%</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground">Goal Progress</span>
            <span>{Math.floor(data.components.goal_progress * 100)}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
