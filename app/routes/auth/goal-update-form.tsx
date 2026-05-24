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
import tokenParser from "~/lib/utils/tokenParser";
import { Button } from "~/components/ui/button";
import { redirect, useFetcher, useNavigate } from "react-router";
import { useState } from "react";
import { toast } from "sonner";
import type { Goal } from "~/lib/types/goals";

interface LoaderData {
  data: Goal | null;
}

export async function loader({ params, request }: Route.LoaderArgs) {
  try {
    const baseApi = process.env.API_BASE_URL || "";
    const accessToken = tokenParser(request);
    if (!accessToken || !params?.id || !baseApi) throw redirect("/auth/goals");

    const res: { data: Goal } = await fetch(
      `${baseApi}/auth/v1/goals/${params?.id}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken.token}`,
        },
      },
    ).then((val) => val.json());

    return { data: res.data, err: null, status: true };
  } catch (err) {
    console.log(err);
    return { data: null, err: err, status: false };
  }
}

export async function action({ request }: Route.ActionArgs) {
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

    if (!name) {
      errors.name = "Please insert the name of the goal";
    }

    if (!description) {
      errors.description = "Please insert the description";
    }

    if (!target_amount) {
      errors.target_amount = "Please insert the target amount";
    } else if (isNaN(Number(target_amount)) || Number(target_amount) <= 0) {
      errors.target_amount = "Target amount must be a positive number";
    }

    if (!deadline) {
      errors.target_date = "Target date is required";
    } else {
      const deadlineDate = new Date(deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (isNaN(deadlineDate.getTime())) {
        errors.target_date = "Invalid date format";
      } else if (deadlineDate < today) {
        errors.target_date = "Target date cannot be in the past";
      }
    }

    if (Object.keys(errors).length > 0) {
      return { errors, status: false };
    }

    const baseApi = process.env.API_BASE_URL || "";
    const accessToken = tokenParser(request);

    const res = await fetch(`${baseApi}/auth/v1/goals/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken.token}`,
      },
      body: JSON.stringify({
        name,
        description,
        target_amount: Number(target_amount),
        deadline,
      }),
    }).then((val) => val.json());

    toast.success("Successfully update the data");

    return { errors: null, status: true };
  } catch (err) {
    console.error(err);
    toast.error(
      err instanceof Error ? err.message : "Unexpected error occurred",
    );
    return { errors, status: false };
  }
}

export default function GoalUpdateForm({ loaderData }: Route.ComponentProps) {
  const fetcher = useFetcher<typeof action>();
  const navigate = useNavigate();
  const { data } = (loaderData as unknown as LoaderData) || {
    data: null,
  };

  const [date, setDate] = useState<Date>(
    new Date(String(data?.deadline)) ?? new Date(),
  );

  const errors = fetcher.data?.errors;
  const isSubmitting = fetcher.state === "submitting";

  return (
    <div className="w-full max-w-md">
      <fetcher.Form method="post">
        <input type="hidden" name="id" value={data?.id} />
        <FieldGroup>
          <FieldSet>
            <FieldLegend className="font-semibold text-2xl">
              Create new goals
            </FieldLegend>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="goal-name">Goal Name</FieldLabel>
                <Input
                  id="goal-name"
                  name="name"
                  placeholder="e.g., Emergency Fund"
                  defaultValue={data?.name}
                  className={errors?.name ? "border-red-500" : ""}
                />
                {errors?.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={data?.description}
                  className={`h-25 resize-none ${errors?.description ? "border-red-500" : ""}`}
                />
                {errors?.description && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.description}
                  </p>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="target-amount">Target Amount</FieldLabel>
                <Input
                  id="target-amount"
                  name="target_amount"
                  placeholder="Input Target (10.000 Rp)"
                  defaultValue={data?.target_amount}
                  className={errors?.target_amount ? "border-red-500" : ""}
                />
                {errors?.target_amount && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.target_amount}
                  </p>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="target-date">Target Date</FieldLabel>
                <input
                  type="hidden"
                  name="target_date"
                  value={date.toISOString()}
                />
                <DatePicker
                  onChange={(d) => setDate(d ?? new Date())}
                  defaultValue={date}
                />
                {errors?.target_date && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.target_date}
                  </p>
                )}
              </Field>
            </FieldGroup>
          </FieldSet>

          <Field orientation="horizontal">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
            <Button
              onClick={(e) => {
                e.preventDefault();
                navigate("/auth/goals");
              }}
              variant="outline"
              type="button"
            >
              Cancel
            </Button>
          </Field>
        </FieldGroup>
      </fetcher.Form>
    </div>
  );
}
