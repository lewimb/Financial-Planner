import { Outlet, redirect } from "react-router";
import tokenParser from "~/lib/utils/tokenParser";
import type { Route } from "../+types/root";

export function loader({ request }: Route.LoaderArgs) {
  const parser = tokenParser(request);
  const url = new URL(request.url);

  if (parser?.token === undefined || parser?.isExpired) {
    if (url.pathname !== "/login") throw redirect("/login");
  }

  if (parser?.token && !parser.isExpired) {
    throw redirect("/auth");
  }
}

export default function layout() {
  return (
    <main>
      <div className="p-6">
        <Outlet />
      </div>
    </main>
  );
}
