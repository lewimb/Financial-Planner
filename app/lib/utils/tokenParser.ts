import { parse } from "cookie";
import type { Auth } from "../types/auth";

export default function tokenParser(request: Request) {
  const cookieHeader = request.headers.get("Cookie");
  const cookies = parse(cookieHeader || "");
  const token = cookies.accessToken;

  if (token) {
    const rawJwt = atob(token);

    // 3. Extract and parse the payload (the middle part)
    const payloadPart = rawJwt.split(".")[1];
    if (!payloadPart) throw new Error("Invalid Token Format");

    // Standard atob for the payload
    const payload: Auth = JSON.parse(atob(payloadPart));

    const isExpired = payload.exp * 1000 < Date.now();

    return {
      token: rawJwt,
      payload,
      isExpired,
    };
  }

  return null;
}
