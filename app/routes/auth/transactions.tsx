import Header from "~/lib/components/shared/Header";
import TransactionOverview from "../../lib/components/section/transaction/TransactionOverview";
import TransactionTable from "~/lib/components/section/transaction/TransactionTable";
import TransactionFormTab from "~/lib/components/section/transaction/TransactionFormTab";
import { Modal } from "~/lib/components/shared/Modal";
import tokenParser from "~/lib/utils/tokenParser";
import type { Route } from "./+types/transactions";
import { useGetTransactionById } from "~/hooks/transactions/use-transaction";
import Loading from "~/lib/components/shared/Loading";
import { useAppDispatch } from "~/hooks";
import type { Transaction } from "~/lib/types/transaction";
import { addToken, addUser } from "~/features/users/userSlice";
import {
  useDeleteTransaction,
  useUpdateTransaction,
} from "~/hooks/transactions/use-transaction";
import type { Auth } from "~/lib/types/auth";

export function loader({ request }: Route.LoaderArgs) {
  return tokenParser(request);
}

export default function Transaction({ loaderData }: Route.ComponentProps) {
  const dispatch = useAppDispatch();
  const { data, isLoading } = useGetTransactionById(
    loaderData?.token,
    loaderData?.payload.userId,
  );

  dispatch(addToken(loaderData?.token ? loaderData?.token : ""));
  dispatch(addUser(loaderData?.payload ? loaderData?.payload : ({} as Auth)));

  const deleteTransaction = useDeleteTransaction(loaderData?.token);

  if (isLoading) return <Loading />;

  const handleDelete = async (id: string) => {
    if (loaderData?.payload.userId) {
      await deleteTransaction.mutateAsync(id);
    }
  };

  return (
    <section className="space-y-6">
      <Header
        title="Transactions"
        subtitle="Track and manage your income and expenses"
      >
        <Modal label="+ Add Transaction">
          <TransactionFormTab />
        </Modal>
      </Header>
      <TransactionOverview items={data?.items} />
      <TransactionTable
        deleteMethod={handleDelete}
        totalData={data?.totalData}
        items={data?.items}
      />
    </section>
  );
}
