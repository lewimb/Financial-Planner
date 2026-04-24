import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { TransactionForm } from "~/lib/types/transaction";
import { toast } from "sonner";

// const baseApi = process.env.VITE_REACT_BASE_API_URL || "";

export function useGetTransactionById(
  token: string | undefined,
  baseApi: string | undefined,
) {
  return useQuery({
    queryKey: ["transactions"],

    queryFn: async () => {
      if (!token) return null;

      const response = await fetch(`${baseApi}/auth/v1/transactions/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return await response.json();
    },
    enabled: !!token,
    staleTime: Infinity,
  });
}

export function useCreateTransaction(token: string, baseApi: String) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (value: TransactionForm) =>
      fetch(`${baseApi}/auth/v1/transactions`, {
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

export function useDeleteTransaction(
  token: string | undefined,
  baseApi: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      fetch(`${baseApi}/auth/v1/transactions/${id}`, {
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

// export function useUpdateTransaction(token: string) {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (value: Transaction) =>
//       fetch(`${baseApi}/api/v1/transaction/${value.id}`, {
//         method: "PUT",
//         body: JSON.stringify(value),
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-type": "application/json",
//         },
//       }),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["transactions"] });
//       toast.success("Transaction updated successfully", {
//         position: "top-right",
//       });
//     },
//     onError: () => {
//       toast.error("Failed to update transaction", { position: "top-right" });
//     },
//   });
// }
