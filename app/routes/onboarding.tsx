import { useState } from "react";
import { redirect, Form, useActionData, useNavigation } from "react-router";
import type { Route } from "./+types/onboarding";
import tokenParser from "~/lib/utils/tokenParser";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "~/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "~/components/ui/field";

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

export async function loader({ request }: Route.LoaderArgs) {
  const { token, isExpired } = tokenParser(request);
  if (!token || isExpired) throw redirect("/login");

  const baseUrl = process.env.API_BASE_URL;
  const res = await fetch(`${baseUrl}/auth/v1/financial-profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.ok) throw redirect("/auth");
  return null;
}

export async function action({ request }: Route.ActionArgs) {
  const { token } = tokenParser(request);
  const formData = await request.formData();

  const monthly_income = Number(formData.get("monthly_income"));
  const fixed_expenses = Number(formData.get("fixed_expenses"));
  const current_savings = Number(formData.get("current_savings"));
  const debt = Number(formData.get("debt"));
  const employment_status = formData.get("employment_status") as string;
  const financial_goals = formData.getAll("financial_goals") as string[];
  const spending_habit = (formData.get("spending_habit") as string) || undefined;
  const risk_level = (formData.get("risk_level") as string) || undefined;

  const errors: Record<string, string> = {};
  if (!employment_status) errors.employment_status = "Required";
  if (financial_goals.length === 0)
    errors.financial_goals = "Select at least one goal";
  if (isNaN(monthly_income) || monthly_income < 0)
    errors.monthly_income = "Required, must be >= 0";
  if (isNaN(fixed_expenses) || fixed_expenses < 0)
    errors.fixed_expenses = "Required, must be >= 0";
  if (isNaN(current_savings) || current_savings < 0)
    errors.current_savings = "Required, must be >= 0";
  if (isNaN(debt) || debt < 0) errors.debt = "Required, must be >= 0";

  if (Object.keys(errors).length > 0) return { errors, success: false };

  const baseUrl = process.env.API_BASE_URL;
  try {
    const res = await fetch(`${baseUrl}/auth/v1/financial-profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        monthly_income,
        fixed_expenses,
        current_savings,
        debt,
        employment_status,
        financial_goals,
        ...(spending_habit ? { spending_habit } : {}),
        ...(risk_level ? { risk_level } : {}),
      }),
    });

    if (!res.ok) {
      const body = await res
        .json()
        .catch(() => ({ error: "Something went wrong" }));
      return { errors: { form: body.error as string }, success: false };
    }

    throw redirect("/auth");
  } catch (err) {
    if (err instanceof Response) throw err;
    return { errors: { form: "Something went wrong" }, success: false };
  }
}

