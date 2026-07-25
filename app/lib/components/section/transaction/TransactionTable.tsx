import { DataTable } from "../../shared/DataTable";
import { getColumns } from "./TransactionColumns";
import type { Transaction } from "~/lib/types/transaction";
import type { Response } from "~/lib/types/response";
import { TRANSACTIONS_PAGE_SIZE } from "~/hooks/transactions/use-transaction";

interface Props {
  deleteMethod: (id: string) => void;
  pageIndex: number;
}

export default function TransactionTable({
  deleteMethod,
  items,
  totalData,
  pageIndex,
}: Props & Response<Transaction>) {
  const columns = getColumns();

  return (
    <div>
      <DataTable
        deleteMethod={deleteMethod}
        columns={columns} // ✅ pass directly, not as function
        data={items}
        pageIndex={pageIndex}
        pageSize={TRANSACTIONS_PAGE_SIZE}
        totalCount={totalData}
      />
    </div>
  );
}
