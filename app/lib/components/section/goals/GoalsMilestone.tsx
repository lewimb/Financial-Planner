import { Calendar } from "lucide-react";
import { cn } from "~/lib/utils";
import { formatRupiah } from "~/lib/utils/currencyFormatter";
import { formatDate, remainingDate } from "~/lib/utils/dateFormmatter";

interface Props {
  data: Goal[] | undefined;
}

export default function GoalsMilestone({ data }: Props) {
  return (
    <section className="p-6 shadow-lg w-full col-span-2 h-fit space-y-6 rounded-lg max-h-100">
      <h3 className="font-semibold">Upcoming Milestone</h3>

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
          {data.map((item) => {
            const deadline = new Date(item.deadline);
            const remaining = remainingDate(deadline);
            return (
              <div key={item.id} className="flex justify-between items-center">
                <div className="flex items-center gap-6">
                  <div className="p-2 rounded-full h-fit border border-neutral-600 bg-neutral-400/10 text-center">
                    <div className="size-3 rounded-full bg-neutral-600" />
                  </div>
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(item.deadline)}
                    </p>
                    <p
                      className={cn(
                        "text-xs text-muted-foreground",
                        remaining < 0 && "text-destructive",
                      )}
                    >
                      {remaining > 0
                        ? `${remaining} days remaining`
                        : `Deadline passed`}
                    </p>
                  </div>
                </div>
                <p className="font-semibold">
                  {formatRupiah(item.target_amount)}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
