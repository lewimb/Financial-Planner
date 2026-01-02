import { DataTable } from "../../shared/DataTable";
import { columns } from "./TransactionColumns";
import { transactions } from "~/lib/dummies/transactionDummies";

export default function TransactionTable() {
  return (
    <div>
      <DataTable columns={columns} data={transactions} />
    </div>
  );
}
