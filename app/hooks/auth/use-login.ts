import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function useLogin() {
  return useMutation({
    mutationFn: (value) =>
      fetch("http://localhost:8080/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(value),
      }),
    onSuccess: () => {
      toast.success("Login Successful", { position: "top-right" });
    },
    onError: (err) => {
      toast.error(err.message ? err.message : "Wrong credentials", {
        position: "top-right",
      });
    },
  });
}
