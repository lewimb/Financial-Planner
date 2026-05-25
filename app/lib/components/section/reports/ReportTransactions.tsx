"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "~/components/ui/chart";
import type { IncomeExpenseTrendResponse } from "~/lib/types/reports";

const chartConfig = {
  income: { label: "Income", color: "#4caf50" },
  expense: { label: "Expense", color: "#f44336" },
  savings: { label: "Savings", color: "#2196f3" },
} satisfies ChartConfig;

interface Props {
  data: IncomeExpenseTrendResponse | null;
}

export function ReportsTransactions({ data }: Props) {
  const chartData =
    data?.data.map((d) => ({
      month: d.month_name,
      income: d.income,
      expense: d.expense,
      savings: d.savings,
    })) ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Income & Expense Trends</CardTitle>
      </CardHeader>
      <CardContent className="w-full">
        <ChartContainer className="max-h-96 w-full" config={chartConfig}>
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
            <YAxis />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line dataKey="income" type="linear" stroke="#4caf50" strokeWidth={2} dot={false} />
            <Line dataKey="expense" type="linear" stroke="#f44336" strokeWidth={2} dot={false} />
            <Line dataKey="savings" type="linear" stroke="#2196f3" strokeWidth={2} dot={false} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