export default function Onboarding() {
  const [step, setStep] = useState<1 | 2>(1);
  const [step1, setStep1] = useState({
    monthly_income: "",
    fixed_expenses: "",
    current_savings: "",
    debt: "",
  });
  const [step1Errors, setStep1Errors] = useState<Record<string, string>>({});
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    if (step1.monthly_income === "" || Number(step1.monthly_income) < 0)
      errs.monthly_income = "Required, must be >= 0";
    if (step1.fixed_expenses === "" || Number(step1.fixed_expenses) < 0)
      errs.fixed_expenses = "Required, must be >= 0";
    if (step1.current_savings === "" || Number(step1.current_savings) < 0)
      errs.current_savings = "Required, must be >= 0";
    if (step1.debt === "" || Number(step1.debt) < 0)
      errs.debt = "Required, must be >= 0";
    setStep1Errors(errs);
    return Object.keys(errs).length === 0;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Financial Planning Setup</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Complete your profile to unlock AI-powered insights
          </p>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <div className="h-2 flex-1 rounded-full bg-primary" />
          <div
            className={`h-2 flex-1 rounded-full ${step >= 2 ? "bg-primary" : "bg-muted"}`}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {step === 1 ? "Your Finances" : "Your Profile"}
            </CardTitle>
            <CardDescription>
              {step === 1
                ? "Tell us about your current financial situation. Step 1 of 2."
                : "Help us personalize your experience. Step 2 of 2."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 1 && (
              <div className="space-y-4">
                <FieldGroup>
                  <Field>
                    <FieldLabel>Monthly Income (Rp)</FieldLabel>
                    <Input
                      type="number"
                      min={0}
                      value={step1.monthly_income}
                      onChange={(e) =>
                        setStep1((s) => ({
                          ...s,
                          monthly_income: e.target.value,
                        }))
                      }
                      placeholder="8000000"
                      className={
                        step1Errors.monthly_income ? "border-red-500" : ""
                      }
                    />
                    {step1Errors.monthly_income && (
                      <p className="text-xs text-red-500 mt-1">
                        {step1Errors.monthly_income}
                      </p>
                    )}
                  </Field>
                  <Field>
                    <FieldLabel>Monthly Fixed Expenses (Rp)</FieldLabel>
                    <Input
                      type="number"
                      min={0}
                      value={step1.fixed_expenses}
                      onChange={(e) =>
                        setStep1((s) => ({
                          ...s,
                          fixed_expenses: e.target.value,
                        }))
                      }
                      placeholder="3000000"
                      className={
                        step1Errors.fixed_expenses ? "border-red-500" : ""
                      }
                    />
                    {step1Errors.fixed_expenses && (
                      <p className="text-xs text-red-500 mt-1">
                        {step1Errors.fixed_expenses}
                      </p>
                    )}
                  </Field>
                  <Field>
                    <FieldLabel>Current Savings (Rp)</FieldLabel>
                    <Input
                      type="number"
                      min={0}
                      value={step1.current_savings}
                      onChange={(e) =>
                        setStep1((s) => ({
                          ...s,
                          current_savings: e.target.value,
                        }))
                      }
                      placeholder="5000000"
                      className={
                        step1Errors.current_savings ? "border-red-500" : ""
                      }
                    />
                    {step1Errors.current_savings && (
                      <p className="text-xs text-red-500 mt-1">
                        {step1Errors.current_savings}
                      </p>
                    )}
                  </Field>
                  <Field>
                    <FieldLabel>Total Debt (Rp)</FieldLabel>
                    <Input
                      type="number"
                      min={0}
                      value={step1.debt}
                      onChange={(e) =>
                        setStep1((s) => ({ ...s, debt: e.target.value }))
                      }
                      placeholder="0"
                      className={step1Errors.debt ? "border-red-500" : ""}
                    />
                    {step1Errors.debt && (
                      <p className="text-xs text-red-500 mt-1">
                        {step1Errors.debt}
                      </p>
                    )}
                  </Field>
                </FieldGroup>
                <div className="flex justify-end">
                  <Button onClick={() => validateStep1() && setStep(2)}>
                    Next
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <Form method="post">
                <input
                  type="hidden"
                  name="monthly_income"
                  value={step1.monthly_income}
                />
                <input
                  type="hidden"
                  name="fixed_expenses"
                  value={step1.fixed_expenses}
                />
                <input
                  type="hidden"
                  name="current_savings"
                  value={step1.current_savings}
                />
                <input type="hidden" name="debt" value={step1.debt} />

                <div className="space-y-4">
                  <FieldGroup>
                    <Field>
                      <FieldLabel>Employment Status</FieldLabel>
                      <select
                        name="employment_status"
                        defaultValue=""
                        className={`w-full h-10 rounded-md border bg-background px-3 py-2 text-sm ${
                          actionData?.errors?.employment_status
                            ? "border-red-500"
                            : "border-input"
                        }`}
                      >
                        <option value="" disabled>
                          Select status...
                        </option>
                        {EMPLOYMENT_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                      {actionData?.errors?.employment_status && (
                        <p className="text-xs text-red-500 mt-1">
                          {actionData.errors.employment_status}
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
                              className="rounded"
                            />
                            {g.label}
                          </label>
                        ))}
                      </div>
                      {actionData?.errors?.financial_goals && (
                        <p className="text-xs text-red-500 mt-1">
                          {actionData.errors.financial_goals}
                        </p>
                      )}
                    </Field>

                    <Field>
                      <FieldLabel>Spending Habit (optional)</FieldLabel>
                      <select
                        name="spending_habit"
                        defaultValue=""
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
                      <FieldLabel>Risk Tolerance (optional)</FieldLabel>
                      <select
                        name="risk_level"
                        defaultValue=""
                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        {RISK_LEVEL_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </FieldGroup>

                  {actionData?.errors?.form && (
                    <p className="text-sm text-red-500">
                      {actionData.errors.form}
                    </p>
                  )}

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(1)}
                    >
                      Back
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Saving..." : "Complete Setup"}
                    </Button>
                  </div>
                </div>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
