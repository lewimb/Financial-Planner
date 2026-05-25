import { useState } from "react";
import { useFetcher } from "react-router";
import { Button } from "~/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldSet } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import type { User } from "~/lib/types/user";

interface Props {
  user: User | null;
}

export function SettingsProfileForm({ user }: Props) {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";

  const [firstName, setFirstName] = useState(user?.first_name ?? "");
  const [lastName, setLastName] = useState(user?.last_name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");

  return (
    <div className="w-full">
      <fetcher.Form method="post">
        <input type="hidden" name="intent" value="user-profile" />
        <FieldGroup>
          <FieldSet>
            <FieldGroup>
              <div className="grid grid-cols-2 gap-6">
                <Field>
                  <FieldLabel htmlFor="first-name">First Name</FieldLabel>
                  <Input
                    id="first-name"
                    name="first_name"
                    placeholder="e.g., Robert"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="last-name">Last Name</FieldLabel>
                  <Input
                    id="last-name"
                    name="last_name"
                    placeholder="e.g., Jr"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </Field>
              </div>
              <Field>
                <FieldLabel htmlFor="email-address">Email Address</FieldLabel>
                <Input
                  id="email-address"
                  value={user?.email ?? ""}
                  disabled
                  readOnly
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="phone-number">Phone Number</FieldLabel>
                <Input
                  id="phone-number"
                  name="phone"
                  placeholder="+62 1234 5678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </Field>
            </FieldGroup>
          </FieldSet>
          <Field orientation="horizontal">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : "Save Changes"}
            </Button>
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                setFirstName(user?.first_name ?? "");
                setLastName(user?.last_name ?? "");
                setPhone(user?.phone ?? "");
              }}
            >
              Cancel
            </Button>
          </Field>
        </FieldGroup>
      </fetcher.Form>
    </div>
  );
}
