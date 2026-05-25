"use client";

import { Pie, PieChart, Cell } from "recharts";

import { Card, CardContent, CardFooter } from "~/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "~/components/ui/chart";
import { formatRupiah } from "~/lib/utils/currencyFormatter";
import type { CategoryBreakdownResponse } from "~/lib/types/reports";

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

interface Props {
  data: CategoryBreakdownResponse | null;
}

export function ReportsCategoriesPie({ data }: Props) {
  if (!data || data.data.length === 0) {
    return (
      <Card className="flex flex-col">
        <CardContent className="flex-1 pb-0 pt-6">
          <p className="text-sm text-muted-foreground text-center">No spending data.</p>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.data.map((item, i) => ({
    name: item.label,
    value: item.total,
    fill: CHART_COLORS[i % CHART_COLORS.length],
  }));

  const chartConfig = Object.fromEntries(
    data.data.map((item, i) => [
      item.category.toLowerCase(),
      { label: item.label, color: CHART_COLORS[i % CHART_COLORS.length] },
    ])
  ) satisfies ChartConfig;

  return (
    <Card className="flex flex-col">
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square max-h-62.5 pb-0"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey="value" nameKey="name" label>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        <CardFooter className="flex flex-col">
          <p className="text-muted-foreground text-xs">Total Expenses</p>
          <p className="text-2xl font-medium">{formatRupiah(data.total_expense)}</p>
        </CardFooter>
      </CardContent>
    </Card>
  );
}
