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
      route("/budgets", "./routes/auth/budgets.tsx"),
      route("/goals", "./routes/auth/goals.tsx"),
      route("/settings", "./routes/auth/settings.tsx"),
      route("/reports", "./routes/auth/reports.tsx"),
      route("/ai-coach", "./routes/auth/ai-coach.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
