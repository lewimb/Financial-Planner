"use server";

export async function createGoals(formData: Promise<FormData>, token: string) {
  const name = (await formData).get("name");
  const description = (await formData).get("description");
  const target_amount = (await formData).get("target_amount");
  const target_date = (await formData).get("target_date");

  const errors: {
    name?: string;
    description?: string;
    target_amount?: string;
    target_date?: string;
  } = {};

  if (name === "") {
    errors.name = "Please input the name of the goal";
  }

  if (description === "") {
    errors.description = "please input the description";
  }

  if (target_amount === "") {
    errors.target_amount = "Please input the target amount";
  }

  if (isNaN(Number(target_amount))) {
    errors.target_amount = "Please insert a number for the targeted amount";
  }

  if (target_date === "") {
    errors.target_date = "please input the target date";
  }

  if (Object.keys(errors).length > 0) {
    return { data: null, errors: errors, status: 400 };
  }

  const baseUrl = process.env.VITE_REACT_BASE_API_URL;

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
        Authorization: `Bearer ${token}`,
      },
    }).then((val) => val.json());
    return { data: response, errors: null, status: 200 };
  } catch (err) {
    return { data: null, errors: err, status: 500 };
  }
}

export async function addContribution(
  formData: Promise<FormData>,
  token: string,
) {
  const id = (await formData).get("id");
  const contribution = (await formData).get("contribution");

  if (isNaN(Number(contribution))) {
    return {
      data: null,
      errors: "contribution should be an integer",
      status: 400,
    };
  }

  const baseUrl = process.env.VITE_REACT_BASE_API_URL;
  try {
    const response = await fetch(`${baseUrl}/auth/v1/goals/contribute`, {
      method: "PATCH",
      body: JSON.stringify({
        contribution: Number(contribution),
        goal_id: Number(id),
      }),
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((val) => val.json());

    console.log(response);

    return { data: response, errors: null, status: 200 };
  } catch (err) {
    return { data: null, errors: err, status: 500 };
  }
}
