"use server";

export async function createGoals(formData: Promise<FormData>, token: string) {
  const fd = await formData;
  const name = fd.get("name");
  const description = fd.get("description");
  const target_amount = fd.get("target_amount");
  const target_date = fd.get("target_date");

  const errors: {
    name?: string;
    description?: string;
    target_amount?: string;
    target_date?: string;
  } = {};

  if (!name) errors.name = "Please input the name of the goal";
  if (!description) errors.description = "Please input the description";
  if (!target_amount) {
    errors.target_amount = "Please input the target amount";
  } else if (isNaN(Number(target_amount))) {
    errors.target_amount = "Please insert a number for the targeted amount";
  }
  if (!target_date) errors.target_date = "Please input the target date";

  if (Object.keys(errors).length > 0) {
    return { data: null, errors, status: 400 };
  }

  const baseUrl = process.env.API_BASE_URL;

  const payload = {
    name,
    description,
    target_amount: Number(target_amount),
    deadline: new Date(target_date?.toString() ?? ""),
  };

  try {
    const response = await fetch(`${baseUrl}/auth/v1/goals`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then((val) => val.json());
    return { data: response, errors: null, status: 200 };
  } catch (err) {
    return { data: null, errors: err, status: 500 };
  }
}
