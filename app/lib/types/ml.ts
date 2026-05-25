export interface MLAnalysisResponse {
  total_expense: number;
  avg_daily: number;
  top_category: string | null;
  spending_distribution: Record<string, number>;
}

export interface MLAnomalyRecord {
  date: string;
  amount: number;
  severity: "low" | "medium" | "high";
}

export interface MLAnomalyResponse {
  anomalies: MLAnomalyRecord[];
}

export interface MLForecastRecord {
  date: string;
  predicted_amount: number;
}

export interface MLForecastResponse {
  predicted_monthly_spending: number;
  confidence: number;
  trend: "increasing" | "decreasing" | "stable";
  daily_forecast: MLForecastRecord[];
}

export interface MLInsightItem {
  type: string;
  title: string;
  description: string;
  status: "success" | "warning" | "info";
}

export interface MLInsightsResponse {
  insights: MLInsightItem[];
}
