# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## MVP Scope

Personal finance planning app. In-scope features:

1. **Transaction Management** — record income/expenses, categorize, filter by month/year, paginate
2. **Budget Management** — create budgets per category (`MONTHLY`/`YEARLY`), track usage with `SAFE`/`WARNING`/`EXCEEDED` status
3. **Goals** — create financial targets with deadline and target amount, track progress via manual contributions
4. **Dashboard** — aggregates monthly income, expense, net savings, budget summary, and active goals in one view
5. **AI Chatbot** — Gemini-powered Q&A about the user's financial data (net savings, expenses, budget status)

Out of scope: multi-currency, bank integrations, auto-investment, advanced analytics.

## Commands

```bash
npm run dev        # Start dev server at http://localhost:5173 (HMR enabled)
npm run build      # Production build (outputs to build/client and build/server)
npm run start      # Serve production build
npm run typecheck  # Run react-router typegen + tsc
```

No test runner is configured in this project.

## Environment

Requires a `.env` file at root:
```
VITE_REACT_BASE_API_URL="http://localhost:8080/api"
```

The backend API runs separately at `localhost:8080`. The `VITE_` prefix makes the variable available in client code via `import.meta.env`; server-side route code accesses it via `process.env`.

## Architecture

**Framework**: React Router v7 (full-stack, SSR). Uses file-based routing under `app/routes/`.

**Route structure**:
- `/` → `routes/layout.tsx` — checks token; redirects logged-in users to `/auth`, others to `/login`
- `/login` → `routes/login.tsx` — `clientAction` POSTs to `/v1/auth/login`, sets cookie, redirects to `/auth/`
- `/auth/*` → `routes/auth/layout.tsx` — protected layout; loader validates JWT expiry, wraps sidebar + outlet
- `/auth/dashboard` → no loader; composes 6 widgets (Overview, Analytics, Recent Transactions, Goals, Budget, Graph)
- `/auth/transactions` → loader calls `tokenParser` only; client-side hooks drive data fetching
- `/auth/budgets` → server loader fetches budgets + usage + monthly expense; action handles POST/PATCH
- `/auth/budget-detail` → server loader fetches single budget by ID; action PATCHes via FormData
- `/auth/goals` → server loader fetches goals + overview; action delegates to `createGoals()` / `addContribution()`
- `/auth/goal-update-form` → client-side form; loader fetches goal by ID
- `/auth/reports` → no loader; renders analytics components (read-only, out of MVP core)
- `/auth/ai-coach` → no loader; 4-column layout: Chatbot + Financial Health + Key Insights + Recommendations
- `/auth/settings` → no loader; renders profile, security, notifications, danger zone tabs

**Auth flow**: JWT stored in an `accessToken` cookie. `app/lib/utils/tokenParser.ts` decodes the base64url JWT and checks `exp * 1000 < Date.now()`. Called at the top of every protected loader/action to extract `{ token, payload, isExpired }`. Redirects to `/login` on failure.

**Data fetching split**:
- **Server loaders** (`budgets.tsx`, `goals.tsx`): use `process.env.VITE_REACT_BASE_API_URL` + Bearer token from cookie via `app/actions/` functions.
- **Client hooks** (`hooks/transactions/use-transaction.ts`, `hooks/budgets/use-budget.ts`): TanStack Query hooks using `import.meta.env.VITE_REACT_BASE_API_URL` + token passed from loader data.
- **`app/actions/`**: plain async fetch functions used exclusively in server-side loaders/actions (not React hooks).

**Mutations**: Route `action` functions proxy POST/PATCH/DELETE to the backend with the Bearer token. Transactions and budgets also have TanStack Query mutation hooks that invalidate the relevant cache on success.

## Component Organization

```
app/components/ui/                        # shadcn/ui primitives (Button, Input, Dialog, etc.)
app/lib/components/shared/                # layout primitives (Header, Modal, Overview, PieChart, ProgressBar)
app/lib/components/section/
  dashboard/    # DashboardAnalytics, Overview, RecentTransaction, FinancialGoals, BudgetOverview, Graph
  transaction/  # Table, Form, Overview, ExpenseForm, IncomeForm, Columns
  budget/       # Overview, Breakdown, Categories, Popover, Form
  goals/        # Overview, List, Milestone, Form, UpdateForm
  reports/      # Overview, Tab, Categories, Transactions, MonthComparison, Networth, SavingRate, TrendsMetric
  settings/     # Tab, Profile, Security, DangerZone, Notification, PushNotifications
  ai-coach/     # Chatbot, FinancialHealth, KeyInsights, Recommendation
```

## Server Actions (`app/actions/`)

| File | Functions |
|------|-----------|
| `budgets.ts` | `GetBudgets`, `GetUsageBudgets`, `GetMonthlyExpense`, `GetBudgetById`, `UpdateBudget` |
| `transactions.ts` | `GetTransactionById` |

Route-level server actions (goals) live in `app/routes/auth/actions.ts`: `createGoals()`, `addContribution()`.

## Types & Schemas (`app/lib/types/`)

| File | Defines |
|------|---------|
| `auth.ts` | `Auth` — JWT payload shape (`iss`, `sub`, `exp`, `iat`, `userId`, `scope`) |
| `user.ts` | `User` — user record shape |
| `response.ts` | `Response<K>` — generic paginated wrapper (`items[]`, `totalData`) |
| `transaction.ts` | `Transaction`, `TransactionForm`, `formSchema` (Zod) |
| `budgets.ts` | `Category` enum, `Period` type, `CreateBudgetRequest`, `UpdateBudgetRequest`, `formSchema` (Zod with cross-field validation) |
| `goals.ts` | `Goal`, `GoalOverview` (no Zod schema) |

## Utilities (`app/lib/utils/`)

| File | Exports |
|------|---------|
| `tokenParser.ts` | `tokenParser(request)` → `{ token, payload, isExpired }` |
| `session.ts` | `getSession`, `commitSession`, `destroySession` (cookie session storage) |
| `currencyFormatter.ts` | `formatRupiah(value)` → IDR currency string |
| `dateFormmatter.ts` | `getCurrentDate()`, `formatDate(dateStr)` (id-ID locale), `remainingDate(deadline)` (days left) |
| `objectFormatter.ts` | `categoryOptions` — `{value, label}` array from `Category` enum |
| `cookiesParser.ts` | `getCookie(name)` → client-side cookie value or null |

## State Management

- TanStack Query handles all server state. TanStack Form (`@tanstack/react-form`) handles form state.
- Cache keys: `["transactions", tab]` (tab encodes month/year filter), `["budget", userId]`
- No Redux store.

## Key Conventions

- Route files export `loader` (server), `action` (server), and a default component. Login also exports `clientAction`.
- `tokenParser(request)` is called at the top of every protected loader/action.
- Most forms submit JSON bodies (`request.json()`). Exception: `budget-detail.tsx` uses `FormData`.
- Goals have no client-side hooks — data flows exclusively through server loaders and route actions.
- Currency is IDR (Indonesian Rupiah); always use `formatRupiah()` for monetary display.
- Toasts use `sonner` with `position: "top-right"`.
- Path alias: `~/` maps to `app/` (configured in `tsconfig.json`).
- Styling: Tailwind CSS v4 (via `@tailwindcss/vite`). Component variants via `class-variance-authority`. No separate CSS files.
