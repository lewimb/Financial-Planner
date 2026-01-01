import { Outlet } from "react-router";
import { SidebarProvider } from "~/components/ui/sidebar";
import { AppSidebar } from "~/lib/components/AppSidebar";
export default function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <div className="p-6 ">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
}
