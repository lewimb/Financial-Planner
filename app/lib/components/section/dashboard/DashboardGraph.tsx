"use client";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "~/components/ui/chart";

const chartConfig = {
  income: {
    label: "Income",
    color: "#D3D3D3",
  },
  expense: {
    label: "Expense",
    color: "#000000",
  },
} satisfies ChartConfig;

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import type { IncomeExpenseTrendPoint } from "~/lib/types/reports";

interface Props {
  data: IncomeExpenseTrendPoint[];
}

export default function DashboardGraph({ data }: Props) {
  const chartData = data.map((d) => ({
    month: d.month_name,
    income: d.income,
    expense: d.expense,
  }));

  return (
    <div className="w-full p-6 space-y-4">
      <h3 className="text-2xl font-bold">Income vs Expenses</h3>
      <ChartContainer config={chartConfig}>
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <YAxis tickLine={false} tickMargin={10} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="income" fill="var(--color-income)" radius={4} />
          <Bar dataKey="expense" fill="var(--color-expense)" radius={4} />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
