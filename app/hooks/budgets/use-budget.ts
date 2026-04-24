import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateBudgetRequest } from "~/lib/types/budgets";
import { toast } from "sonner";

export function useGetBudgetById(
  token: string | undefined,
  userId: number | undefined,
) {
  return useQuery({
    queryKey: ["budget", userId],

    queryFn: async () => {
      if (!token || !userId) return null;

      const response = await fetch(
        `http://localhost:8080/api/v1/budget/${userId}`,
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

export function useCreateBudget({ token }: { token: string }) {
  const queryClient = useQueryClient();

  console.log(token);

  return useMutation({
    mutationFn: (value: CreateBudgetRequest) =>
      fetch("http://localhost:8080/api/v1/budget", {
        method: "POST",
        body: JSON.stringify(value),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": "application/json",
        },
      }),
    onSuccess: (value) => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      console.log(value);
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
