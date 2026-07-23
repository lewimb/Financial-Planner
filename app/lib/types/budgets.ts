import z from "zod";

export const Category = {
  // Expense
  HOUSING: "HOUSING",
  FOOD: "FOOD",
  TRANSPORTATION: "TRANSPORTATION",
  UTILITIES: "UTILITIES",
  ENTERTAINMENT: "ENTERTAINMENT",
  HEALTH: "HEALTH",
  EDUCATION: "EDUCATION",
  SHOPPING: "SHOPPING",
  SUBSCRIPTIONS: "SUBSCRIPTIONS",
  PERSONAL: "PERSONAL",
  TRAVEL: "TRAVEL",
  MISC: "MISC",

  // Income
  SALARY: "SALARY",
  BUSINESS: "BUSINESS",
  FREELANCE: "FREELANCE",
  INVESTMENT: "INVESTMENT",
  BONUS: "BONUS",
  GIFT: "GIFT",
  OTHER_INCOME: "OTHER_INCOME",
} as const;

export type Period = "WEEKLY" | "MONTHLY" | "YEARLY";

export interface CreateBudgetRequest {
  category: string;
  period: string;
  year: number | null;
  limitAmount: number;
  alertThreshold: number;
}

export interface BudgetUsage {
  budget_id: number;
  category: string;
  period: "MONTHLY" | "YEARLY";
  limit: number;
  alert_threshold: number;
  used: number;
  remaining: number;
  percentage: number;
  status: "SAFE" | "WARNING" | "EXCEEDED";
  change_percent: number;
}

export interface UpdateBudgetRequest {
  category: string;
  limitAmount: number;
  alertThreshold: number;
}

export interface UpdateBudgetResponse {
  id: number;
  category: string;
  period: string;
  month: number | null;
  year: number | null;
  limit_amount: number;
  alert_threshold: number;
}

export const formSchema = z
  .object({
    category: z.string().min(1, { message: "Category is required" }),
    period: z.string().min(1, { message: "Period is required" }),
    year: z.string(),
    limitAmount: z.string().min(1, "Amount is required"),
    alertThreshold: z.string().min(1, "Threshold is required"),
  })
  .superRefine((data, ctx) => {
    const amt = Number(data.limitAmount);
    const threshold = Number(data.alertThreshold);

    // 0. Yearly budgets require a real, non-future year; monthly budgets
    // don't use this field at all (they recur every month).
    if (data.period === "YEARLY") {
      const yearNum = Number(data.year);
      const currentYear = new Date().getFullYear();
      if (!data.year || isNaN(yearNum)) {
        ctx.addIssue({
          path: ["year"],
          code: z.ZodIssueCode.custom,
          message: "Year is required for a yearly budget",
        });
      } else if (yearNum < 1900 || yearNum > currentYear) {
        ctx.addIssue({
          path: ["year"],
          code: z.ZodIssueCode.custom,
          message: `Year must be between 1900 and ${currentYear}`,
        });
      }
    }

    // 1. Validate Amount is a number
    if (isNaN(amt) || amt < 0) {
      ctx.addIssue({
        path: ["limitAmount"],
        code: z.ZodIssueCode.custom,
        message: "Amount must be a non-negative number",
      });
    }

    // 2. Validate Threshold is a number/integer
    if (isNaN(threshold) || !Number.isInteger(threshold)) {
      ctx.addIssue({
        path: ["alertThreshold"],
        code: z.ZodIssueCode.custom,
        message: "Alert threshold must be an integer",
      });
    }

    // 3. Logic: Threshold should not exceed Amount
    if (!isNaN(amt) && !isNaN(threshold) && threshold > amt) {
      ctx.addIssue({
        path: ["alertThreshold"],
        code: z.ZodIssueCode.custom,
        message: "Threshold cannot be greater than the total amount",
      });
    }
  });

export type Category = (typeof Category)[keyof typeof Category];
