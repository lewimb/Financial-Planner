# Frontend Production Readiness — Batch 1 (Critical + High)

**Date:** 2026-05-20  
**Branch:** feat/budgets-integration  
**Scope:** Critical + High priority items from `/docs/frontend-improvement-notes.md`  
**Strategy:** Option B — TokenContext + full data wiring

---

## Goal

Transform the financial planning frontend from MVP-with-mock-data to a production-ready application by:
1. Replacing all hardcoded/fabricated data with real API data
2. Adding `TokenContext` to eliminate prop drilling
3. Adding error boundaries so API failures never white-screen the app
4. Completing transaction edit + safe delete confirmation
5. Persisting AI Coach chat history
6. Adding loading skeletons on every data-fetching page
7. Restoring all Reports tabs
8. Wiring real user identity into the sidebar
9. Wiring `FinancialHealth` and `GoalsOverview` to live API data
10. Surfacing anomaly detection on the dashboard

---

## Architecture

### 1. TokenContext

**New file:** `app/lib/context/token-context.tsx`

```ts
interface TokenContextValue {
  token: string;
  user: { name: string; email: string };
}
const TokenContext = createContext<TokenContextValue | null>(null);
export function useToken(): TokenContextValue { ... } // throws if used outside provider
```

**Change:** `auth/layout.tsx` loader decodes `name` and `email` from the JWT payload (already parsed by `tokenParser`). The `Auth` type (`app/lib/types/auth.ts`) gains optional `name?: string` and `email?: string` fields — populated if the JWT contains them, else falls back to empty strings.

> Note: The JWT payload shape is controlled by the backend. If `name`/`email` are not in the JWT, they will be empty strings and the sidebar will fall back to "Account". The backend's `/api/v1/users` endpoint lists all users (no auth required) and is not appropriate for fetching a single user's profile. JWT payload decoding is the correct approach.

`auth/layout.tsx` wraps `<Outlet />` in `<TokenContext.Provider value={{ token, user }}>`.

**Migration:** Remove `token` prop from `TransactionTable`, `TransactionColumns`, `TransactionFormTab`, `TransactionExpenseForm`, `TransactionIncomeForm`. Each uses `useToken()` directly.

---

### 2. Auth Type Extension

**File:** `app/lib/types/auth.ts`

Add to `Auth` interface:
```ts
name?: string;
email?: string;
```

---

### 3. Dashboard 6-Month History

**New function:** `GetMonthlyHistory(token: string): Promise<MonthlyHistoryItem[]>` added to `app/actions/transactions.ts`

Logic: Iterate last 6 months from `now`. For each month, call `GET /api/auth/v1/transactions?month=M&year=Y&limit=0`. Sum INCOME and EXPENSE amounts from the response array. Return `{ month: "Jan", income: number, expense: number }[]`. All 6 fetches run in `Promise.all`.

**Type:** New `MonthlyHistoryItem` in `app/lib/types/transaction.ts`:
```ts
interface MonthlyHistoryItem { month: string; income: number; expense: number; }
```

**Dashboard loader change:** Add `GetMonthlyHistory(token)` to the parallel `Promise.all` in `dashboard.tsx`. Pass result as `monthlyHistory` to `DashboardAnalytics` → `DashboardGraph`.

---

### 4. DashboardResponse Type Extension

**File:** `app/lib/types/dashboard.ts`

Add:
```ts
financial_health: {
  score: number;
  savings_rate: number;
  budget_adherence: number;
  goal_progress: number;
  label: "Excellent" | "Good" | "Fair" | "Needs Attention";
} | null;
has_anomalies: boolean;
```

---

## Page-by-Page Changes

### Dashboard (`app/routes/auth/dashboard.tsx`)

**Loader additions:**
- Fetch `GetMonthlyHistory(token)` in parallel with existing dashboard call
- Pass `monthlyHistory` and `budget_usage` (from `GetUsageBudgets`) and `financial_health` and `has_anomalies` to the component

**Component additions:**
- If `has_anomalies === true`: render amber `AlertBanner` above `DashboardOverview`
  - Text: "One or more budgets are exceeded. Review your budgets."
  - Link: `/auth/budgets`

**`DashboardAnalytics`**: receives `budgetUsage: BudgetUsageResponse[]` and `monthlyHistory: MonthlyHistoryItem[]` props.

**`DashboardGraph`**: 
- Prop: `data: MonthlyHistoryItem[]`
- Renders real 6-bar chart from prop data
- If `data.length === 0`: renders `EmptyState` ("No transaction history yet. Add transactions to see your spending trends.")
- Removes hardcoded `chartData` array

