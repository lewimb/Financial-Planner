import { Button } from "~/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldSet } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";

export function SettingsSecurity() {
  return (
    <div className="w-full">
      <p className="text-sm text-muted-foreground mb-4">
        Not available yet — there's no change-password endpoint on the backend.
      </p>
      <form onSubmit={(e) => e.preventDefault()}>
        <FieldGroup>
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="current-password">
                  Current Password
                </FieldLabel>
                <Input type="password" id="current-password" disabled />
              </Field>
              <Field>
                <FieldLabel htmlFor="new-password">New Password</FieldLabel>
                <Input type="password" id="new-password" disabled />
              </Field>
              <Field>
                <FieldLabel htmlFor="confirm-password">
                  Confirm New Password
                </FieldLabel>
                <Input type="password" id="confirm-password" disabled />
              </Field>
            </FieldGroup>
          </FieldSet>
          <Separator />
          <Field orientation="horizontal">
            <Button type="submit" disabled>
              Update Password
            </Button>
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
