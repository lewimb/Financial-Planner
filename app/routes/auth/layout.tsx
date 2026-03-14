import { Outlet } from "react-router";
import { SidebarProvider } from "~/components/ui/sidebar";
import { AppSidebar } from "~/lib/components/AppSidebar";
import type { Route } from "../+types/layout";
import { parse } from "cookie";
import { redirect } from "react-router";

export function loader({ request }: Route.LoaderArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const cookies = parse(cookieHeader || "");
  const token = cookies.accessToken;

  if (!token) {
    throw redirect("/login");
  }

  if (token) {
    const rawJwt = atob(token);

    // 3. Extract and parse the payload (the middle part)
    const payloadPart = rawJwt.split(".")[1];
    if (!payloadPart) throw new Error("Invalid Token Format");

    // Standard atob for the payload
    const payload = JSON.parse(atob(payloadPart));

    // 4. Check expiration (JWT exp is in seconds, Date.now() is in ms)
    const isExpired = payload.exp * 1000 < Date.now();

    if (isExpired) {
      console.warn("Token expired, redirecting...");
      throw redirect("/login");
    }
  }
}

export default function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="w-full">
        <div className="p-6 ">
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
}
