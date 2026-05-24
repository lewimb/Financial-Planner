"use client";
import {
  FieldGroup,
  FieldSet,
  FieldLegend,
  FieldLabel,
  Field,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { DatePicker } from "~/lib/components/shared/DatePicker";
import type { Route } from "./+types/goal-update-form.tsx";
import { Button } from "~/components/ui/button";
import { redirect, useFetcher, useNavigate } from "react-router";
import { useState } from "react";
import { toast } from "sonner";
import type { Goal } from "~/lib/types/goals";
import { getToken } from "~/lib/utils/tokenStore";

interface LoaderData {
  data: Goal | null;
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const token = getToken();
  if (!token || !params?.id) throw redirect("/auth/goals");

  const baseApi = import.meta.env.VITE_REACT_BASE_API_URL || "";
  try {
    const res = await fetch(`${baseApi}/auth/v1/goals/${params.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 401) throw redirect("/login");
    const json: { data: Goal } = await res.json();
    return { data: json.data, err: null, status: true };
  } catch (err) {
    if (err instanceof Response) throw err;
    return { data: null, err, status: false };
  }
}

export async function clientAction({
  request,
  params,
}: Route.ClientActionArgs) {
  const errors: {
    name?: string;
    description?: string;
    target_amount?: string;
    target_date?: string;
  } = {};

  try {
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const target_amount = formData.get("target_amount") as string;
    const deadline = formData.get("target_date") as string;
    const id = formData.get("id") as string;

    if (!name) errors.name = "Please insert the name of the goal";
    if (!description) errors.description = "Please insert the description";
    if (!target_amount) errors.target_amount = "Please insert the target amount";
    else if (isNaN(Number(target_amount)) || Number(target_amount) <= 0)
      errors.target_amount = "Target amount must be a positive number";
    if (!deadline) errors.target_date = "Target date is required";
    else {
      const deadlineDate = new Date(deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (isNaN(deadlineDate.getTime()))
        errors.target_date = "Invalid date format";
      else if (deadlineDate < today)
        errors.target_date = "Target date cannot be in the past";
    }

    if (Object.keys(errors).length > 0) return { errors, status: false };

    const token = getToken();
    const baseApi = import.meta.env.VITE_REACT_BASE_API_URL || "";

    const res = await fetch(`${baseApi}/auth/v1/goals/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        description,
        target_amount: Number(target_amount),
        deadline: new Date(deadline),
      }),
    });

    if (res.status === 401) throw redirect("/login");
    if (!res.ok) return { errors: { form: "Update failed" }, status: false };

    return { errors: null, status: true };
  } catch (err) {
    if (err instanceof Response) throw err;
    return { errors: { form: "Something went wrong" }, status: false };
  }
}

export default function GoalUpdateForm({ loaderData }: Route.ComponentProps) {
  const goal = (loaderData as unknown as LoaderData)?.data;
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const [targetDate, setTargetDate] = useState<Date | undefined>(
    goal?.deadline ? new Date(goal.deadline) : undefined,
  );

  const actionData = fetcher.data as
    | { errors: Record<string, string> | null; status: boolean }
    | undefined;

  if (actionData?.status === true) {
    toast.success("Goal updated successfully", { position: "top-right" });
    navigate("/auth/goals");
  }

  return (
    <fetcher.Form method="post">
      <FieldSet>
        <FieldLegend>Update Goal</FieldLegend>
        <FieldGroup>
          <Field>
            <FieldLabel>Name</FieldLabel>
            <Input name="name" defaultValue={goal?.name ?? ""} />
            {actionData?.errors?.name && (
              <p className="text-sm text-destructive">{actionData.errors.name}</p>
            )}
          </Field>
          <Field>
            <FieldLabel>Description</FieldLabel>
            <Textarea name="description" defaultValue={goal?.description ?? ""} />
            {actionData?.errors?.description && (
              <p className="text-sm text-destructive">
                {actionData.errors.description}
              </p>
            )}
          </Field>
          <Field>
            <FieldLabel>Target Amount</FieldLabel>
            <Input
              name="target_amount"
              type="number"
              defaultValue={goal?.target_amount ?? ""}
            />
            {actionData?.errors?.target_amount && (
              <p className="text-sm text-destructive">
                {actionData.errors.target_amount}
              </p>
            )}
          </Field>
          <Field>
            <FieldLabel>Target Date</FieldLabel>
            <DatePicker
              onChange={setTargetDate}
              handleBlur={() => {}}
              name="target_date"
              isInvalid={!!actionData?.errors?.target_date}
              defaultValue={targetDate}
            />
            {actionData?.errors?.target_date && (
              <p className="text-sm text-destructive">
                {actionData.errors.target_date}
              </p>
            )}
          </Field>
          <input type="hidden" name="id" value={goal?.id ?? ""} />
          <Button type="submit" disabled={fetcher.state === "submitting"}>
            {fetcher.state === "submitting" ? "Saving..." : "Save Changes"}
          </Button>
        </FieldGroup>
      </FieldSet>
    </fetcher.Form>
  );
}
