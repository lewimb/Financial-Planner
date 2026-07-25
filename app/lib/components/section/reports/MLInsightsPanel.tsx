import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { ChartContainer, type ChartConfig } from "~/components/ui/chart";
import { formatRupiah } from "~/lib/utils/currencyFormatter";
import type {
  MLAnalysisResponse,
  MLAnomalyResponse,
  MLForecastResponse,
  MLInsightsResponse,
} from "~/lib/types/ml";
import {
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart2,
  Loader2,
} from "lucide-react";
import { Skeleton } from "~/components/ui/skeleton";
import { getToken } from "~/lib/utils/tokenStore";

const forecastChartConfig = {
  predicted_amount: {
    label: "Predicted Spend",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const severityVariant: Record<
  "low" | "medium" | "high",
  "secondary" | "outline" | "destructive"
> = {
  low: "secondary",
  medium: "outline",
  high: "destructive",
};

interface Props {
  analysis: MLAnalysisResponse | null;
  anomaly: MLAnomalyResponse | null;
  insights: MLInsightsResponse | null;
  mlLoading?: boolean;
}

export function MLInsightsPanel({ analysis, anomaly, insights, mlLoading }: Props) {
  const [forecast, setForecast] = useState<MLForecastResponse | null>(null);
  const [forecastLoading, setForecastLoading] = useState(false);
  const [forecastError, setForecastError] = useState<string | null>(null);
  const baseApi = import.meta.env.VITE_REACT_BASE_API_URL || "";

  const loadForecast = async () => {
    setForecastLoading(true);
    setForecastError(null);
    try {
      const res = await fetch(`${baseApi}/auth/v1/ml/forecast?periods=30`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.status === 503) {
        setForecastError("ML service unavailable. Please try again later.");
        return;
      }
      if (!res.ok) {
        setForecastError("Failed to load forecast.");
        return;
      }
      const data: MLForecastResponse = await res.json();
      setForecast(data);
    } catch {
      setForecastError("Failed to connect to ML service.");
    } finally {
      setForecastLoading(false);
    }
  };

  if (mlLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-6">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-lg border p-4 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-8 w-24" />
            </div>
          ))}
        </div>
        <div className="rounded-lg border p-6 space-y-3">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  const mlUnavailable = !analysis && !anomaly && !insights;

  if (mlUnavailable) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center space-y-3">
        <BarChart2 className="size-8 text-muted-foreground" />
        <div>
          <p className="font-semibold">ML Insights Unavailable</p>
          <p className="text-sm text-muted-foreground">
            The ML service is currently unreachable. Make sure the Python ML
            service is running on port 8000.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Spending Analysis */}
      {analysis && (
        <div className="grid grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                Total Expense (Period)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {formatRupiah(analysis.total_expense)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                Average Daily Spend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {formatRupiah(analysis.avg_daily)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                Top Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold capitalize">
                {analysis.top_category ?? "—"}
              </p>
            </CardContent>
          </Card>
        </div>
      )}


      {/* ML Insights */}
      {insights && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart2 className="size-4" />
              Spending Pattern Insights
            </CardTitle>
            <CardDescription>
              Category breakdown and spike detection
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {insights.insights.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No spending data available for this period.
              </p>
            ) : (
              insights.insights.map((item) => (
                <div
                  key={item.type}
                  className={`p-3 rounded-lg text-sm flex items-start gap-2 ${
                    item.status === "warning"
                      ? "bg-destructive/10 border border-destructive/20"
                      : "bg-muted/50"
                  }`}
                >
                  <AlertTriangle
                    className={`size-4 mt-0.5 shrink-0 ${
                      item.status === "warning"
                        ? "text-destructive"
                        : "text-muted-foreground"
                    }`}
                  />
                  <div>
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      )}

      {/* Anomaly Detection */}
      {anomaly && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="size-4" />
              Anomaly Detection
            </CardTitle>
            <CardDescription>
              {anomaly.anomalies.length === 0
                ? "No unusual spending detected this period."
                : `${anomaly.anomalies.length} unusual spending day${anomaly.anomalies.length > 1 ? "s" : ""} detected.`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {anomaly.anomalies.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No unusual spending days detected.
              </p>
            ) : (
              <div className="space-y-2">
                {anomaly.anomalies.map((a) => (
                  <div
                    key={a.date}
                    className="flex items-center justify-between p-3 rounded-lg bg-destructive/10 border border-destructive/20"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant={severityVariant[a.severity]}>
                        {a.severity}
                      </Badge>
                      <span className="text-sm font-medium">{a.date}</span>
                    </div>
                    <span className="text-sm font-semibold text-destructive">
                      {formatRupiah(a.amount)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Forecast */}
      <Card>
        <CardHeader>
          <CardTitle>Spending Forecast (30 days)</CardTitle>
          <CardDescription>
            AI-powered prediction using Facebook Prophet. May take up to 60
            seconds.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!forecast && !forecastLoading && (
            <div className="flex flex-col items-center gap-4 py-6">
              {forecastError && (
                <p className="text-sm text-destructive">{forecastError}</p>
              )}
              <Button onClick={loadForecast} variant="outline">
                Load Forecast
              </Button>
            </div>
          )}

          {forecastLoading && (
            <div className="flex flex-col items-center gap-3 py-8">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Generating forecast… this may take up to 60 seconds.
              </p>
            </div>
          )}

          {forecast && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-sm text-muted-foreground">
                    Predicted Monthly Spending
                  </p>
                  <p className="text-2xl font-bold">
                    {formatRupiah(forecast.predicted_monthly_spending)}
                  </p>
                </div>
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-sm text-muted-foreground">Confidence</p>
                  <p className="text-2xl font-bold">
                    {Math.round(forecast.confidence * 100)}%
                  </p>
                </div>
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-sm text-muted-foreground">Trend</p>
                  <p className="text-2xl font-bold flex items-center gap-2 capitalize">
                    {forecast.trend === "increasing" && (
                      <TrendingUp className="size-5 text-destructive" />
                    )}
                    {forecast.trend === "decreasing" && (
                      <TrendingDown className="size-5 text-green-600" />
                    )}
                    {forecast.trend === "stable" && (
                      <Minus className="size-5 text-muted-foreground" />
                    )}
                    {forecast.trend}
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-[11px] text-muted-foreground">
                    <span
                      className={`flex items-center gap-1 ${forecast.trend === "increasing" ? "text-destructive font-semibold" : ""}`}
                    >
                      <TrendingUp className="size-3" /> Increasing
                    </span>
                    <span
                      className={`flex items-center gap-1 ${forecast.trend === "decreasing" ? "text-green-600 font-semibold" : ""}`}
                    >
                      <TrendingDown className="size-3" /> Decreasing
                    </span>
                    <span
                      className={`flex items-center gap-1 ${forecast.trend === "stable" ? "text-foreground font-semibold" : ""}`}
                    >
                      <Minus className="size-3" /> Stable
                    </span>
                  </div>
                </div>
              </div>
              {forecast.daily_forecast.length > 0 && (
                <ChartContainer
                  className="max-h-64 w-full"
                  config={forecastChartConfig}
                >
                  <LineChart
                    data={forecast.daily_forecast}
                    margin={{ left: 12, right: 12 }}
                  >
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tickFormatter={(v: string) => v.slice(5)}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                      formatter={(v: number) => [formatRupiah(v), "Predicted"]}
                    />
                    <Line
                      dataKey="predicted_amount"
                      type="monotone"
                      stroke="var(--chart-1)"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ChartContainer>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
