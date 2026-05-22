import type { Transaction } from "../types/transaction";

export const transactions: Transaction[] = [
  {
    id: 1,
    description: "Salary Deposit",
    category: "Salary",
    date: new Date("2024-06-01"),
    amount: 5420.0,
    type: "INCOME",
  },
  {
    id: 2,
    description: "Whole Foods Market",
    category: "Food & Dining",
    date: new Date("2024-06-03"),
    amount: 85.5,
    type: "EXPENSE",
  },
  {
    id: 3,
    description: "Shell Gas Station",
    category: "Transportation",
    date: new Date("2024-06-05"),
    amount: 45.0,
    type: "EXPENSE",
  },
  {
    id: 4,
    description: "Freelance Design Project",
    category: "Freelance",
    date: new Date("2024-06-07"),
    amount: 850.0,
    type: "INCOME",
  },
  {
    id: 5,
    description: "Netflix Subscription",
    category: "Entertainment",
    date: new Date("2024-06-08"),
    amount: 15.99,
    type: "EXPENSE",
  },
  {
    id: 6,
    description: "Amazon Purchase",
    category: "Shopping",
    date: new Date("2024-06-10"),
    amount: 124.99,
    type: "EXPENSE",
  },
];
