import type { ColumnDef } from "@tanstack/react-table";
import { formatRupiah } from "../../../utils/currencyFormatter";
import { ArrowUpRight } from "lucide-react";
import { cn } from "~/lib/utils";

export interface Transaction {
  id: number;
  description: string;
  category: string;
  date: string;
  account: string;
  amount: number;
  type: "income" | "expense";
}

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="font-medium flex items-center gap-2">
        <div
          className={cn(
            "p-3 rounded-full bg-green-200 text-green-600",
            row.getValue("type") === "expense" && "bg-red-200 text-red-600"
          )}
        >
          <ArrowUpRight
            className={cn(
              "size-4",
              row.getValue("type") === "expense" && "rotate-z-90"
            )}
          />
        </div>
        {row.getValue("description")}
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("category")}</div>
    ),
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = row.getValue<string>("date");
      return (
        <div>
          {new Date(date).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "account",
    header: "Account",
    cell: ({ row }) => <div>{row.getValue("account")}</div>,
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue<"income" | "expense">("type");

      return (
        <span
          className={`rounded-full px-2 py-1 text-xs capitalize font-medium
            ${
              type === "income"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }
          `}
        >
          {type}
        </span>
      );
    },
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = row.getValue<number>("amount");

      return (
        <div
          className={`text-right font-medium ${
            row.original.type === "income" ? "text-green-600" : "text-red-600"
          }`}
        >
          {formatRupiah(amount)}
        </div>
      );
    },
  },
];
