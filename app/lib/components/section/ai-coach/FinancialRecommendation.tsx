import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import type { RecommendationsResponse } from "~/lib/types/ai-coach";

const PRIORITY_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  high: "destructive",
  medium: "secondary",
  low: "outline",
};

interface Props {
  data: RecommendationsResponse | null;
}

export default function FinancialRecommendation({ data }: Props) {
  const recommendations = data?.recommendations ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommendations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {recommendations.length === 0 ? (
          <p className="text-xs text-muted-foreground">No recommendations available.</p>
        ) : (
          recommendations.map((item) => (
            <div
              key={item.title}
              className="p-2 text-xs hover:-translate-y-1 duration-300 bg-neutral-100 rounded-md space-y-1"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold">{item.title}</p>
                <Badge variant={PRIORITY_VARIANT[item.priority] ?? "outline"}>
                  {item.priority}
                </Badge>
              </div>
              <p className="text-muted-foreground">{item.action}</p>
              {item.potential_impact && (
                <p className="text-green-600 font-medium">{item.potential_impact}</p>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
