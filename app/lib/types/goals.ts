interface Goal {
  id: number;
  name: string;
  target_amount: number;
  current_amount: number;
  status: string;
  description: string;
  deadline: string; // time.Time comes as ISO string from JSON
  created_at: string;
}

interface GoalOverview {
  goals: Goal[];
  savings: number;
  total_goals: number;
}
