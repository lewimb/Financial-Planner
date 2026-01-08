"use client";
import {
  DialogTitle,
  DialogClose,
  DialogHeader,
  DialogFooter,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import SharedSelect from "../../shared/Select";
import { categoryOptions } from "~/lib/utils/objectFormatter";

const periods = [
  {
    value: "weekly",
    label: "Weekly",
  },
  {
    value: "monthly",
    label: "Monthly",
  },
  {
    value: "yearly",
    label: "Yearly",
  },
];

const threshold = [
  {
    value: "50",
    label: "50% of budget",
  },
  {
    value: "75",
    label: "75% of budget",
  },
  {
    value: "80",
    label: "80% of budget",
  },
  {
    value: "90",
    label: "90% of budget",
  },
];

export default function BudgetForm() {
  return (
    <div className="space-y-6">
      <DialogHeader>
        <DialogTitle>Create Budget</DialogTitle>
      </DialogHeader>
      <div className="flex items-center gap-2">
        <div className="grid flex-1 gap-2">
          <Label htmlFor="category">Category</Label>
          <SharedSelect items={categoryOptions} placeholder="Select category" />
        </div>
      </div>
      <div className="grid flex-1 gap-2">
        <Label htmlFor="monthlyBudget">Monthly budget</Label>
        <Input
          placeholder="Add monthly budget"
          id="monthlyBudget"
          type="number"
        />
      </div>
      <div className="flex items-center gap-2">
        <div className="grid flex-1 gap-2">
          <Label htmlFor="category">Alert Threshold</Label>
          <SharedSelect items={threshold} placeholder="Select threshold" />
        </div>
      </div>

      <div className="grid flex-1 gap-2">
        <Label htmlFor="category">Periods</Label>
        <SharedSelect items={periods} placeholder="Select periods" />
      </div>
      <DialogFooter className="flex gap-2 sm:justify-start">
        <DialogClose asChild>
          <Button type="button" variant="secondary">
            Close
          </Button>
        </DialogClose>
        <Button>Create Budget</Button>
      </DialogFooter>
    </div>
  );
}
