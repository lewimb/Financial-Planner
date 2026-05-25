export interface IncomeExpenseTrendPoint {
  month: number;
  month_name: string;
  income: number;
  expense: number;
  savings: number;
}

export interface IncomeExpenseTrendResponse {
  year: number;
  data: IncomeExpenseTrendPoint[];
}

export interface NetWorthHistoryPoint {
  month: number;
  month_name: string;
  net_worth: number;
}

export interface NetWorthHistoryResponse {
  year: number;
  data: NetWorthHistoryPoint[];
}

export interface SavingsRateHistoryPoint {
  month: number;
  month_name: string;
  income: number;
  expense: number;
  rate: number;
}

export interface SavingsRateHistoryResponse {
  year: number;
  data: SavingsRateHistoryPoint[];
}

export interface MonthComparisonPeriod {
  month: number;
  year: number;
  income: number;
  expense: number;
  savings: number;
}

export interface MonthComparisonV2Response {
  current: MonthComparisonPeriod;
  previous: MonthComparisonPeriod;
  changes: {
    income_pct: number;
    expense_pct: number;
    savings_pct: number;
  };
}

export interface CategoryBreakdownItem {
  category: string;
  label: string;
  total: number;
  percentage: number;
  transaction_count: number;
}

export interface CategoryBreakdownResponse {
  period: { month: number; year: number };
  total_expense: number;
  data: CategoryBreakdownItem[];
}
