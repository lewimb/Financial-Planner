import Header from "~/lib/components/shared/Header";
import { Modal } from "~/lib/components/shared/Modal";
import BudgetForm from "~/lib/components/section/budget/BudgetForm";
import BudgetOverview from "~/lib/components/section/budget/BudgetOverview";
import BudgetCategories from "~/lib/components/section/budget/BudgetCategories";
import BudgetBreakdown from "../../lib/components/section/budget/BudgetBreakdown";
import tokenParser from "~/lib/utils/tokenParser";
import type { Route } from "./+types/budgets";
import {
  GetBudgets,
  GetMonthlyExpense,
  GetUsageBudgets,
} from "~/actions/budgets";
import { GetTransactionById } from "~/actions/transactions";

export interface BudgetUsage {
  budget_id: number;
  category: string;
  limit: number;
  used: number;
  remaining: number;
  percentage: number;
  status: string;
  period: string;
}

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const baseApi = process.env.VITE_REACT_BASE_API_URL || "";
    const { token } = tokenParser(request);
    const data = await GetBudgets(token, baseApi);
    const usageData: BudgetUsage[] = await GetUsageBudgets(token, baseApi);
    const monthlyExpense = await GetMonthlyExpense(token, baseApi);
    const transactionData = await GetTransactionById(baseApi, token);

    let totalBudget = 0;
    let totalTransaction = 0;

    if (data.length > 0) {
      totalBudget = usageData.reduce((acc: number, val) => acc + val.limit, 0);
    }

    if (transactionData) {
      totalTransaction = transactionData.reduce(
        (acc: number, val: { amount: number; type: string }) => {
          if (val.type === "EXPENSE") {
            return Number(acc) + Number(val.amount);
          }
          return acc;
        },
        0, // ← initial value
      );
    }

    const remainingBudget = totalBudget - Number(totalTransaction);
    const remainingPercentage = (remainingBudget / totalBudget) * 100;

    return {
      budgets: data,
      usage: usageData,
      totalBudget,
      monthlyExpense,
      remainingBudget,
      remainingPercentage,
    };
  } catch (err) {
    console.error("Error loading budgets:", err);
  }
}

export async function action({ request }: Route.ActionArgs) {
  const baseApi = process.env.VITE_REACT_BASE_API_URL || "";

  if (request.method === "POST" || request.method === "PATCH") {
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
        request.method === "PATCH"
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
  } = loaderData || {
    budgets: null,
    usage: null,
    totalBudget: 0,
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
          <BudgetCategories items={usage ? usage : []} />
        </div>
        <BudgetBreakdown total={totalBudget} items={usage ? usage : []} />
      </div>
    </section>
  );
}
