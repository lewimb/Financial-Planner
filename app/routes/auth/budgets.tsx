import Header from "~/lib/components/shared/Header";
import { Modal } from "~/lib/components/shared/Modal";
import BudgetForm from "~/lib/components/section/budget/BudgetForm";
import BudgetOverview from "~/lib/components/section/budget/BudgetOverview";
import BudgetCategories from "~/lib/components/section/budget/BudgetCategories";
import BudgetBreakdown from "../../lib/components/section/budget/BudgetBreakdown";
import type { Route } from "./+types/budgets";
import type { BudgetUsage } from "~/lib/types/budgets";
import { redirect } from "react-router";
import { getToken } from "~/lib/utils/tokenStore";

export async function clientLoader(_: Route.ClientLoaderArgs) {
  const token = getToken();
  if (!token) throw redirect("/login");

  const baseUrl = import.meta.env.VITE_REACT_BASE_API_URL || "";
  const headers = { Authorization: `Bearer ${token}` };
  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;

  try {
    const [budgetsRes, usageRes, monthlyRes] = await Promise.all([
      fetch(`${baseUrl}/auth/v1/budgets`, { headers }).then((r) => r.json()),
      fetch(`${baseUrl}/auth/v1/budgets/usage?year=${year}&month=${month}`, {
        headers,
      }).then((r) => r.json()),
      fetch(`${baseUrl}/auth/v1/transactions/monthly`, { headers }).then((r) =>
        r.json(),
      ),
    ]);

    const data = budgetsRes?.data ?? [];
    const usage = (
      Array.isArray(usageRes) ? usageRes : (usageRes?.data ?? [])
    ) as BudgetUsage[];
    const monthlyExpense = monthlyRes?.total ?? 0;

    const totalBudget =
      usage.length > 0 ? usage.reduce((acc, val) => acc + val.limit, 0) : 0;
    const remainingBudget = totalBudget - Number(monthlyExpense);
    const remainingPercentage =
      totalBudget > 0 ? (remainingBudget / totalBudget) * 100 : 0;

    return {
      budgets: data,
      usage,
      totalBudget,
      monthlyExpense,
      remainingBudget,
      remainingPercentage,
    };
  } catch {
    return {
      budgets: [],
      usage: [],
      totalBudget: 0,
      monthlyExpense: 0,
      remainingBudget: 0,
      remainingPercentage: 0,
    };
  }
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const token = getToken();
  const baseApi = import.meta.env.VITE_REACT_BASE_API_URL || "";

  if (request.method === "POST" || request.method === "PUT") {
    const formData = await request.json();
    const payload = {
      category: formData.category,
      period: formData.period,
      year:
        formData.year === null || formData.year === undefined
          ? null
          : Number(formData.year),
      limit_amount: Number(formData.limitAmount),
      alert_threshold: Number(formData.alertThreshold),
    };

    try {
      const url =
        request.method === "PUT"
          ? `${baseApi}/auth/v1/budgets/${formData.id}`
          : `${baseApi}/auth/v1/budgets`;

      const response = await fetch(url, {
        method: request.method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 401) throw redirect("/login");
      if (!response.ok) {
        const error = await response.text();
        return new Response(JSON.stringify({ success: false, error }), {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        });
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      if (error instanceof Response) throw error;
      return new Response(
        JSON.stringify({ success: false, error: "Unknown error" }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }
  }

  if (request.method === "DELETE") {
    const fd = await request.formData();
    const id = fd.get("id") as string;
    try {
      const response = await fetch(`${baseApi}/auth/v1/budgets/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 401) throw redirect("/login");
      return { success: response.ok };
    } catch (error) {
      if (error instanceof Response) throw error;
      return { success: false };
    }
  }

  return new Response(
    JSON.stringify({ success: false, error: "Method not allowed" }),
    { status: 405, headers: { "Content-Type": "application/json" } },
  );
}

export default function Budget({ loaderData }: Route.ComponentProps) {
  const {
    budgets,
    usage,
    totalBudget,
    monthlyExpense,
    remainingBudget,
    remainingPercentage,
  } = loaderData ?? {
    budgets: [],
    usage: [],
    totalBudget: 0,
    monthlyExpense: 0,
    remainingBudget: 0,
    remainingPercentage: 0,
  };

  return (
    <section className="space-y-6">
      <Header
        title="Budgets"
        subtitle="Monitor your spending across categories"
      >
        <Modal label="+ Add Budget">
          <BudgetForm />
        </Modal>
      </Header>
      <BudgetOverview
        totalBudget={totalBudget}
        totalSpending={monthlyExpense}
        remainingBudget={remainingBudget}
        remainingPercentage={remainingPercentage}
      />
      <div className="grid grid-cols-4 gap-6">
        <div className="col-span-3">
          <BudgetCategories items={usage ?? []} />
        </div>
        <BudgetBreakdown total={totalBudget} items={usage ?? []} />
      </div>
    </section>
  );
}
