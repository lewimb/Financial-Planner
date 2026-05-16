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

  return response;
}

export async function GetMonthlyExpense(token: string, baseApi: string) {
  const response = await fetch(`${baseApi}/auth/v1/transactions/count`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((value) => {
    return value.json();
  });

  const { total } = response;

  return total;
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
    console.log(err);
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
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
}
