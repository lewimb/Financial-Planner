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
import { useForm } from "@tanstack/react-form";
import { useAppStore } from "~/hooks";
import { formSchema } from "~/lib/types/budgets";
import type { CreateBudgetRequest, Period } from "~/lib/types/budgets";
import { useCreateBudget } from "~/hooks/budgets/use-budget";

const periods = [
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

const threshold = [
  { value: "50", label: "50% of budget" },
  { value: "75", label: "75% of budget" },
  { value: "80", label: "80% of budget" },
  { value: "90", label: "90% of budget" },
];

const months = [
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

interface Props {
  items?: CreateBudgetRequest;
  isUpdate?: boolean;
  id?: number;
}

export default function BudgetForm({ items, isUpdate = false, id }: Props) {
  const store = useAppStore();
  const userId = store.getState().auth.authUser?.userId;
  const token = store.getState().auth.token;
  const createBudget = useCreateBudget({ token });
  // const updateBudget = useUpdateBudget(store.getState().auth.token);

  const form = useForm({
    defaultValues: {
      limitAmount: items?.limitAmount ? Number(items?.limitAmount) : "",
      period: items?.period || ("" as Period),
      category: items?.category ? items?.category : "",
      month: items?.month ? items?.month : "",
      year: items?.year || new Date().getFullYear().toString(),
      alertThreshold: items?.alertThreshold
        ? String(items?.alertThreshold)
        : "80",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      const budgetData = {
        limitAmount: Number(value.limitAmount),
        period: value.period as Period,
        category: value.category,
        month: Number(value.month),
        year: Number(value.year),
        alertThreshold: value.alertThreshold,
        userId,
      };

      if (isUpdate && id) {
        // updateBudget.mutateAsync({ ...budgetData, id });
        console.log("Updating budget:", { ...budgetData, id });
      } else {
        createBudget.mutateAsync(budgetData);
        console.log("Creating budget:", budgetData);
      }
    },
  });

  return (
    <div className="space-y-6">
      <DialogHeader>
        <DialogTitle>
          {isUpdate ? "Update Budget" : "Create Budget"}
        </DialogTitle>
      </DialogHeader>

      <form
        id="budget-form"
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        {/* Category */}
        <form.Field
          name="category"
          children={(field) => (
            <div className="grid gap-2">
              <Label htmlFor={field.name}>Category</Label>
              <SharedSelect
                id={field.name}
                value={field.state.value}
                handleChange={field.handleChange}
                handleBlur={field.handleBlur}
                items={categoryOptions}
                placeholder="Select category"
              />
            </div>
          )}
        />

        {/* Period */}
        <form.Field
          name="period"
          children={(field) => (
            <div className="grid gap-2">
              <Label htmlFor={field.name}>Period</Label>
              <SharedSelect
                id={field.name}
                value={field.state.value}
                handleChange={field.handleChange}
                handleBlur={field.handleBlur}
                items={periods}
                placeholder="Select period"
              />
            </div>
          )}
        />

        {/* Month (for monthly) */}
        <form.Field
          name="month"
          children={(field) => (
            <div className="grid gap-2">
              <Label htmlFor={field.name}>Month</Label>
              <SharedSelect
                id={field.name}
                value={String(field.state.value)}
                handleChange={field.handleChange}
                handleBlur={field.handleBlur}
                items={months}
                placeholder="Select month"
              />
            </div>
          )}
        />

        {/* Year */}
        <form.Field
          name="year"
          children={(field) => (
            <div className="grid gap-2">
              <Label htmlFor={field.name}>Year</Label>
              <Input
                id={field.name}
                type="number"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                placeholder="2026"
              />
            </div>
          )}
        />

        {/* Budget Amount */}
        <form.Field
          name="limitAmount"
          children={(field) => (
            <div className="grid gap-2">
              <Label htmlFor={field.name}>Budget Amount</Label>
              <Input
                id={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                placeholder="Enter budget amount"
                type="number"
              />
            </div>
          )}
        />

        {/* Alert threshold */}
        <form.Field
          name="alertThreshold"
          children={(field) => (
            <div className="grid gap-2">
              <Label htmlFor={field.name}>Alert Threshold</Label>
              <SharedSelect
                id={field.name}
                value={field.state.value}
                handleChange={field.handleChange}
                handleBlur={field.handleBlur}
                items={threshold}
                placeholder="Select threshold"
              />
            </div>
          )}
        />
      </form>

      <DialogFooter className="flex gap-2 sm:justify-start">
        <DialogClose asChild>
          <Button type="button" variant="secondary">
            Close
          </Button>
        </DialogClose>
        <Button type="submit" form="budget-form">
          {isUpdate ? "Update Budget" : "Create Budget"}
        </Button>
      </DialogFooter>
    </div>
  );
}
