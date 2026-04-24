import { Outlet, redirect } from "react-router";
import { SidebarProvider } from "~/components/ui/sidebar";
import { AppSidebar } from "~/lib/components/AppSidebar";
import type { Route } from "../+types/layout";
import tokenParser from "~/lib/utils/tokenParser";

export function loader({ request }: Route.LoaderArgs) {
  const { token, isExpired } = tokenParser(request);

  if (!token) throw redirect("/login");
  if (isExpired) throw redirect("/login");

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
