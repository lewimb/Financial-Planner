import Header from "~/lib/components/shared/Header";
import TransactionOverview from "../../lib/components/section/transaction/TransactionOverview";
import TransactionTable from "~/lib/components/section/transaction/TransactionTable";
import TransactionFormTab from "~/lib/components/section/transaction/TransactionFormTab";
import { Modal } from "~/lib/components/shared/Modal";
import tokenParser from "~/lib/utils/tokenParser";
import type { Route } from "./+types/transactions";
import { useGetTransactionById } from "~/hooks/transactions/use-transaction";
import Loading from "~/lib/components/shared/Loading";
import { addToken } from "~/features/users/userSlice";
import { addUser } from "~/features/users/userSlice";
import { useAppDispatch } from "~/hooks";
import type { Transaction } from "~/lib/types/transaction";

export function loader({ request }: Route.LoaderArgs) {
  return tokenParser(request);
}

export default function Transaction({ loaderData }: Route.ComponentProps) {
  const dispatch = useAppDispatch();
  const { data, isLoading } = useGetTransactionById(
    loaderData?.token,
    loaderData?.payload.userId,
  );

  if (loaderData?.token) {
    dispatch(addToken(loaderData?.token));
    dispatch(addUser(loaderData?.payload));
  }

  if (isLoading || !data) return <Loading />;

  console.log(data);

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
      <TransactionTable totalData={data?.totalData} items={data?.items} />
    </section>
  );
}
