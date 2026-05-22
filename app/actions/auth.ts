import type { RegisterRequest, RegisterResponse, AuthError } from "~/lib/types/auth";

type RegisterResult =
  | { success: true; data: RegisterResponse }
  | { success: false; status: number; error: string };

export async function register(
  payload: RegisterRequest,
  baseApi: string,
): Promise<RegisterResult> {
  const response = await fetch(`${baseApi}/v1/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (response.ok) {
    const data: RegisterResponse = await response.json();
    return { success: true, data };
  }

  const errorBody: AuthError = await response.json().catch(() => ({
    error: "Unexpected error occurred",
  }));

  return { success: false, status: response.status, error: errorBody.error };
}
