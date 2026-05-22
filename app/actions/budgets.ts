import type { UpdateBudgetRequest } from "~/lib/types/budgets";

export async function GetBudgets(token: string, baseApi: string) {
  const { data } = await fetch(`${baseApi}/auth/v1/budgets`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((value) => value.json());

  return data;
}

export async function GetUsageBudgets(token: string, baseApi: string) {
  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;

  const response = await fetch(
    `${baseApi}/auth/v1/budgets/usage?year=${year}&month=${month}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  ).then((value) => value.json());

  // API returns a direct array, not a wrapped object
  return Array.isArray(response) ? response : response.data ?? [];
}

export async function GetMonthlyExpense(token: string, baseApi: string) {
  const response = await fetch(`${baseApi}/auth/v1/transactions/monthly`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((value) => value.json());

  return response.total ?? 0;
}

export async function GetMonthlyIncome(token: string, baseApi: string) {
  const response = await fetch(`${baseApi}/auth/v1/transactions/monthly-income`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((value) => value.json());

  return response.total ?? 0;
}

export async function GetBudgetById(
  id: number,
  token: string,
  baseApi: string,
) {
  try {
    const response = await fetch(`${baseApi}/auth/v1/budgets/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function UpdateBudget(
  requestData: UpdateBudgetRequest,
  baseApi: string,
  token: string,
  id: number,
) {
  try {
    const response = await fetch(`${baseApi}/auth/v1/budgets/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        limit_amount: requestData.limitAmount,
        alert_threshold: requestData.alertThreshold,
        category: requestData.category,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
}
