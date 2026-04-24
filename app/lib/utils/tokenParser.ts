import { parse } from "cookie";
import type { Auth } from "../types/auth";

export default function tokenParser(request: Request) {
  const cookieHeader = request.headers.get("Cookie");
  const cookies = parse(cookieHeader || "");
  const token = cookies.accessToken;

  if (token) {
    const parts = token.split(".");
    if (parts.length !== 3) throw new Error("Invalid Token Format");

    // Decode payload (URL-safe base64 → Buffer)
    const payload: Auth = JSON.parse(
      Buffer.from(parts[1], "base64url").toString("utf-8"),
    );

    const isExpired = payload.exp * 1000 < Date.now();

    return { token, payload, isExpired };
  }

  return { token: "", payload: null, isExpired: null };
}
