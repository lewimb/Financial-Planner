import Header from "~/lib/components/shared/Header";
import TransactionOverview from "../../lib/components/section/transaction/TransactionOverview";
import TransactionTable from "~/lib/components/section/transaction/TransactionTable";
import TransactionFormTab from "~/lib/components/section/transaction/TransactionFormTab";
import { Modal } from "~/lib/components/shared/Modal";
import { redirect } from "react-router";
import type { Route } from "./+types/transactions";
import {
  useGetTransactionById,
  useDeleteTransaction,
} from "~/hooks/transactions/use-transaction";
import Loading from "~/lib/components/shared/Loading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useNavigate, useSearchParams } from "react-router";
import { getToken } from "~/lib/utils/tokenStore";
import { useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import { Download, Upload } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";

export function clientLoader(_: Route.ClientLoaderArgs) {
  if (!getToken()) throw redirect("/login");
  return null;
}

export async function clientAction({ request }: Route.ClientActionArgs) {
  const token = getToken();
  const baseApi = import.meta.env.VITE_REACT_BASE_API_URL || "";

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

      if (response.status === 401) throw redirect("/login");

      if (!response.ok) {
        const error = await response.text();
        return new Response(JSON.stringify({ success: false, error }), {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        });
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      if (error instanceof Response) throw error;
      return new Response(
        JSON.stringify({
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }
  }

  return new Response(
    JSON.stringify({ success: false, error: "Method not allowed" }),
    { status: 405, headers: { "Content-Type": "application/json" } },
  );
}

export default function Transaction() {
  const baseApi = import.meta.env.VITE_REACT_BASE_API_URL || "";
  const deleteTransaction = useDeleteTransaction(baseApi);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [importOpen, setImportOpen] = useState(false);
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeTab = searchParams.get("tab") ?? "all";
  const { data, isLoading } = useGetTransactionById(baseApi, activeTab);

  if (isLoading || !data) return <Loading />;

  const handleDelete = async (id: string) => {
    if (id) await deleteTransaction.mutateAsync(id);
  };

  const now = new Date();
  const exportMonth = activeTab === "monthly" ? now.getMonth() + 1 : undefined;
  const exportYear = now.getFullYear();

  async function handleExport() {
    const token = getToken();
    const params = new URLSearchParams({ year: String(exportYear) });
    if (exportMonth) params.set("month", String(exportMonth));
    const res = await fetch(
      `${baseApi}/auth/v1/transactions/export?${params.toString()}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!res.ok) { toast.error("Export failed"); return; }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions-${exportYear}${exportMonth ? `-${exportMonth}` : ""}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    let parsed: unknown;
    try {
      parsed = JSON.parse(await file.text());
    } catch {
      toast.error("Invalid JSON file");
      return;
    }
    if (!Array.isArray(parsed)) { toast.error("File must contain a JSON array"); return; }
    setImporting(true);
    try {
      const token = getToken();
      const res = await fetch(`${baseApi}/auth/v1/transactions/import`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(parsed),
      });
      const body = await res.json();
      if (!res.ok) { toast.error(body?.message ?? "Import failed"); return; }
      const { imported, failed } = body.data ?? {};
      toast.success(`Imported ${imported ?? 0} transactions${failed ? `, ${failed} failed` : ""}`, { position: "top-right" });
      setImportOpen(false);
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <section className="space-y-6">
      <Header
        title="Transactions"
        subtitle="Track and manage your income and expenses"
      >
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExport} className="gap-1.5">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={() => setImportOpen(true)} className="gap-1.5">
            <Upload className="h-4 w-4" />
            Import
          </Button>
          <Modal label="+ Add Transaction">
            {(close) => (
              <TransactionFormTab onSuccess={close} />
            )}
          </Modal>
        </div>
      </Header>

      <Dialog open={importOpen} onOpenChange={setImportOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Transactions</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <p className="text-sm text-muted-foreground">
              Upload a JSON file containing an array of transactions. Each item needs:{" "}
              <code className="text-xs bg-muted px-1 rounded">amount, category, type (INCOME/EXPENSE), date (YYYY-MM-DD)</code>.
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleImportFile}
              className="block w-full text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-muted file:text-sm cursor-pointer"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setImportOpen(false)} disabled={importing}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
