export interface Goal {
  id: number;
  name: string;
  target_amount: number;
  current_amount: number;
  status: string;
  description: string;
  deadline: string;
  created_at: string;
}

export interface GoalOverview {
  goals: Goal[];
  savings: number;
  total_goals: number;
}
