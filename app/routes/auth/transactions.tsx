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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useNavigate, useSearchParams } from "react-router";

export function loader({ request }: Route.LoaderArgs) {
  return tokenParser(request);
}

export async function action({ request }: Route.ActionArgs) {
  const baseApi = process.env.API_BASE_URL || "";
  const { token } = tokenParser(request);

  if (request.method === "POST" || request.method === "PUT") {
    const formData = await request.json();

    try {
      const url =
        request.method === "PUT"
          ? `${baseApi}/auth/v1/transactions/${formData.id}`
          : `${baseApi}/auth/v1/transactions`;

      const response = await fetch(url, {
        method: request.method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
  const deleteTransaction = useDeleteTransaction(loaderData?.token, baseApi);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const activeTab = searchParams.get("tab") ?? "all";
  const { data, isLoading } = useGetTransactionById(
    loaderData?.token,
    baseApi,
    activeTab,
  );

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
              onSuccess={close}
            />
          )}
        </Modal>
      </Header>
      <TransactionOverview items={data?.data} />
      <Tabs
        value={activeTab}
        onValueChange={(value) => navigate(`?tab=${value}`)}
        className="w-125"
      >
        <TabsList className="space-x-2">
          <TabsTrigger className="cursor-pointer" value="all">
            All
          </TabsTrigger>
          <TabsTrigger className="cursor-pointer" value="monthly">
            Monthly
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <TransactionTable
        deleteMethod={handleDelete}
        totalData={data?.total ?? 0}
        items={data?.data ?? []}
      />
    </section>
  );
}
