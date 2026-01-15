import { Button } from "~/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldSet } from "~/components/ui/field";
import { Input } from "~/components/ui/input";

export function SettingsProfileForm() {
  return (
    <div className="w-full">
      <form>
        <FieldGroup>
          <FieldSet>
            <FieldGroup>
              <div className="grid grid-cols-2 gap-6">
                <Field>
                  <FieldLabel htmlFor="first-name">First Name</FieldLabel>
                  <Input id="first-name" placeholder="e.g., Robert" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="last-name">Last Name</FieldLabel>
                  <Input id="last-name" placeholder="e.g., Jr" />
                </Field>
              </div>
              <Field>
                <FieldLabel htmlFor="email-address">Email Address</FieldLabel>
                <Input id="email-address" placeholder="example@email.com" />
              </Field>
              <Field>
                <FieldLabel htmlFor="phone-number">Phone Number</FieldLabel>
                <Input id="phone-numbers" placeholder="+82 1234 5678" />
              </Field>
            </FieldGroup>
          </FieldSet>
          <Field orientation="horizontal">
            <Button type="submit">Submit</Button>
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
