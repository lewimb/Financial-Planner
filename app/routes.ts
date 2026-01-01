import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("login", "./routes/login.tsx"),

  ...prefix("auth", [
    layout("./routes/auth/layout.tsx", [
      index("./routes/auth/dashboard.tsx"),
      route("/transactions", "./routes/auth/transactions.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
