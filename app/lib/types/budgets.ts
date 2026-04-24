import { ca } from "date-fns/locale";
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
  month: number;
  year: number;
  limitAmount: number;
  alertThreshold: string;
}

export const formSchema = z
  .object({
    category: z.string().min(1, { message: "Category is required" }),
    period: z.string().min(1, { message: "Period is required" }),
    month: z.string().refine((value) => !isNaN(Number(value)), {
      message: "Input must not be a valid number",
    }),
    year: z.string().superRefine((value, ctx) => {
      const yearNum = Number(value);

      // 1. Check if it's actually a valid number
      if (isNaN(yearNum)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Input should be a number",
        });
        return; // Stop here if it's not a number
      }

      // 2. Range Validation
      const currentYear = new Date().getFullYear();
      const minYear = 1900;

      if (yearNum < minYear) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Year must be after ${minYear}`,
        });
      }

      if (yearNum > currentYear) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Year cannot be in the future",
        });
      }
    }),
    limitAmount: z.string().min(1, "Amount is required"),
    alertThreshold: z.string().min(1, "Threshold is required"),
  })
  .superRefine((data, ctx) => {
    const amt = Number(data.limitAmount);
    const threshold = Number(data.alertThreshold);

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
