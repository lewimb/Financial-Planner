export interface FinancialProfile {
  monthly_income: number;
  fixed_expenses: number;
  current_savings: number;
  debt: number;
  employment_status: string;
  financial_goals: string[];
  spending_habit: string | null;
  risk_level: string | null;
  net_available: number;
  created_at: string;
  updated_at: string;
}
