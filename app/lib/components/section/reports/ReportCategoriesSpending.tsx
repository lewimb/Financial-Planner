"use client";

import { Pie, PieChart } from "recharts";

import { Card, CardContent, CardFooter } from "~/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "~/components/ui/chart";
import { formatRupiah } from "~/lib/utils/currencyFormatter";

export const description = "A pie chart with a label";

const chartData = [
  { browser: "chrome", expenses: 275, fill: "var(--color-chrome)" },
  { browser: "safari", expenses: 200, fill: "var(--color-safari)" },
  { browser: "firefox", expenses: 187, fill: "var(--color-firefox)" },
  { browser: "edge", expenses: 173, fill: "var(--color-edge)" },
  { browser: "other", expenses: 90, fill: "var(--color-other)" },
];

const chartConfig = {
  expenses: {
    label: "expenses",
  },
  chrome: {
    label: "Chrome",
    color: "var(--chart-1)",
  },
  safari: {
    label: "Safari",
    color: "var(--chart-2)",
  },
  firefox: {
    label: "Firefox",
    color: "var(--chart-3)",
  },
  edge: {
    label: "Edge",
    color: "var(--chart-4)",
  },
  other: {
    label: "Other",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

export function ReportsCategoriesPie() {
  return (
    <Card className="flex flex-col">
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square max-h-62.5 pb-0"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey="expenses" label nameKey="browser" />
          </PieChart>
        </ChartContainer>
        <CardFooter className="flex flex-col">
          <p className="text-muted-foreground text-xs">Total Expenses</p>
          <p className="text-2xl font-medium">
            {formatRupiah(
              chartData.reduce((sum, item) => sum + item.expenses, 0)
            )}
          </p>
        </CardFooter>
      </CardContent>
    </Card>
  );
}
