import { Button } from "~/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { DatePicker } from "~/lib/components/shared/DatePicker";
import { useFetcher } from "react-router";
import { useState } from "react";

export function GoalsFields() {
  const [date, setDate] = useState(String(new Date()));
  const fetcher = useFetcher();
  let errors = fetcher.data?.errors;

  return (
    <div className="w-full max-w-md">
      <fetcher.Form method="post">
        <input type="hidden" name="intent" value={"post"} />
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
                  className={`h-25 resize-none ${errors?.description ? "border-red-500" : ""}`}
                />
                {errors?.description && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.description}
                  </p>
                )}
              </Field>

              <div className="grid">
                <Field>
                  <FieldLabel htmlFor="target-amount">Target Amount</FieldLabel>
                  <Input
                    id="target-amount"
                    name="target_amount"
                    placeholder="Input Target (10.000 Rp)"
                    className={errors?.target_amount ? "border-red-500" : ""}
                  />
                  {errors?.target_amount && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.target_amount}
                    </p>
                  )}
                </Field>
              </div>

              <Field>
                <FieldLabel htmlFor="target-date">Target Date</FieldLabel>
                <input type="hidden" name="target_date" value={date} />
                <DatePicker
                  onChange={(date) => setDate(String(date))}
                  defaultValue={date ? new Date(date) : new Date()}
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
            <Button type="submit" disabled={fetcher.state === "submitting"}>
              {fetcher.state === "submitting" ? "Submitting..." : "Submit"}
            </Button>
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </Field>
        </FieldGroup>
      </fetcher.Form>
    </div>
  );
}
