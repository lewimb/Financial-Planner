import {
  DialogTitle,
  DialogHeader,
  DialogFooter,
  Dialog,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { categoryOptions } from "~/lib/utils/objectFormatter";
import { useForm } from "@tanstack/react-form";
import { formSchema } from "~/lib/types/budgets";
import type { CreateBudgetRequest, Period } from "~/lib/types/budgets";
import { useFetcher } from "react-router";
import { Spinner } from "~/components/ui/spinner";
import { toast } from "sonner";
import * as React from "react";

const periods = [
  { value: "MONTHLY", label: "Monthly" },
  { value: "YEARLY", label: "Yearly" },
];

const threshold = [
  { value: "50", label: "50% of budget" },
  { value: "75", label: "75% of budget" },
  { value: "80", label: "80% of budget" },
  { value: "90", label: "90% of budget" },
];

interface Props {
  items?: CreateBudgetRequest;
  isUpdate?: boolean;
  id?: number;
  onSuccess?: () => void;
}

export default function BudgetForm({
  items,
  isUpdate = false,
  id,
  onSuccess,
}: Props) {
  const fetcher = useFetcher();
  const isPending = fetcher.state === "submitting";
  const formId = `budget-form-${id ?? "new"}`;

  React.useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.success) {
      toast.success(isUpdate ? "Budget updated" : "Budget created", {
        position: "top-right",
      });
      onSuccess?.();
    }
    if (fetcher.state === "idle" && fetcher.data?.error) {
      toast.error(fetcher.data.error, { position: "top-right" });
    }
  }, [fetcher.state, fetcher.data]);

  const form = useForm({
    defaultValues: {
      limitAmount: items?.limitAmount ? Number(items.limitAmount) : "",
      period: items?.period || ("" as Period),
      category: items?.category ?? "",
      year: items?.year
        ? String(items.year)
        : new Date().getFullYear().toString(),
      alertThreshold: items?.alertThreshold
        ? String(items.alertThreshold)
        : "80",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      const payload: Record<string, string | number | null> = {
        limitAmount: Number(value.limitAmount),
        period: value.period,
        category: value.category,
        year: value.period === "YEARLY" ? Number(value.year) : null,
        alertThreshold: Number(value.alertThreshold),
      };

      if (isUpdate && id) {
        payload.id = id;
      }

      fetcher.submit(payload, {
        method: isUpdate ? "PUT" : "POST",
        encType: "application/json",
        action: "/auth/budgets",
      });
    },
  });

  return (
    <div className="space-y-6">
      <Dialog>
        <DialogHeader>
          <DialogTitle>
            {isUpdate ? "Update Budget" : "Create Budget"}
          </DialogTitle>
        </DialogHeader>
      </Dialog>

      <form
        id={formId}
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
            <div className="grid gap-2 w-full">
              <Label htmlFor={field.name}>Category</Label>
              <Select
                value={field.state.value}
                onValueChange={field.handleChange}
              >
                <SelectTrigger
                  id={field.name}
                  className="w-full"
                  onBlur={field.handleBlur}
                >
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        />

        {/* Period */}
        <form.Field
          name="period"
          children={(field) => (
            <div className="grid gap-2">
              <Label htmlFor={field.name}>Period</Label>
              <Select
                value={field.state.value}
                onValueChange={field.handleChange}
              >
                <SelectTrigger
                  className="w-full"
                  id={field.name}
                  onBlur={field.handleBlur}
                >
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  {periods.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        />

        {/* Year — required and locked to the current year, shown only for
            YEARLY budgets. MONTHLY budgets recur every month so they never
            need one; any other year would be invisible everywhere anyway
            since usage/dashboard views only ever query the current year. */}
        <form.Subscribe selector={(state) => state.values.period}>
          {(periodValue) =>
            periodValue === "YEARLY" && (
              <form.Field
                name="year"
                children={(field) => (
                  <div className="grid gap-2">
                    <Label htmlFor={field.name}>Year</Label>
                    <Input
                      id={field.name}
                      type="number"
                      value={field.state.value}
                      disabled
                      readOnly
                    />
                  </div>
                )}
              />
            )
          }
        </form.Subscribe>

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

        {/* Alert Threshold */}
        <form.Field
          name="alertThreshold"
          children={(field) => (
            <div className="grid gap-2">
              <Label htmlFor={field.name}>Alert Threshold</Label>
              <Select
                value={field.state.value}
                onValueChange={field.handleChange}
              >
                <SelectTrigger
                  className="w-full"
                  id={field.name}
                  onBlur={field.handleBlur}
                >
                  <SelectValue placeholder="Select threshold" />
                </SelectTrigger>
                <SelectContent>
                  {threshold.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        />
      </form>

      <DialogFooter className="flex gap-2 sm:justify-start">
        <Button type="button" variant="secondary" onClick={() => form.reset()}>
          Reset
        </Button>
        <Button type="submit" form={formId} disabled={isPending}>
          {isPending ? (
            <Spinner />
          ) : isUpdate ? (
            "Update Budget"
          ) : (
            "Create Budget"
          )}
        </Button>
      </DialogFooter>
    </div>
  );
}
