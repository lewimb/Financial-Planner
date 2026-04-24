import z from "zod";

export interface Transaction {
  id?: number;
  userId?: number | undefined;
  amount?: number;
  description?: string;
  type?: string;
  category?: string;
  date?: Date;
  updatedAt?: Date;
  createdAt?: Date;
}

export interface TransactionForm {
  userId: number | undefined;
  amount: number;
  type: string;
  description: string;
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
  type: z.string().min(1, { message: "Transaction types is required" }),
});
