import { cn } from "~/lib/utils";
import { formatRupiah } from "~/lib/utils/currencyFormatter";
import { formatDate, remainingDate } from "~/lib/utils/dateFormmatter";

const savingsGoals = [
  {
    id: 1,
    title: "Emergency Fund",
    category: "Savings",
    status: "On Track",
    subtext: "6 months of living expenses",
    currentAmount: 8200,
    targetAmount: 10000,
    progressPercentage: 82,
    monthlyContribution: 400,
    remainingAmount: 1800,
    deadline: "2024-12-31",
    currency: "USD",
    lastUpdated: "2024-10-15T10:30:00Z",
  },
  {
    id: 2,
    title: "Vacation Fund",
    category: "Savings",
    status: "On Track",
    subtext: "6 months of living expenses",
    currentAmount: 8200,
    targetAmount: 10000,
    progressPercentage: 82,
    monthlyContribution: 400,
    remainingAmount: 1800,
    deadline: "2029-12-31",
    currency: "USD",
    lastUpdated: "2024-10-15T10:30:00Z",
  },
  {
    id: 3,
    title: "New Laptop",
    category: "Savings",
    status: "On Track",
    subtext: "6 months of living expenses",
    currentAmount: 8200,
    targetAmount: 10000,
    progressPercentage: 82,
    monthlyContribution: 400,
    remainingAmount: 1800,
    deadline: "2029-12-31",
    currency: "USD",
    lastUpdated: "2024-10-15T10:30:00Z",
  },
];

export default function GoalsMilestone() {
  return (
    <section className="p-6 shadow-lg w-full col-span-2 h-fit space-y-6 rounded-lg max-h-100">
      <h3 className="font-semibold">Upcoming Milestone</h3>
      <div className="space-y-6">
        {savingsGoals.map((item) => {
          const deadline = new Date(item.deadline);
          const remaining = remainingDate(deadline);
          return (
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-6">
                <div className="p-2 rounded-full h-fit border border-neutral-600 bg-neutral-400/10 text-center">
                  <div className="size-3 rounded-full bg-neutral-600" />
                </div>
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(item.deadline)}
                  </p>
                  <p
                    className={cn(
                      "text-xs text-muted-foreground",
                      remaining < 0 && "text-destructive"
                    )}
                  >
                    {remaining > 0
                      ? `${remaining} days remaining`
                      : `Deadline passed`}
                  </p>
                </div>
              </div>
              <p className="font-semibold">{formatRupiah(item.targetAmount)}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
