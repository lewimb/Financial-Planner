"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "~/components/ui/chart";

export const description = "A linear line chart";

const chartData = [
  { month: "January", expense: 15200, income: 18600, savings: 3400 },
  { month: "February", expense: 16650, income: 20500, savings: 3850 },
  { month: "March", expense: 17950, income: 21000, savings: 3050 },
  { month: "April", expense: 19800, income: 24500, savings: 4700 },
  { month: "May", expense: 21600, income: 27000, savings: 5400 },
  { month: "June", expense: 23780, income: 30500, savings: 6720 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function ReportsTransactions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Income & Expense Trends</CardTitle>
      </CardHeader>
      <CardContent className="w-full ">
        <ChartContainer className=" max-h-96 w-full" config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis />

            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="income"
              type="linear"
              stroke="#4caf50" // Green
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="expense"
              type="linear"
              stroke="#f44336" // Red
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="savings"
              type="linear"
              stroke="#2196f3" // Blue
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
