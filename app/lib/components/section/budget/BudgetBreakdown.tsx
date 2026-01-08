import { ChartPieDonutActive } from "../../shared/PieChart";

const chartData = [
  {
    category: "Food & Dining",
    spending: 275,
    limit: 400,
    fill: "var(--color-chrome)",
  },
  {
    category: "Shopping",
    spending: 200,
    limit: 400,
    fill: "var(--color-safari)",
  },
  {
    category: "Utilites",
    spending: 187,
    limit: 400,
    fill: "var(--color-firefox)",
  },
  {
    category: "Education",
    spending: 173,
    limit: 400,
    fill: "var(--color-edge)",
  },
  {
    category: "Transportation",
    spending: 90,
    limit: 400,
    fill: "var(--color-other)",
  },
  {
    category: "Entertainment",
    spending: 90,
    limit: 400,
    fill: "var(--color-other)",
  },
];

export default function BudgetBreakdown() {
  return (
    <section>
      <ChartPieDonutActive chartData={chartData} title="Spending Breakdown">
        <div className="w-full">
          {chartData.map((item, index) => (
            <div key={index}>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{item.category}</span>
                <div className="space-x-3">
                  <span className="font-semibold">{item.spending}</span>
                  <span className="text-xs text-muted-foreground">
                    {Math.round((item.spending / item.limit) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ChartPieDonutActive>
    </section>
  );
}
