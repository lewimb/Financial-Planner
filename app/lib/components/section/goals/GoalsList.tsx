import { getCurrentDate } from "~/lib/utils/dateFormmatter";
import type { Goal } from "~/lib/types/goals";
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
import { Calendar, Target } from "lucide-react";
import { formatDate } from "~/lib/utils/dateFormmatter";
import { Button } from "~/components/ui/button";
import { Modal } from "../../shared/Modal";
import { useFetcher, useNavigate } from "react-router";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

interface Props {
  data: Goal[] | null;
}

export default function GoalsList({ data }: Props) {
  const currentDate = getCurrentDate();
  const fetcher = useFetcher();
  const navigate = useNavigate();

  const handleDelete = (goal: Goal) => {
    const confirmed = window.confirm(
      `Delete "${goal.name}"? This action is permanent and cannot be undone.`,
    );
    if (!confirmed) return;

    fetcher.submit(
      { intent: "delete", id: String(goal.id) },
      { method: "post", action: "/auth/goals" },
    );
  };

  if (!data || data.length === 0) {
    return (
      <section className="space-y-6 col-span-4">
        <h3 className="font-semibold text-lg">Your Goals</h3>
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center space-y-4">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-muted">
            <Target className="size-6 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <h4 className="font-semibold text-lg">No goals yet</h4>
            <p className="text-sm text-muted-foreground">
              Start by creating your first financial goal to track your
              progress.
            </p>
          </div>
          <Button>+ Create Goal</Button>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6 col-span-4">
      <h3 className="font-semibold text-lg">Your Goals</h3>

      <div className="space-y-6">
        {data.map((goal) => {
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
                    <h4 className="text-xl font-semibold">{goal.name}</h4>
                    <Badge variant={variant}>{status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground leading-5">
                    {goal.description}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger className="focus:outline-0 p-3 hover:bg-gray-400/40 duration-300 rounded-lg">
                    <Ellipsis className="size-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => navigate(`/auth/goals/${goal.id}`)}
                    >
                      Edit Goals
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(goal)}
                      className="text-destructive"
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="pt-10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-semibold">
                      {formatRupiah(goal.current_amount)}
                    </p>
                    <p className="text-muted-foreground">
                      / {formatRupiah(goal.target_amount)}
                    </p>
                  </div>
                  <span className="text-muted-foreground text-sm">
                    {Math.round(
                      (goal.current_amount / goal.target_amount) * 100,
                    )}
                    %
                  </span>
                </div>
                <ProgressBar
                  start={goal.current_amount}
                  limit={goal.target_amount}
                />
                <hr className="border-neutral-300" />
                <div className="grid grid-cols-3">
                  <div>
                    <div className="flex items-center text-muted-foreground gap-2">
                      <Calendar className="size-3" />
                      <p className="text-xs">Deadline</p>
                    </div>
                    <p className="font-semibold text-xs leading-5">
                      {formatDate(goal.deadline)}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center text-muted-foreground gap-2">
                      <Target className="size-3" />
                      <p className="text-xs">Remaining</p>
                    </div>
                    <p className="font-semibold text-xs leading-5">
                      {formatRupiah(goal.target_amount - goal.current_amount)}
                    </p>
                  </div>
                </div>
                <Modal label="+Add Contribution">
                  <fetcher.Form
                    method="post"
                    action="/auth/goals"
                    className="space-y-3"
                  >
                    <input type="hidden" name="id" value={goal.id} />
                    <input type="hidden" name="intent" value="contribution" />
                    {/* current_amount is sent so the action can compute the new total */}
                    <input
                      type="hidden"
                      name="current_amount"
                      value={goal.current_amount}
                    />
                    <Label htmlFor="contribution">Add Contribution</Label>
                    <Input name="contribution" type="number" min={1} />
                    <div className="text-end">
                      <Button type="submit" className="w-full">
                        Add
                      </Button>
                    </div>
                  </fetcher.Form>
                </Modal>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
