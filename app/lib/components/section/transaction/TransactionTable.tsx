import { DataTable } from "../../shared/DataTable";
import { getColumns } from "./TransactionColumns";
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
  const columns = getColumns();

  return (
    <div>
      <DataTable
        deleteMethod={deleteMethod}
        columns={columns} // ✅ pass directly, not as function
        data={items}
        pageSize={totalData}
      />
    </div>
  );
}
