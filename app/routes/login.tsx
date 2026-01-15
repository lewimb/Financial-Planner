import { Field, FieldGroup, FieldLabel, FieldSet } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

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
        <form action="">
          <FieldSet>
            <FieldGroup className="gap-4">
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input type="email" id="email" placeholder="Email" required />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  type="password"
                  id="password"
                  placeholder="Password"
                  required
                />
              </Field>
            </FieldGroup>
            <Button>Login</Button>
          </FieldSet>
        </form>
      </div>
    </section>
  );
}
