import Header from "~/lib/components/shared/Header";
import { SettingsTab } from "../../lib/components/section/settings/SettingsTab";
import type { Route } from "./+types/settings";
import type { FinancialProfile } from "~/lib/types/financial-profile";
import type { User } from "~/lib/types/user";
import type { NotificationPreferences } from "~/lib/types/notifications";
import type { ActivityItem } from "~/lib/types/activity";
import { data, redirect } from "react-router";
import { getToken } from "~/lib/utils/tokenStore";

interface LoaderData {
  profile: FinancialProfile | null;
  user: User | null;
  notificationPrefs: NotificationPreferences | null;
  activity: ActivityItem[];
}

export async function clientLoader(_: Route.ClientLoaderArgs) {
  const token = getToken();
  if (!token) throw redirect("/login");

  const baseUrl = import.meta.env.VITE_REACT_BASE_API_URL || "";
  const headers = { Authorization: `Bearer ${token}` };

  const safe = async (p: Promise<Response>) => {
    try {
      const r = await p;
      if (r.status === 401) throw redirect("/login");
      return r.ok ? r.json() : null;
    } catch (e) {
      if (e instanceof Response) throw e;
      return null;
    }
  };

  const [profileRes, userRes, notifsRes, activityRes] = await Promise.all([
    fetch(`${baseUrl}/auth/v1/financial-profile`, { headers })
      .then((r) => {
        if (r.status === 401) throw redirect("/login");
        return r.ok ? r.json() : null;
      })
      .catch((e) => { if (e instanceof Response) throw e; return null; }),
    safe(fetch(`${baseUrl}/auth/v1/users/me`, { headers })),
    safe(fetch(`${baseUrl}/auth/v1/notification-settings`, { headers })),
    safe(fetch(`${baseUrl}/auth/v1/activity?limit=20&offset=0`, { headers })),
  ]);

  return {
    profile: profileRes?.data as FinancialProfile ?? null,
    user: (userRes?.data ?? null) as User | null,
    notificationPrefs: (notifsRes?.data ?? null) as NotificationPreferences | null,
    activity: (activityRes?.data ?? []) as ActivityItem[],
  } satisfies LoaderData;
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const token = getToken();
  const formData = await request.formData();
  const intent = formData.get("intent");
  const baseUrl = import.meta.env.VITE_REACT_BASE_API_URL || "";
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

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

    const res = await fetch(`${baseUrl}/auth/v1/financial-profile`, {
      method: "POST",
      headers,
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

    if (res.status === 401) throw redirect("/login");
    if (!res.ok) {
      const body = await res.json().catch(() => ({ error: "Something went wrong" }));
      return data({ errors: { form: body.error as string }, success: false }, { status: 400 });
    }
    return data({ errors: null, success: true }, { status: 200 });
  }

  if (intent === "user-profile") {
    const first_name = (formData.get("first_name") as string) || undefined;
    const last_name = (formData.get("last_name") as string) || undefined;
    const phone = (formData.get("phone") as string) || undefined;

    const res = await fetch(`${baseUrl}/auth/v1/users/profile`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({
        ...(first_name !== undefined ? { first_name } : {}),
        ...(last_name !== undefined ? { last_name } : {}),
        ...(phone !== undefined ? { phone } : {}),
      }),
    });

    if (res.status === 401) throw redirect("/login");
    if (!res.ok) {
      const body = await res.json().catch(() => ({ error: "Failed to update profile" }));
      return data({ errors: { form: body.error as string }, success: false }, { status: 400 });
    }
    return data({ errors: null, success: true }, { status: 200 });
  }

  if (intent === "notification-settings") {
    const body = {
      budget_alerts: formData.get("budget_alerts") === "true",
      goal_reminders: formData.get("goal_reminders") === "true",
      anomaly_alerts: formData.get("anomaly_alerts") === "true",
      weekly_summary: formData.get("weekly_summary") === "true",
      push_enabled: formData.get("push_enabled") === "true",
    };

    const res = await fetch(`${baseUrl}/auth/v1/notification-settings`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (res.status === 401) throw redirect("/login");
    if (!res.ok) {
      return data({ errors: { form: "Failed to save preferences" }, success: false }, { status: 400 });
    }
    return data({ errors: null, success: true }, { status: 200 });
  }

  return data({ errors: null, success: false }, { status: 400 });
}

export default function Settings({ loaderData }: Route.ComponentProps) {
  const { profile, user, notificationPrefs, activity } = (loaderData as unknown as LoaderData) || {
    profile: null,
    user: null,
    notificationPrefs: null,
    activity: [],
  };

  return (
    <div className="space-y-6">
      <Header title="Settings" subtitle="Manage your account and preferences" />
      <SettingsTab profile={profile} user={user} notificationPrefs={notificationPrefs} activity={activity} />
    </div>
  );
}
