import Header from "~/lib/components/shared/Header";
import { Modal } from "~/lib/components/shared/Modal";
import BudgetForm from "~/lib/components/section/budget/BudgetForm";
import BudgetOverview from "~/lib/components/section/budget/BudgetOverview";
import BudgetCategories from "~/lib/components/section/budget/BudgetCategories";
import BudgetBreakdown from "../../lib/components/section/budget/BudgetBreakdown";
import tokenParser from "~/lib/utils/tokenParser";
import type { Route } from "./+types/budgets";
import type { BudgetUsage } from "~/lib/types/budgets";
import {
  GetBudgets,
  GetMonthlyExpense,
  GetUsageBudgets,
} from "~/actions/budgets";

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const baseApi = process.env.API_BASE_URL || "";
    const { token } = tokenParser(request);
    const [data, usageData, monthlyExpense] = await Promise.all([
      GetBudgets(token, baseApi),
      GetUsageBudgets(token, baseApi),
      GetMonthlyExpense(token, baseApi),
    ]);
    const usage = (usageData ?? []) as BudgetUsage[];

    const totalBudget =
      usage.length > 0
        ? usage.reduce((acc, val) => acc + val.limit, 0)
        : 0;

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
  } catch (err) {
    console.error("Error loading budgets:", err);
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

export async function action({ request }: Route.ActionArgs) {
  const baseApi = process.env.API_BASE_URL || "";

  if (request.method === "POST" || request.method === "PUT") {
    const formData = await request.json();
    const { token } = tokenParser(request);

    const payload = {
      category: formData.category,
      period: formData.period,
      month: formData.month ? Number(formData.month) : null,
      year: Number(formData.year),
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
      return new Response(
        JSON.stringify({
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  }

  if (request.method === "DELETE") {
    const fd = await request.formData();
    const id = fd.get("id") as string;
    const { token } = tokenParser(request);
    try {
      await fetch(`${baseApi}/auth/v1/budgets/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      return { success: true };
    } catch {
      return { success: false };
    }
  }

  return new Response(
    JSON.stringify({ success: false, error: "Method not allowed" }),
    {
      status: 405,
      headers: { "Content-Type": "application/json" },
    },
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
