import { Outlet, redirect } from "react-router";
import { SidebarProvider } from "~/components/ui/sidebar";
import { AppSidebar } from "~/lib/components/AppSidebar";
import type { Route } from "../+types/layout";
import { getToken } from "~/lib/utils/tokenStore";
import Loading from "~/lib/components/shared/Loading";

export async function clientLoader(_: Route.ClientLoaderArgs) {
  const token = getToken();
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
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
}
