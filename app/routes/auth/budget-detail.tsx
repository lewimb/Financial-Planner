import { Form } from "react-router";
import type { Route } from "./+types/budget-detail";
import tokenParser from "~/lib/utils/tokenParser";
import { GetBudgetById, UpdateBudget } from "~/actions/budgets";
import { redirect } from "react-router";
import type {
  UpdateBudgetRequest,
  UpdateBudgetResponse,
} from "~/lib/types/budgets";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { categoryOptions } from "~/lib/utils/objectFormatter";
import { Input } from "~/components/ui/input";
import { DialogFooter } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";

const periods = [
  { value: "MONTHLY", label: "Monthly" },
  { value: "YEARLY", label: "Yearly" },
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

const threshold = [
  { value: 50, label: "50% of budget" },
  { value: 75, label: "75% of budget" },
  { value: 80, label: "80% of budget" },
  { value: 90, label: "90% of budget" },
];

export async function loader({ params, request }: Route.LoaderArgs) {
  const baseUrl = process.env.API_BASE_URL;
  const { token } = tokenParser(request);

  if (!token || !params.id || !baseUrl) throw redirect("/auth/budgets");

  const { data }: { data: UpdateBudgetResponse } = await GetBudgetById(
    Number(params.id),
    token,
    baseUrl,
  );

  return data;
}

export async function action({ request }: Route.ActionArgs) {
  try {
    const payload = tokenParser(request);

    let formData = await request.formData();

    const id = Number((formData.get("id") as string) || 0);
    const baseUrl = process.env.API_BASE_URL || "";

    if (!baseUrl) {
      return null;
    }

    const requestData: UpdateBudgetRequest = {
      category: formData.get("category") as string,
      limitAmount: Number(formData.get("limitAmount") as string),
      alertThreshold: Number(formData.get("alertThreshold") as string),
    };

    const response = await UpdateBudget(
      requestData,
      baseUrl,
      payload.token,
      id,
    );

    console.log(response);
  } catch (err) {
    console.log(err);
  }
}

export default function UpdateBudgetsForm({
  loaderData,
}: Route.ComponentProps) {
  return (
    <Form method="post" className="w-full max-w-lg space-y-6">
      <div className="space-y-1">
        <h3 className="font-semibold text-2xl tracking-tight">
          Update Budgets
        </h3>
        <p className="text-sm text-muted-foreground">
          Adjust your budget settings for a specific category and period.
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid gap-1.5">
          <Label className="text-sm font-medium">Category</Label>
          <Select name="category" defaultValue={loaderData.category}>
            <SelectTrigger className="w-full">
              <SelectValue
                defaultValue={loaderData.category}
                placeholder="Select category"
              />
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

        <div className="grid gap-1.5">
          <Label className="text-sm font-medium">Budget Amount</Label>
          <Input
            name="limitAmount"
            defaultValue={loaderData.limitAmount}
            placeholder="0.00"
            type="number"
          />
        </div>

        <div className="grid gap-1.5">
          <Label className="text-sm font-medium">Alert Threshold</Label>
          <Select
            name="alertThreshold"
            defaultValue={String(loaderData.alertThreshold)}
          >
            <SelectTrigger className="w-full">
              <SelectValue
                defaultValue={String(loaderData.alertThreshold)}
                placeholder="Select threshold"
              />
            </SelectTrigger>
            <SelectContent>
              {threshold.map((opt) => (
                <SelectItem key={opt.value} value={String(opt.value)}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <input type="hidden" name="id" value={loaderData.id} />

      <DialogFooter className="flex gap-2 pt-2 sm:justify-start">
        <Button type="button" variant="outline">
          Reset
        </Button>
        <Button type="submit">Save Changes</Button>
      </DialogFooter>
    </Form>
  );
}
