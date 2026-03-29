import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Transaction } from "~/lib/types/transaction";
import { toast } from "sonner";

export function useGetTransactionById(
  token: string | undefined,
  userId: number | undefined,
) {
  return useQuery({
    queryKey: ["transactions", userId],

    queryFn: async () => {
      if (!token || !userId) return null;

      const response = await fetch(
        `http://localhost:8080/api/v1/transaction/filter/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return response.json();
    },
    enabled: !!token && !!userId,
    staleTime: Infinity,
  });
}

export function useCreateTransaction({ token }: { token: string }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (value: Transaction) =>
      fetch("http://localhost:8080/api/v1/transaction", {
        method: "POST",
        body: JSON.stringify(value),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": "application/json",
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success("Transaction created", {
        position: "top-right",
      });
    },
    onError: () => {
      toast.error("Failed to create transactions", {
        position: "top-right",
      });
    },
  });
}

export function useDeleteTransaction(token: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      fetch(`http://localhost:8080/api/v1/transaction/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
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

export function useUpdateTransaction(token: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (value: Transaction) =>
      fetch(`http://localhost:8080/api/v1/transaction/${value.id}`, {
        method: "PUT",
        body: JSON.stringify(value),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": "application/json",
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      toast.success("Transaction updated successfully", {
        position: "top-right",
      });
    },
    onError: () => {
      toast.error("Failed to update transaction", { position: "top-right" });
    },
  });
}
