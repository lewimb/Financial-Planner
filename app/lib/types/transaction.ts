import z from "zod";

export interface Transaction {
  id?: number;
  userId?: number | undefined;
  amount?: number;
  transactionTypes?: string;
  description?: string;
  type?: string;
  category?: string;
  account?: string;
  date?: Date;
  updatedAt?: Date;
  createdAt?: Date;
}

export interface TransactionForm {
  id: number | undefined;
  amount: number;
  type: string;
  description: string;
  account: string;
  category: string;
  date: Date;
}

export const formSchema = z.object({
  amount: z.string().min(1, {
    message: "Amount is required",
  }),
  description: z.string().min(1, { message: "Description is required" }),
  category: z.string().min(1, { message: "Category is required" }),
  date: z.date().min(1, { message: "Date is required" }),
  account: z.string().min(1, { message: "Account is required" }),
  type: z.string().min(1, { message: "Transaction types is required" }),
});
