import Header from "~/lib/components/shared/Header";
import TransactionOverview from "../../lib/components/section/transaction/TransactionOverview";
import TransactionTable from "~/lib/components/section/transaction/TransactionTable";
import TransactionFormTab from "~/lib/components/section/transaction/TransactionFormTab";
import { Modal } from "~/lib/components/shared/Modal";
import tokenParser from "~/lib/utils/tokenParser";
import type { Route } from "./+types/transactions";
import {
  useGetTransactionById,
  useDeleteTransaction,
} from "~/hooks/transactions/use-transaction";
import Loading from "~/lib/components/shared/Loading";

export function loader({ request }: Route.LoaderArgs) {
  return tokenParser(request);
}

export async function action({ request }: Route.ActionArgs) {
  const baseApi = process.env.VITE_REACT_BASE_API_URL || "";

  if (request.method === "POST" || request.method === "PATCH") {
    const formData = await request.json();
    const token = formData.token; // ✅ get token from body since headers won't have it

    try {
      const url =
        request.method === "PATCH"
          ? `${baseApi}/auth/v1/transactions/${formData.id}` // ✅ fixed url path
          : `${baseApi}/auth/v1/transactions`;

      const response = await fetch(url, {
        method: request.method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ proper Bearer format
        },
        body: JSON.stringify({
          amount: formData.amount,
          description: formData.description,
          category: formData.category,
          date: formData.date,
          type: formData.type,
          userId: formData.userId,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        return new Response(JSON.stringify({ success: false, error }), {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        });
      }

      const data = await response.json();
      return { success: true, data }; // ✅ plain object
    } catch (error) {
      return new Response(
        JSON.stringify({
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }
  }

  return new Response(
    JSON.stringify({ success: false, error: "Method not allowed" }),
    {
      status: 405,
      headers: { "Content-Type": "application/json" },
    },
  );
}

export default function Transaction({ loaderData }: Route.ComponentProps) {
  const baseApi = import.meta.env.VITE_REACT_BASE_API_URL || "";
  const { data, isLoading } = useGetTransactionById(loaderData?.token, baseApi);
  const deleteTransaction = useDeleteTransaction(loaderData?.token, baseApi);

  if (isLoading || !data) return <Loading />;

  const handleDelete = async (id: string) => {
    if (id) {
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
          {(close) => (
            <TransactionFormTab
              token={loaderData?.token}
              onSuccess={close} // ✅ closes modal only on success
            />
          )}
        </Modal>
      </Header>
      <TransactionOverview items={data?.data} />
      <TransactionTable
        token={loaderData?.token} // ✅ pass token to table for delete actions
        deleteMethod={handleDelete}
        totalData={data?.total ?? 0}
        items={data?.data ?? []}
      />
    </section>
  );
}