**`DashboardBudgetOverview`**:
- Prop: `items: BudgetUsageResponse[]`
- Renders top 4 items sorted by `percentage` descending
- Links "View all" to `/auth/budgets`
- If `items.length === 0`: renders "No budgets yet" message
- Removes hardcoded `budgetData` array

**Skeleton:** `DashboardOverview` and `DashboardAnalytics` render `animate-pulse` card placeholders when `loaderData` is `null`.

---

### AppSidebar (`app/lib/components/AppSidebar.tsx`)

- Import `useToken()`
- Replace hardcoded `"John Doe"` / `"johndoe@email.com"` with `user.name` / `user.email` from context
- Avatar: show first letter of `user.name` in a `<span>` inside a styled `<div>` instead of the hardcoded image URL
- Fallback: if `user.name` is empty, show "Account"

---

### Transactions (`app/routes/auth/transactions.tsx` + columns)

**`ConfirmDeleteDialog`** — new shared component: `app/lib/components/shared/ConfirmDeleteDialog.tsx`
```tsx
interface Props {
  title: string;
  description: string;
  onConfirm: () => void;
  loading?: boolean;
}
```
Uses Radix UI `AlertDialog` (already available via shadcn/ui). Renders "Cancel" and "Delete" buttons. Delete button shows spinner when `loading`.

**`TransactionColumns`**:
- Replace hover-only delete button with a `DropdownMenu` (`...` icon button — always visible, keyboard-focusable)
- Dropdown items: "Edit", "Delete"
- Delete item: opens `ConfirmDeleteDialog`
- Edit item: opens `Modal` with `TransactionForm` in edit mode (uncommented)
- Add `aria-label="Transaction actions"` to the `...` trigger button

**`TransactionForm`** — unified component replacing `TransactionExpenseForm` and `TransactionIncomeForm`:
- Prop: `type: "INCOME" | "EXPENSE"` (determines form field defaults)
- Prop: `initialValues?: Transaction` (for edit mode)
- Prop: `isUpdate?: boolean`
- Prop: `id?: number`
- Prop: `onSuccess: () => void`
- Uses `useToken()` for token — no prop drilling
- Single TanStack Form instance with fields: `amount`, `description`, `category`, `date`, `type`
- For edit: pre-fills from `initialValues`

**`TransactionFormTab`**: passes `type` prop to unified `TransactionForm` instead of rendering two separate components.

**`DataTable`**: 
- Add `defaultPageSize?: number` prop (default: 10)
- Replace hardcoded `pageSize: 10` with `defaultPageSize`

---

### AI Coach (`app/routes/auth/ai-coach.tsx` + components)

**Route loader addition:** Fetch `GET /api/auth/v1/dashboard` and `GET /api/auth/v1/ml/insights` in parallel. Both wrapped in `try/catch` returning `null` on failure (503 / network). Return `{ token, financial_health, insights }`. Pass props down to `FinancialHealth` and `FinancialKeyInsights`.

**`FinancialHealth`** (`app/lib/components/section/ai-coach/FinancialHealth.tsx`):
- Prop: `health: FinancialHealthData | null` (type renamed from `FinancialHealth` to `FinancialHealthData` to avoid conflict with component name)
- Remove hardcoded `financial_health` object
- If `health` is null: render 3 skeleton rows
- Badge variant map: `Excellent`→`"default"` (green), `Good`→`"secondary"` (blue), `Fair`→`"outline"` (yellow), `Needs Attention`→`"destructive"` (red)
- Display: score/100, label badge, savings_rate %, budget_adherence %, goal_progress %

**`FinancialKeyInsights`** (`app/lib/components/section/ai-coach/FinancialKeyInsights.tsx`):
- Prop: `insights: MLInsightsResponse | null`
- Remove hardcoded `keyInsights` array
- Derive insight cards from `insights`:
  - If `insights.top_category`: render "Top spending: {category}" card (info status)
  - If `insights.spike_category`: render "Spending spike in {category}" card (warning status)
  - If `Object.keys(insights.category_breakdown).length > 0`: render "Your biggest category is {top_category} at {pct}%" (success/info)
- If `insights` is null OR all fields are empty: render "Insights unavailable — add more transactions for ML analysis"
- Keep the same visual card design (icon + title + description)

