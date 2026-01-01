import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../../components/ui/sidebar";
import { NavLink } from "react-router";
import {
  Settings,
  LayoutDashboard,
  ArrowLeftRight,
  Wallet2,
  Target,
  LucideMessageSquare,
  ChartBar,
} from "lucide-react";
import { useLocation } from "react-router";
import { cn } from "../utils";

const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Transactions",
    url: "/transactions",
    icon: ArrowLeftRight,
  },
  {
    title: "Budgets",
    url: "/budgets",
    icon: Wallet2,
  },
  {
    title: "Goals",
    url: "/goals",
    icon: Target,
  },
  {
    title: "AI Coach",
    url: "/ai-coach",
    icon: LucideMessageSquare,
  },
  {
    title: "Reports",
    url: "/reports",
    icon: ChartBar,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const currentPath = useLocation().pathname.split("auth")[1] || "/";

  return (
    <Sidebar>
      <SidebarHeader className="flex flex-row items-center p-4">
        <div className="p-2 bg-black rounded-lg">
          <Wallet2 className="size-6 text-white" />
        </div>
        <span className="text-xl font-semibold">FinancePlanner</span>
      </SidebarHeader>
      <SidebarContent className="p-4 border-y border-neutral-300">
        <SidebarGroup className="p-0">
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  className={cn(
                    "text-neutral-600 duration-300 rounded-lg",
                    item.url === currentPath &&
                      "bg-black text-white pointer-events-none"
                  )}
                  asChild
                >
                  <NavLink to={`/auth${item.url}`}>
                    <item.icon size={20} />
                    <span>{item.title}</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="hover:bg-neutral-200 rounded-lg duration-300 flex px-3 py-2 gap-2 items-center">
          <img
            src="https://wallpapers.com/images/hd/cool-profile-picture-87h46gcobjl5e4xu.jpg"
            alt="profile picture"
            className="size-8 rounded-full"
            loading="lazy"
          />
          <div>
            <p className="font-semibold">John Doe</p>
            <p className="text-sm text-neutral-500">johndoe@email.com</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
