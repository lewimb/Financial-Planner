import { Outlet, redirect } from "react-router";
import type { Route } from "../+types/root";
import { getToken } from "~/lib/utils/tokenStore";

export function clientLoader(_: Route.ClientLoaderArgs) {
  if (getToken()) throw redirect("/auth");
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
