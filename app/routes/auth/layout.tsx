import { Outlet, redirect } from "react-router";
import { SidebarProvider } from "~/components/ui/sidebar";
import { AppSidebar } from "~/lib/components/AppSidebar";
import type { Route } from "../+types/layout";
import { getToken, setToken } from "~/lib/utils/tokenStore";
import Loading from "~/lib/components/shared/Loading";
import { NotificationBell } from "~/lib/components/shared/NotificationBell";

function getCookieValue(name: string): string | null {
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
}

export async function clientLoader(_: Route.ClientLoaderArgs) {
  let token = getToken();
  if (!token) {
    const cookieToken = getCookieValue("accessToken");
    if (cookieToken) {
      setToken(cookieToken);
      token = cookieToken;
    }
  }
  if (!token) throw redirect("/login");

  const baseUrl = import.meta.env.VITE_REACT_BASE_API_URL || "";
  const res = await fetch(`${baseUrl}/auth/v1/financial-profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 404) throw redirect("/onboarding");

  return null;
}

export function HydrateFallback() {
  return <Loading />;
}

export default function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="w-full">
        <div className="flex justify-end items-center px-6 pt-4">
          <NotificationBell />
        </div>
        <div className="p-6 pt-2">
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
}
