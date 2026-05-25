import { Outlet, redirect } from "react-router";
import type { Route } from "../+types/root";
import { getToken } from "~/lib/utils/tokenStore";

export function clientLoader({ request }: Route.ClientLoaderArgs) {
  const url = new URL(request.url);
  if (getToken()) throw redirect("/auth");
  if (url.pathname === "/" || url.pathname === "") throw redirect("/login");
  return null;
}

export default function Layout() {
  return (
    <main>
      <div className="p-6">
        <Outlet />
      </div>
    </main>
  );
}
