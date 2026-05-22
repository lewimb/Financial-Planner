import { useFetcher } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "~/components/ui/field";
import type { FinancialProfile } from "~/lib/types/financial-profile";
import { formatRupiah } from "~/lib/utils/currencyFormatter";

const EMPLOYMENT_OPTIONS = [
  { value: "employed", label: "Employed" },
  { value: "self_employed", label: "Self-Employed" },
  { value: "student", label: "Student" },
  { value: "unemployed", label: "Unemployed" },
];

const GOAL_OPTIONS = [
  { value: "emergency_fund", label: "Emergency Fund" },
  { value: "house", label: "House" },
  { value: "investment", label: "Investment" },
  { value: "education", label: "Education" },
  { value: "travel", label: "Travel" },
  { value: "retirement", label: "Retirement" },
];

const SPENDING_HABIT_OPTIONS = [
  { value: "", label: "Not specified" },
  { value: "frugal", label: "Frugal" },
  { value: "moderate", label: "Moderate" },
  { value: "impulsive", label: "Impulsive" },
];

const RISK_LEVEL_OPTIONS = [
  { value: "", label: "Not specified" },
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

interface Props {
  profile: FinancialProfile | null;
}

export function SettingsFinancialProfile({ profile }: Props) {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";
  const errors = fetcher.data?.errors as Record<string, string> | undefined;
  const success = fetcher.data?.success as boolean | undefined;

  if (!profile) {
    return (
      <div className="text-center py-8 space-y-3">
        <p className="text-muted-foreground text-sm">
          You haven&apos;t set up your financial profile yet.
        </p>
        <a href="/onboarding">
          <Button>Complete Onboarding</Button>
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {profile.net_available !== undefined && (
        <div className="rounded-lg bg-muted/50 p-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Net Available</p>
            <p className="font-semibold text-lg">
              {formatRupiah(profile.net_available)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Current Savings</p>
            <p className="font-semibold text-lg">
              {formatRupiah(profile.current_savings)}
            </p>
          </div>
        </div>
      )}

      <fetcher.Form method="post" action="/auth/settings">
        <input type="hidden" name="intent" value="financial-profile" />
        <FieldGroup>
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>Monthly Income (Rp)</FieldLabel>
              <Input
                type="number"
                min={0}
                name="monthly_income"
                defaultValue={profile.monthly_income}
                className={errors?.monthly_income ? "border-red-500" : ""}
              />
              {errors?.monthly_income && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.monthly_income}
                </p>
              )}
            </Field>
            <Field>
              <FieldLabel>Fixed Expenses (Rp)</FieldLabel>
              <Input
                type="number"
                min={0}
                name="fixed_expenses"
                defaultValue={profile.fixed_expenses}
                className={errors?.fixed_expenses ? "border-red-500" : ""}
              />
              {errors?.fixed_expenses && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.fixed_expenses}
                </p>
              )}
            </Field>
            <Field>
              <FieldLabel>Current Savings (Rp)</FieldLabel>
              <Input
                type="number"
                min={0}
                name="current_savings"
                defaultValue={profile.current_savings}
                className={errors?.current_savings ? "border-red-500" : ""}
              />
              {errors?.current_savings && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.current_savings}
                </p>
              )}
            </Field>
            <Field>
              <FieldLabel>Total Debt (Rp)</FieldLabel>
              <Input
                type="number"
                min={0}
                name="debt"
                defaultValue={profile.debt}
                className={errors?.debt ? "border-red-500" : ""}
              />
              {errors?.debt && (
                <p className="text-xs text-red-500 mt-1">{errors.debt}</p>
              )}
            </Field>
          </div>

          <Field>
            <FieldLabel>Employment Status</FieldLabel>
            <select
              name="employment_status"
              defaultValue={profile.employment_status}
              className={`w-full h-10 rounded-md border bg-background px-3 py-2 text-sm ${
                errors?.employment_status ? "border-red-500" : "border-input"
              }`}
            >
              {EMPLOYMENT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            {errors?.employment_status && (
              <p className="text-xs text-red-500 mt-1">
                {errors.employment_status}
              </p>
            )}
          </Field>

          <Field>
            <FieldLabel>Financial Goals</FieldLabel>
            <div className="grid grid-cols-2 gap-2 mt-1">
              {GOAL_OPTIONS.map((g) => (
                <label
                  key={g.value}
                  className="flex items-center gap-2 text-sm cursor-pointer"
                >
                  <input
                    type="checkbox"
                    name="financial_goals"
                    value={g.value}
                    defaultChecked={profile.financial_goals.includes(g.value)}
                    className="rounded"
                  />
                  {g.label}
                </label>
              ))}
            </div>
            {errors?.financial_goals && (
              <p className="text-xs text-red-500 mt-1">
                {errors.financial_goals}
              </p>
            )}
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>Spending Habit</FieldLabel>
              <select
                name="spending_habit"
                defaultValue={profile.spending_habit ?? ""}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {SPENDING_HABIT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field>
              <FieldLabel>Risk Tolerance</FieldLabel>
              <select
                name="risk_level"
                defaultValue={profile.risk_level ?? ""}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {RISK_LEVEL_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          {errors?.form && (
            <p className="text-sm text-red-500">{errors.form}</p>
          )}
          {success && (
            <p className="text-sm text-green-600">Profile saved successfully.</p>
          )}

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </FieldGroup>
      </fetcher.Form>
    </div>
  );
}