**`Chatbot.tsx`** (file name; exports `ChatInterface`):
- On mount: read `sessionStorage.getItem('chat_messages')` and parse JSON. If valid array, restore as initial `messages` state. Key: `'chat_messages'` (no user-ID scoping needed since JWT cookie is per-user and sessionStorage is per-tab).
- On every message added: serialize `messages` to `sessionStorage.setItem('chat_messages', JSON.stringify(messages))`.
- Cap: if messages exceed 50, drop oldest messages (index 1 onward, keeping index 0 which is the system greeting).
- Add "Clear conversation" button (trash icon, `size-4`) in the chat header. Clears `messages` state and `sessionStorage`.
- Typing indicator: when fetch is in-flight, append `{ role: "assistant", content: "__typing__" }` to the messages array. The message renderer checks `content === "__typing__"` and renders 3 animated dots (`●●●` with CSS animation) instead of text.
- Input and Send button `disabled` while fetch is in-flight.
- Send button has `aria-label="Send message"`.
- Remove `token` prop from `ChatInterface` — use `useToken()` instead.

---

### Goals (`app/routes/auth/goals.tsx` + GoalsOverview)

**Goals loader:** `GoalOverviewResponse` from `/api/auth/v1/goals/overview` already contains `completed_this_year`. This is already returned by the loader.

**`GoalsOverview`**:
- Add prop: `completed_this_year: number`
- Replace hardcoded subtitle `"2 completed this year"` with `` `${completed_this_year} completed this year` ``
- Type update: `interface Props { total_goals: number; savings: number; completed_this_year: number; }`

**Goals route:** Pass `completed_this_year` from loader data to `GoalsOverview`.

---

### Reports (`app/routes/auth/reports.tsx` + ReportsTab)

**`ReportsTab`**: Restore all tabs:
```
ML Insights | Overview | Categories | Trends
```
- `ML Insights`: existing `MLInsightsPanel` (unchanged)
- `Overview`: `ReportsNetWorth` + `ReportsMonthComparison` components (already exist in file system)
- `Categories`: `ReportsCategoriesPie` + `ReportsSavingRate` (already exist)
- `Trends`: `ReportsTrendsMetric` (already exists)

Each tab content is wrapped in `<React.Suspense fallback={<TabSkeleton />}>`.

**Savings rate badge** in `ReportsOverview`: Calculate `savingsRate = ((monthly_income - monthly_expense) / monthly_income) * 100`. Add colored `Badge` next to the value:
- `>20%` → green + "Excellent"
- `10-20%` → blue + "Good"  
- `5-10%` → yellow + "Fair"
- `<5%` → red + "Needs Attention"

---

### Error Boundaries

**`auth/layout.tsx`**: Export `ErrorBoundary` component:
```tsx
export function ErrorBoundary() {
  const error = useRouteError();
  return <ErrorPage error={error} />;
}
```

**New shared component:** `app/lib/components/shared/ErrorCard.tsx`
```tsx
interface Props { message: string; onRetry?: () => void; }
```
Renders an inline error card with an alert icon, message, and optional "Try again" button.

**New shared component:** `app/lib/components/shared/ErrorPage.tsx`
Full-page error display with "Return to Dashboard" button. Used by auth layout boundary.

**Section-level boundaries:** `dashboard.tsx`, `transactions.tsx`, `budgets.tsx`, `goals.tsx` each export:
```tsx
export function ErrorBoundary() {
  const error = useRouteError();
  return <ErrorCard message={getErrorMessage(error)} />;
}
```

---

### Loading Skeletons

**New components (co-located with their feature):**
- `app/lib/components/section/budget/BudgetCategoriesSkeleton.tsx` — 4 skeleton budget cards
- `app/lib/components/section/goals/GoalsListSkeleton.tsx` — 3 skeleton goal cards
- `app/lib/components/section/reports/ReportsOverviewSkeleton.tsx` — 4 skeleton metric cards
- `app/lib/components/section/transaction/TransactionTableSkeleton.tsx` — 5 skeleton table rows

Each skeleton uses `Skeleton` from `~/components/ui/skeleton` with `animate-pulse`.

**Usage:** In each page component, check `isLoading` from TanStack Query (or null loaderData for SSR) and render the skeleton instead of the real component.

---

## New Files Summary

| File | Purpose |
|------|---------|
| `app/lib/context/token-context.tsx` | TokenContext + useToken hook |
| `app/lib/components/shared/ConfirmDeleteDialog.tsx` | Reusable delete confirmation dialog |
| `app/lib/components/shared/ErrorCard.tsx` | Inline section error display |
| `app/lib/components/shared/ErrorPage.tsx` | Full-page error boundary display |
| `app/lib/components/section/transaction/TransactionForm.tsx` | Unified create/edit form (replaces 2 components) |
| `app/lib/components/section/budget/BudgetCategoriesSkeleton.tsx` | Skeleton for budget grid |
| `app/lib/components/section/goals/GoalsListSkeleton.tsx` | Skeleton for goals list |
| `app/lib/components/section/reports/ReportsOverviewSkeleton.tsx` | Skeleton for reports cards |
| `app/lib/components/section/transaction/TransactionTableSkeleton.tsx` | Skeleton for table rows |

