import { Button } from "~/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldSet } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";

export function SettingsSecurity() {
  return (
    <div className="w-full">
      <form>
        <FieldGroup>
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="current-password">
                  Current Password
                </FieldLabel>
                <Input type="password" id="current-password" />
              </Field>
              <Field>
                <FieldLabel htmlFor="new-password">New Password</FieldLabel>
                <Input type="password" id="new-password" />
              </Field>
              <Field>
                <FieldLabel htmlFor="confirm-password">
                  Confirm New Password
                </FieldLabel>
                <Input type="password" id="confirm-password" />
              </Field>
            </FieldGroup>
          </FieldSet>
          <Separator />
          <Field orientation="horizontal">
            <Button type="submit">Update Password</Button>
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
