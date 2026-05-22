import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { setToken } from "~/lib/utils/tokenStore";

export function useLogin() {
  return useMutation({
    mutationFn: async (value) => {
      const res = await fetch("http://localhost:8080/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(value),
      });
      const json = await res.json();
      if (json?.data?.token) {
        setToken(json.data.token);
      }
      return json;
    },
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
