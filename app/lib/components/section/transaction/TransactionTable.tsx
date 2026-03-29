import { DataTable } from "../../shared/DataTable";
import { columns } from "./TransactionColumns";
import type { Transaction } from "~/lib/types/transaction";
import type { Response } from "~/lib/types/response";

interface Props {
  deleteMethod: (id: string) => void;
}

export default function TransactionTable({
  deleteMethod,
  items,
  totalData,
}: Props & Response<Transaction>) {
  return (
    <div>
      <DataTable
        deleteMethod={deleteMethod}
        columns={columns}
        data={items}
        pageSize={totalData}
      />
    </div>
  );
}
