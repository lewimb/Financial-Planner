import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { TransactionForm } from "~/lib/types/transaction";

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
    mutationFn: (value: TransactionForm) =>
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
    },
  });
}
