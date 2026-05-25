import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { TransactionForm } from "~/lib/types/transaction";
import { toast } from "sonner";
import { getToken } from "~/lib/utils/tokenStore";

export function useGetTransactionById(
  baseApi: string,
  tab: string | undefined,
) {
  const now = new Date();
  const month = tab === "all" ? undefined : now.getMonth() + 1;
  const year = tab === "all" ? undefined : now.getFullYear();

  return useQuery({
    queryKey: ["transactions", tab],
    queryFn: async () => {
      const token = getToken();
      if (!token) return null;

      const params = new URLSearchParams();
      if (month) params.set("month", String(month));
      if (year) params.set("year", String(year));

      const response = await fetch(
        `${baseApi}/auth/v1/transactions?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!response.ok) throw new Error("Network response was not ok");
      return await response.json();
    },
    enabled: !!getToken(),
    staleTime: 1000 * 60 * 2,
  });
}

export function useCreateTransaction(baseApi: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (value: TransactionForm) => {
      const token = getToken();
      return fetch(`${baseApi}/auth/v1/transactions`, {
        method: "POST",
        body: JSON.stringify(value),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": "application/json",
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success("Transaction created", { position: "top-right" });
    },
    onError: () => {
      toast.error("Failed to create transactions", { position: "top-right" });
    },
  });
}

export function useDeleteTransaction(baseApi: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      const token = getToken();
      return fetch(`${baseApi}/auth/v1/transactions/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success("Transaction deleted successfully", {
        position: "top-right",
      });
    },
    onError: () => {
      toast.error("Failed to delete transaction", { position: "top-right" });
    },
  });
}
