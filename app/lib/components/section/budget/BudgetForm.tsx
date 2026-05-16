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
  onSuccess?: () => void;
  period?: Period;
}

export default function BudgetForm({
  items,
  isUpdate = false,
  id,
  onSuccess,
  period = "MONTHLY",
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
      month: items?.month ?? "",
      year: items?.year || new Date().getFullYear().toString(),
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
        month: value.period === "MONTHLY" ? Number(value.month) : null,
        year: Number(value.year),
        alertThreshold: Number(value.alertThreshold),
      };

      if (isUpdate && id) {
        payload.id = id;
      }

      fetcher.submit(payload, {
        method: isUpdate ? "PATCH" : "POST",
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

        {/* Month — only visible when period is MONTHLY */}
        {period === "MONTHLY" && (
          <form.Field
            name="month"
            children={(field) => (
              <div className="grid gap-2">
                <Label htmlFor={field.name}>Month</Label>
                <Select
                  value={String(field.state.value)}
                  onValueChange={field.handleChange}
                >
                  <SelectTrigger
                    className="w-full"
                    id={field.name}
                    onBlur={field.handleBlur}
                  >
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          />
        )}

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
