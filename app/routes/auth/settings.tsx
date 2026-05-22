import Header from "~/lib/components/shared/Header";
import { SettingsTab } from "../../lib/components/section/settings/SettingsTab";
import type { Route } from "./+types/settings";
import tokenParser from "~/lib/utils/tokenParser";
import type { FinancialProfile } from "~/lib/types/financial-profile";
import { data } from "react-router";

interface LoaderData {
  profile: FinancialProfile | null;
}

export async function loader({ request }: Route.LoaderArgs) {
  const { token } = tokenParser(request);
  const baseUrl = process.env.VITE_REACT_BASE_API_URL;

  const res = await fetch(`${baseUrl}/auth/v1/financial-profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.ok) {
    const body = await res.json();
    return { profile: body.data as FinancialProfile };
  }
  return { profile: null };
}

export async function action({ request }: Route.ActionArgs) {
  const { token } = tokenParser(request);
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "financial-profile") {
    const monthly_income = Number(formData.get("monthly_income"));
    const fixed_expenses = Number(formData.get("fixed_expenses"));
    const current_savings = Number(formData.get("current_savings"));
    const debt = Number(formData.get("debt"));
    const employment_status = formData.get("employment_status") as string;
    const financial_goals = formData.getAll("financial_goals") as string[];
    const spending_habit =
      (formData.get("spending_habit") as string) || undefined;
    const risk_level = (formData.get("risk_level") as string) || undefined;

    const errors: Record<string, string> = {};
    if (!employment_status) errors.employment_status = "Required";
    if (financial_goals.length === 0)
      errors.financial_goals = "Select at least one goal";
    if (isNaN(monthly_income) || monthly_income < 0)
      errors.monthly_income = "Must be >= 0";
    if (isNaN(fixed_expenses) || fixed_expenses < 0)
      errors.fixed_expenses = "Must be >= 0";
    if (isNaN(current_savings) || current_savings < 0)
      errors.current_savings = "Must be >= 0";
    if (isNaN(debt) || debt < 0) errors.debt = "Must be >= 0";

    if (Object.keys(errors).length > 0)
      return data({ errors, success: false }, { status: 400 });

    const baseUrl = process.env.VITE_REACT_BASE_API_URL;
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
      return data(
        { errors: { form: body.error as string }, success: false },
        { status: 400 },
      );
    }
    return data({ errors: null, success: true }, { status: 200 });
  }

  return data({ errors: null, success: false }, { status: 400 });
}

export default function Settings({ loaderData }: Route.ComponentProps) {
  const { profile } = (loaderData as unknown as LoaderData) || {
    profile: null,
  };

  return (
    <div className="space-y-6">
      <Header title="Settings" subtitle="Manage your account and preferences" />
      <SettingsTab profile={profile} />
    </div>
  );
}
