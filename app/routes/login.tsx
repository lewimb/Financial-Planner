import { useEffect } from "react";
import { Form, Link, redirect, useNavigation, useSearchParams } from "react-router";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import type { Route } from "../+types/root";
import { toast } from "sonner";
import { cn } from "~/lib/utils";
import { setToken } from "~/lib/utils/tokenStore";

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const user = Object.fromEntries(formData);

  try {
    const baseUrl = import.meta.env.VITE_REACT_BASE_API_URL;
    const response = await fetch(`${baseUrl}/v1/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      toast.error("Wrong credentials", { position: "top-right" });
      return null;
    }

    const data = await response.json();
    if (data?.data?.token) {
      setToken(data.data.token);
    }
    if (data) {
      toast.success("Login successful", { position: "top-right" });
      return redirect("/auth/");
    }
  } catch {
    toast.error("Network error. Please try again.", { position: "top-right" });
  }
  return null;
}

export default function Login() {
  const navigation = useNavigation();
  const isLoading = navigation.state === "submitting";
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("registered") === "1") {
      toast.success("Account created! You can now sign in.", {
        position: "top-right",
      });
    }
  }, []);

  return (
    <section className="flex min-h-screen">
      <img
        src="/financial-wallpaper.jpg"
        className="max-h-screen object-cover hidden lg:block"
        loading="lazy"
        alt=""
      />
      <div className="flex flex-col gap-6 mx-auto justify-center px-8 w-full max-w-md">
        <div className="space-y-1">
          <h3 className="text-2xl font-semibold">Welcome Back!</h3>
          <p className="text-xs text-neutral-600">
            Sign in to access your dashboard and continue refining your
            long-term wealth strategy.
          </p>
        </div>

        <Form className="space-y-4" method="post">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              name="password"
              placeholder="Your password"
              autoComplete="current-password"
            />
          </div>
          <Button
            className={cn("w-full", !isLoading && "cursor-pointer")}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </Form>

        <p className="text-center text-sm text-neutral-600">
          Don't have an account?{" "}
          <Link to="/register" className="font-medium text-primary hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </section>
  );
}
