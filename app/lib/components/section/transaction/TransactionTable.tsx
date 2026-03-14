import { DataTable } from "../../shared/DataTable";
import { columns } from "./TransactionColumns";
import type { Transaction } from "~/lib/types/transaction";

interface Response<K> {
  items: K[];
  totalData: number;
}

export default function TransactionTable({
  items,
  totalData,
}: Response<Transaction>) {
  return (
    <div>
      <DataTable columns={columns} data={items} pageSize={totalData} />
    </div>
  );
}
