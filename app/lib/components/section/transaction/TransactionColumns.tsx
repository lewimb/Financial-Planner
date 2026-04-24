import type { ColumnDef } from "@tanstack/react-table";
import { formatRupiah } from "../../../utils/currencyFormatter";
import { ArrowUpRight } from "lucide-react";
import { cn } from "~/lib/utils";
import type { Transaction } from "~/lib/types/transaction";
import { Button } from "~/components/ui/button";
import TransactionFormTab from "./TransactionFormTab";
import { Modal } from "../../shared/Modal";

export const getColumns = (token: string): ColumnDef<Transaction>[] => [
  // ✅ function with token
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="font-medium flex items-center gap-2">
        <div
          className={cn(
            "p-3 rounded-full bg-green-200 text-green-600",
            row.getValue("type") === "EXPENSE" && "bg-red-200 text-red-600",
          )}
        >
          <ArrowUpRight
            className={cn(
              "size-4",
              row.getValue("type") === "EXPENSE" && "rotate-z-90",
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
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const transactionTypes = row.getValue<"INCOME" | "EXPENSE">("type");
      return (
        <span
          className={`rounded-full px-2 py-1 text-xs capitalize font-medium
            ${
              transactionTypes === "INCOME"
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
    cell: ({ row, table }) => {
      const amount = row.getValue<number>("amount");
      const isIncome = row.original.type === "INCOME"; // ✅ fixed uppercase
      const meta = table.options.meta;
      const id = row.original.id;

      return (
        <div className="relative flex items-center justify-end overflow-hidden py-4">
          <div
            className={cn(
              "text-right font-medium transition-all duration-300 group-hover:-translate-x-10 group-hover:opacity-0",
              isIncome ? "text-green-600" : "text-red-600",
            )}
          >
            {!isIncome ? "- " : ""}
            {formatRupiah(amount)}
          </div>
          <div className="absolute right-0 flex translate-x-full items-center gap-2 transition-transform duration-300 group-hover:translate-x-0">
            {/* <Modal label="Edit">
              {(close) => (
                <TransactionFormTab
                  key={row.original.id}
                  token={token}
                  dialogTitle="Edit Transaction"
                  items={row.original}
                  isUpdate={true}
                  id={row.original.id}
                  onSuccess={close} // ✅ closes modal only on success
                />
              )}
            </Modal> */}
            <Button
              variant="destructive"
              className="cursor-pointer"
              onClick={() => meta?.deleteMethod(String(id))}
            >
              Delete
            </Button>
          </div>
        </div>
      );
    },
  },
];
