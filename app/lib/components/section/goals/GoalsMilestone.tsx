import { Calendar } from "lucide-react";
import { cn } from "~/lib/utils";
import { formatRupiah } from "~/lib/utils/currencyFormatter";
import { formatDate } from "~/lib/utils/dateFormmatter";
import type { Goal } from "~/lib/types/goals";

interface Props {
  data: Goal[] | null | undefined;
}

export default function GoalsMilestone({ data }: Props) {
  return (
    <section className="p-6 shadow-lg w-full col-span-2 h-fit space-y-6 rounded-lg max-h-100">
      <h3 className="font-semibold">Upcoming Milestones</h3>

      {!data || data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center space-y-2">
          <div className="p-3 rounded-full bg-muted">
            <Calendar className="size-5 text-muted-foreground" />
          </div>
          <p className="font-medium text-sm">No upcoming milestones</p>
          <p className="text-xs text-muted-foreground">
            Create a goal to start tracking your milestones.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {data.map((goal) => {
            const completed = goal.status === "COMPLETED";
            const progress =
              goal.target_amount > 0
                ? Math.round((goal.current_amount / goal.target_amount) * 100)
                : 0;
            return (
              <div key={goal.id} className="flex justify-between items-center">
                <div className="flex items-center gap-6">
                  <div
                    className={cn(
                      "p-2 rounded-full h-fit border text-center",
                      completed
                        ? "border-green-600 bg-green-400/10"
                        : "border-neutral-600 bg-neutral-400/10",
                    )}
                  >
                    <div
                      className={cn(
                        "size-3 rounded-full",
                        completed ? "bg-green-600" : "bg-neutral-600",
                      )}
                    />
                  </div>
                  <div>
                    <p className="font-medium">{goal.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {progress}% complete
                    </p>
                    <p
                      className={cn(
                        "text-xs font-medium",
                        completed ? "text-green-600" : "text-muted-foreground",
                      )}
                    >
                      {completed ? "Completed" : formatDate(goal.deadline)}
                    </p>
                  </div>
                </div>
                <p className="font-semibold">
                  {formatRupiah(goal.target_amount)}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
