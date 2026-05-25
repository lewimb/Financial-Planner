"use client";

import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
} from "~/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "~/components/ui/chart";
import type { NetWorthHistoryResponse } from "~/lib/types/reports";

const chartConfig = {
  net_worth: {
    label: "Net Worth",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

interface Props {
  data: NetWorthHistoryResponse | null;
}

export function ReportsNetWorth({ data }: Props) {
  const chartData =
    data?.data.map((d) => ({
      month: d.month_name,
      net_worth: d.net_worth,
    })) ?? [];

  return (
    <Card>
      <CardContent className="w-full">
        <ChartContainer config={chartConfig}>
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
              dataKey="net_worth"
              type="linear"
              stroke="var(--color-net_worth)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
