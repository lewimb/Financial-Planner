"use client";
import { Form, redirect } from "react-router";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import type { Route } from "../+types/root";
import { toast } from "sonner";

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const user = Object.fromEntries(formData);

  try {
    const baseUrl = import.meta.env.VITE_REACT_BASE_API_URL;
    const response = await fetch(`${baseUrl}/v1/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(user),
    });

    // Check if the response is okay before parsing JSON
    if (!response.ok) {
      throw "Wrong Credentials";
    } else {
      toast.success("Login Successful", { position: "top-right" });
    }

    const data = await response.json();
    if (data) {
      return redirect("/auth/");
    }
    // return data;
  } catch (error) {
    toast.error("Wrong Credentials", { position: "top-right" });
    console.error("Network or Parsing Error:", error);
  }
}

export default function Login() {
  return (
    <section className="flex">
      <img
        src="/financial-wallpaper.jpg"
        className="max-h-screen"
        loading="lazy"
        alt=""
      />
      <div className="flex flex-col gap-6 mx-auto justify-center">
        <h3 className="text-2xl">Welcome Back!</h3>
        <p className="text-xs text-neutral-600">
          Sign in to access your dashboard and continue refining your long-term
          wealth strategy.
        </p>
        <Form className="space-y-4" method="post">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="Input email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              name="password"
              placeholder="Input password"
            />
          </div>
          <Button className="w-full cursor-pointer">Login</Button>
        </Form>
      </div>
    </section>
  );
}
