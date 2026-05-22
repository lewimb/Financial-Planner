import { Outlet, redirect } from "react-router";
import { SidebarProvider } from "~/components/ui/sidebar";
import { AppSidebar } from "~/lib/components/AppSidebar";
import type { Route } from "../+types/layout";
import tokenParser from "~/lib/utils/tokenParser";

export async function loader({ request }: Route.LoaderArgs) {
  const { token, isExpired } = tokenParser(request);

  if (!token) throw redirect("/login");
  if (isExpired) throw redirect("/login");

  const baseUrl = process.env.VITE_REACT_BASE_API_URL;
  const res = await fetch(`${baseUrl}/auth/v1/financial-profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 404) throw redirect("/onboarding");

  return null;
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
