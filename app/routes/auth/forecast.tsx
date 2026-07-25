import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { ChartContainer, type ChartConfig } from "~/components/ui/chart";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  BarChart2,
} from "lucide-react";
import Header from "~/lib/components/shared/Header";
import { formatRupiah } from "~/lib/utils/currencyFormatter";
import type { MLForecastResponse } from "~/lib/types/ml";
import { getToken } from "~/lib/utils/tokenStore";

const chartConfig = {
  predicted_amount: {
    label: "Predicted Spend",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const PERIOD_OPTIONS = [
  { value: 7, label: "7 days" },
  { value: 14, label: "14 days" },
  { value: 30, label: "30 days" },
  { value: 60, label: "60 days" },
  { value: 90, label: "90 days" },
];

export default function Forecast() {
  const baseApi = import.meta.env.VITE_REACT_BASE_API_URL || "";

  const [periods, setPeriods] = useState(30);
  const [forecast, setForecast] = useState<MLForecastResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unavailable, setUnavailable] = useState(false);

  const runForecast = async () => {
    const token = getToken();
    setLoading(true);
    setError(null);
    setUnavailable(false);
    setForecast(null);
    try {
      const res = await fetch(
        `${baseApi}/auth/v1/ml/forecast?periods=${periods}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (res.status === 503) {
        setUnavailable(true);
        return;
      }
      if (!res.ok) {
        setError("Failed to load forecast. Please try again.");
        return;
      }
      const data: MLForecastResponse = await res.json();
      setForecast(data);
    } catch {
      setError("Failed to connect to the ML service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Header
        title="Spending Forecast"
        subtitle="AI-powered spending predictions using Facebook Prophet"
      />

      <Card>
        <CardHeader>
          <CardTitle>Forecast Settings</CardTitle>
          <CardDescription>
            Select how many days ahead to forecast. Accuracy improves
            significantly with 30+ days of transaction history.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <div className="flex gap-2 flex-wrap">
            {PERIOD_OPTIONS.map((opt) => (
              <Button
                key={opt.value}
                variant={periods === opt.value ? "default" : "outline"}
                size="sm"
                onClick={() => setPeriods(opt.value)}
                disabled={loading}
              >
                {opt.label}
              </Button>
            ))}
          </div>
          <Button onClick={runForecast} disabled={loading} className="ml-auto">
            {loading ? "Forecasting…" : "Run Forecast"}
          </Button>
        </CardContent>
      </Card>

      {unavailable && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center space-y-3">
          <BarChart2 className="size-8 text-muted-foreground" />
          <div>
            <p className="font-semibold">ML Service Unavailable</p>
            <p className="text-sm text-muted-foreground">
              The Python ML service is currently unreachable.
            </p>
          </div>
        </div>
      )}

      {error && !unavailable && (
        <div className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4">
          <AlertTriangle className="size-5 text-destructive shrink-0" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {loading && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {[0, 1, 2].map((i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-40" />
                </CardContent>
              </Card>
            ))}
          </div>
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-64 mt-1" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full rounded-lg" />
              <p className="text-xs text-muted-foreground text-center mt-3">
                Generating forecast… this may take up to 60 seconds.
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {forecast && !loading && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">
                  Predicted Spending ({periods} days)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {formatRupiah(forecast.predicted_monthly_spending)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">
                  Forecast Confidence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  {Math.round(forecast.confidence * 100)}%
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">
                  Spending Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
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
                <div className="flex items-center gap-3 mt-2 text-[11px] text-muted-foreground">
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
              </CardContent>
            </Card>
          </div>

          {forecast.daily_forecast.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Day-by-Day Forecast</CardTitle>
                <CardDescription>
                  Predicted daily spending for the next {periods} days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  className="max-h-80 w-full"
                  config={chartConfig}
                >
                  <LineChart
                    data={forecast.daily_forecast}
                    margin={{ left: 16, right: 16, top: 8, bottom: 8 }}
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
                      tickFormatter={(v: number) =>
                        `${(v / 1000).toFixed(0)}k`
                      }
                    />
                    <Tooltip
                      formatter={(v: number) => [formatRupiah(v), "Predicted"]}
                      labelFormatter={(label: string) => `Date: ${label}`}
                    />
                    <Line
                      dataKey="predicted_amount"
                      type="monotone"
                      stroke="var(--chart-1)"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {!forecast && !loading && !error && !unavailable && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 space-y-4">
            <BarChart2 className="size-10 text-muted-foreground" />
            <div className="text-center">
              <p className="font-semibold text-lg">No Forecast Yet</p>
              <p className="text-sm text-muted-foreground max-w-md">
                Select a forecast period above and click "Run Forecast".
              </p>
            </div>
            <Button onClick={runForecast}>Run Forecast ({periods} days)</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
