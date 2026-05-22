import { Form, Link, redirect, useActionData, useNavigation } from "react-router";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { z } from "zod";
import { register } from "~/actions/auth";
import type { Route } from "../+types/root";

const registerSchema = z
  .object({
    name: z.string().min(1, "Name is required").min(2, "Must be at least 2 characters"),
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FieldErrors = Partial<Record<"name" | "email" | "password" | "confirmPassword", string>>;

interface ActionData {
  fieldErrors?: FieldErrors;
  formError?: string;
}

export async function action({ request }: Route.ActionArgs): Promise<ActionData | Response> {
  const baseApi = process.env.API_BASE_URL ?? "";
  const formData = await request.formData();

  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
    confirmPassword: String(formData.get("confirmPassword") ?? ""),
  };

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: FieldErrors = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as keyof FieldErrors;
      if (!fieldErrors[field]) fieldErrors[field] = issue.message;
    }
    return { fieldErrors };
  }

  const { name, email, password } = parsed.data;
  const result = await register({ name, email, password }, baseApi);

  if (result.success) {
    return redirect("/login?registered=1");
  }

  if (result.status === 409) {
    return { fieldErrors: { email: "An account with this email already exists" } };
  }

  if (result.status === 400) {
    return { formError: result.error || "Invalid registration details" };
  }

  return { formError: "Something went wrong. Please try again later." };
}

export default function Register() {
  const actionData = useActionData<typeof action>() as ActionData | undefined;
  const navigation = useNavigation();
  const isPending = navigation.state === "submitting";

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
          <h3 className="text-2xl font-semibold">Create an account</h3>
          <p className="text-xs text-neutral-600">
            Start planning your financial future today.
          </p>
        </div>

        {actionData?.formError && (
          <div
            role="alert"
            className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {actionData.formError}
          </div>
        )}

        <Form className="space-y-4" method="post" noValidate>
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              autoComplete="name"
              aria-invalid={!!actionData?.fieldErrors?.name}
              aria-describedby={actionData?.fieldErrors?.name ? "name-error" : undefined}
              className={cn(actionData?.fieldErrors?.name && "border-red-500")}
            />
            {actionData?.fieldErrors?.name && (
              <p id="name-error" className="text-xs text-red-500">
                {actionData.fieldErrors.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              aria-invalid={!!actionData?.fieldErrors?.email}
              aria-describedby={actionData?.fieldErrors?.email ? "email-error" : undefined}
              className={cn(actionData?.fieldErrors?.email && "border-red-500")}
            />
            {actionData?.fieldErrors?.email && (
              <p id="email-error" className="text-xs text-red-500">
                {actionData.fieldErrors.email}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Min. 8 characters"
              autoComplete="new-password"
              aria-invalid={!!actionData?.fieldErrors?.password}
              aria-describedby={actionData?.fieldErrors?.password ? "password-error" : undefined}
              className={cn(actionData?.fieldErrors?.password && "border-red-500")}
            />
            {actionData?.fieldErrors?.password && (
              <p id="password-error" className="text-xs text-red-500">
                {actionData.fieldErrors.password}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Repeat your password"
              autoComplete="new-password"
              aria-invalid={!!actionData?.fieldErrors?.confirmPassword}
              aria-describedby={
                actionData?.fieldErrors?.confirmPassword ? "confirm-error" : undefined
              }
              className={cn(actionData?.fieldErrors?.confirmPassword && "border-red-500")}
            />
            {actionData?.fieldErrors?.confirmPassword && (
              <p id="confirm-error" className="text-xs text-red-500">
                {actionData.fieldErrors.confirmPassword}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className={cn("w-full", !isPending && "cursor-pointer")}
            disabled={isPending}
          >
            {isPending ? "Creating account..." : "Create account"}
          </Button>
        </Form>

        <p className="text-center text-sm text-neutral-600">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </section>
  );
}
