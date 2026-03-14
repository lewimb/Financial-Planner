import type { ColumnDef } from "@tanstack/react-table";
import { formatRupiah } from "../../../utils/currencyFormatter";
import { ArrowUpRight } from "lucide-react";
import { cn } from "~/lib/utils";
import type { Transaction } from "~/lib/types/transaction";
import { Button } from "~/components/ui/button";

function capitalizeFirstWord(value: string) {
  const splittedString = value.split(" ");
  return splittedString
    .map((val) => val.charAt(0).toUpperCase() + val.slice(1))
    .join(" ");
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
            row.getValue("transactionTypes") === "expense" &&
              "bg-red-200 text-red-600",
          )}
        >
          <ArrowUpRight
            className={cn(
              "size-4",
              row.getValue("transactionTypes") === "expense" && "rotate-z-90",
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
    cell: ({ row }) => (
      <div>{capitalizeFirstWord(row.getValue("account"))}</div>
    ),
  },
  {
    accessorKey: "transactionTypes",
    header: "transactionTypes",
    cell: ({ row }) => {
      const transactionTypes = row.getValue<"income" | "expense">(
        "transactionTypes",
      );

      return (
        <span
          className={`rounded-full px-2 py-1 text-xs capitalize font-medium
            ${
              transactionTypes === "income"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }
          `}
        >
          {transactionTypes}
        </span>
      );
    },
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = row.getValue<number>("amount");
      const isIncome = row.original.transactionTypes === "income";

      return (
        <div className="relative flex items-center justify-end overflow-hidden py-4">
          <div
            className={cn(
              "text-right font-medium transition-all duration-300 group-hover:-translate-x-10 group-hover:opacity-0",
              isIncome ? "text-green-600" : "text-red-600",
            )}
          >
            {formatRupiah(amount)}
          </div>

          <div className="absolute right-0 flex translate-x-full items-center gap-2 transition-transform duration-300 group-hover:translate-x-0 ">
            <Button
              variant="outline"
              onClick={() => console.log("Edit", row.original)}
            >
              Edit
            </Button>

            <Button
              variant="destructive"
              onClick={() => console.log("Delete", row.original)}
            >
              Delete
            </Button>
          </div>
        </div>
      );
    },
  },
];
