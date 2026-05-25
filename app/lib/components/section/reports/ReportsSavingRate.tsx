"use client";

import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import { Card, CardContent } from "~/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "~/components/ui/chart";
import type { SavingsRateHistoryResponse } from "~/lib/types/reports";

const chartConfig = {
  rate: {
    label: "Savings Rate %",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

interface Props {
  data: SavingsRateHistoryResponse | null;
}

export function ReportsSavingRate({ data }: Props) {
  const chartData =
    data?.data.map((d) => ({
      month: d.month_name,
      rate: d.rate,
    })) ?? [];

  return (
    <Card>
      <CardContent className="w-full">
        <ChartContainer className="h-80 w-full" config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="rate"
              type="linear"
              stroke="var(--color-rate)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
