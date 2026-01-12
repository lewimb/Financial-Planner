import { getCurrentDate } from "~/lib/utils/dateFormmatter";
import { Ellipsis } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { formatRupiah } from "~/lib/utils/currencyFormatter";
import ProgressBar from "../../shared/ProgressBar";
import { TrendingUp, Calendar, Target } from "lucide-react";
import { formatDate } from "~/lib/utils/dateFormmatter";
import { Button } from "~/components/ui/button";

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
    deadline: "2024-12-31",
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
    deadline: "2027-12-31",
    currency: "USD",
    lastUpdated: "2024-10-15T10:30:00Z",
  },
];

export default function GoalsList() {
  const currentDate = getCurrentDate();
  return (
    <section className="space-y-6 col-span-4">
      <h3 className="font-semibold text-lg">Your Goals</h3>

      <div className="space-y-6">
        {savingsGoals.map((goal) => {
          const date = new Date(goal.deadline);
          const compareDate = currentDate <= date;
          const status = compareDate ? "On Track" : "Behind";
          const variant = compareDate ? "outline" : "destructive";

          return (
            <div
              className="p-6 hover:-translate-y-2 shadow-lg rounded-lg duration-300"
              key={goal.id}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex gap-2 items-center">
                    <h4 className="text-xl font-semibold">{goal.title}</h4>
                    <Badge variant={variant}>{status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground leading-5">
                    {goal.subtext}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger className="focus:outline-0 p-3 hover:bg-gray-400/40 duration-300 rounded-lg">
                    <Ellipsis className="size-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>Edit Goals</DropdownMenuItem>
                    <DropdownMenuItem>View History </DropdownMenuItem>
                    <DropdownMenuItem>Add Contribution</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="pt-10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 ">
                    <p className="text-2xl font-semibold">
                      {formatRupiah(goal.currentAmount)}
                    </p>
                    <p className="text-muted-foreground">
                      / {formatRupiah(goal.targetAmount)}
                    </p>
                  </div>
                  <span className="text-muted-foreground text-sm">
                    {Math.round((goal.currentAmount / goal.targetAmount) * 100)}
                    %
                  </span>
                </div>
                <ProgressBar
                  start={goal.currentAmount}
                  limit={goal.targetAmount}
                />
                <hr className="border-neutral-300" />
                <div className="grid grid-cols-3">
                  <div>
                    <div className="flex items-center text-muted-foreground gap-2">
                      <TrendingUp className="size-3" />
                      <p className="text-xs">Monthly</p>
                    </div>
                    <p className="font-semibold text-xs leading-5">
                      {formatRupiah(goal.monthlyContribution)}
                    </p>
                  </div>
                  <div>
                    <div>
                      <div>
                        <div className="flex items-center text-muted-foreground gap-2">
                          <Calendar className="size-3" />
                          <p className="text-xs">Deadline</p>
                        </div>
                        <p className="font-semibold text-xs leading-5">
                          {formatDate(goal.deadline)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div>
                      <div>
                        <div className="flex items-center text-muted-foreground gap-2">
                          <Target className="size-3" />
                          <p className="text-xs">Remaining</p>
                        </div>
                        <p className="font-semibold text-xs leading-5">
                          {formatRupiah(goal.targetAmount - goal.currentAmount)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  + Add Contribution
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
