export interface FinancialHealthComponents {
  savings_rate: number;
  budget_adherence: number;
  goal_progress: number;
}

export interface FinancialHealthResponse {
  score: number;
  rating: "Poor" | "Fair" | "Good" | "Excellent";
  components: FinancialHealthComponents;
  trend: "improving" | "stable" | "declining";
  last_calculated: string;
}

export interface InsightItem {
  type: string;
  title: string;
  description: string;
  status: "success" | "warning" | "info";
}

export interface InsightsResponse {
  insights: InsightItem[];
  period: { month: number; year: number };
  generated_at: string;
}

export interface RecommendationItem {
  priority: "high" | "medium" | "low";
  category: string;
  title: string;
  action: string;
  potential_impact: string;
}

export interface RecommendationsResponse {
  recommendations: RecommendationItem[];
  generated_at: string;
}