---

## Modified Files Summary

| File | Change |
|------|--------|
| `app/lib/types/auth.ts` | Add `name?`, `email?` |
| `app/lib/types/dashboard.ts` | Add `financial_health`, `has_anomalies` |
| `app/lib/types/transaction.ts` | Add `MonthlyHistoryItem` type |
| `app/routes/auth/layout.tsx` | Add TokenContext, extend loader to extract user |
| `app/lib/components/AppSidebar.tsx` | Use `useToken()`, real user name/email/avatar |
| `app/actions/transactions.ts` | Add `GetMonthlyHistory()` |
| `app/routes/auth/dashboard.tsx` | Extend loader, pass props to DashboardAnalytics |
| `app/lib/components/section/dashboard/DashboardAnalytics.tsx` | Accept real data props |
| `app/lib/components/section/dashboard/DashboardGraph.tsx` | Replace mock data with prop |
| `app/lib/components/section/dashboard/DashboardBudgetOverview.tsx` | Replace mock data with prop |
| `app/routes/auth/ai-coach.tsx` | Add dashboard fetch to loader |
| `app/lib/components/section/ai-coach/FinancialHealth.tsx` | Accept `health` prop, remove hardcoded data |
| `app/lib/components/section/ai-coach/Chatbot.tsx` (exports `ChatInterface`) | sessionStorage, typing indicator, clear button, useToken() |
| `app/lib/components/section/ai-coach/FinancialKeyInsights.tsx` | Accept `insights` prop, remove hardcoded array |
| `app/routes/auth/goals.tsx` | Pass `completed_this_year` to GoalsOverview |
| `app/lib/components/section/goals/GoalsOverview.tsx` | Add `completed_this_year` prop |
| `app/routes/auth/reports.tsx` | (no change needed) |
| `app/lib/components/section/reports/ReportsTab.tsx` | Restore all 4 tabs |
| `app/lib/components/section/reports/ReportsOverview.tsx` | Add savings rate badge |
| `app/lib/components/section/transaction/TransactionColumns.tsx` | DropdownMenu, ConfirmDeleteDialog, edit |
| `app/lib/components/section/transaction/TransactionFormTab.tsx` | Use unified TransactionForm |
| `app/lib/components/section/transaction/TransactionExpenseForm.tsx` | Delete (replaced by TransactionForm) |
| `app/lib/components/section/transaction/TransactionIncomeForm.tsx` | Delete (replaced by TransactionForm) |
| `app/lib/components/shared/DataTable.tsx` | Add `defaultPageSize` prop |
| `app/routes/auth/dashboard.tsx` | Export `ErrorBoundary` |
| `app/routes/auth/transactions.tsx` | Export `ErrorBoundary`, remove token prop pass |
| `app/routes/auth/budgets.tsx` | Export `ErrorBoundary` |
| `app/routes/auth/goals.tsx` | Export `ErrorBoundary` |
| `app/routes/auth/layout.tsx` | Export `ErrorBoundary` |
| `app/routes/auth/budgets.tsx` | Add `BudgetCategoriesSkeleton` usage |
| `app/routes/auth/goals.tsx` | Add `GoalsListSkeleton` usage |

---

## Out of Scope (Batch 2)

- Mobile responsiveness improvements
- Accessibility audit fixes (aria-labels, fieldset/legend, contrast)
- Onboarding step persistence (sessionStorage for Step 1)
- Forms — unsaved changes warning (useBlocker)
- Budget form alert threshold help text
- URL pagination sync (`?tab=monthly&page=3`)
- Transaction CSV export
- Dark mode
- Keyboard shortcuts
- Notification system
- Recurring transaction UI (field exists in OpenAPI but no UI)

---

## Constraints

- No new npm packages. All patterns use existing dependencies (Radix UI AlertDialog for ConfirmDeleteDialog, existing `Skeleton` component, existing TanStack Query).
- No breaking changes to existing working flows (budget CRUD, goal CRUD, onboarding).
- The `TransactionExpenseForm` and `TransactionIncomeForm` deletions happen only after `TransactionForm` is fully working and the tests (manual) pass.
- The JWT payload may not contain `name`/`email` depending on backend implementation. Sidebar falls back to "Account" / empty email if not present — no error thrown.
