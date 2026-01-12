import { Button } from "~/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { DatePicker } from "~/lib/components/shared/DatePicker";

export function GoalsFields() {
  return (
    <div className="w-full max-w-md">
      <form>
        <FieldGroup>
          <FieldSet>
            <FieldLegend className="font-semibold text-2xl">
              Create new goals
            </FieldLegend>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="goal-name">Goal Name</FieldLabel>
                <Input
                  id="goal-name"
                  placeholder="e.g., Emergency Fund"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <Textarea id="description" className="h-25 resize-none" />
              </Field>
              <div className="grid grid-cols-2 gap-6">
                <Field>
                  <FieldLabel htmlFor="target-amount">Description</FieldLabel>
                  <Input
                    id="target-amount"
                    placeholder="Input Target (10.000 Rp)"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="current-amount">
                    Current Amount
                  </FieldLabel>
                  <Input
                    id="current-amount"
                    placeholder="Input Current Amount (10.000 Rp)"
                    required
                  />
                </Field>
              </div>
              <Field>
                <FieldLabel htmlFor="current-amount">Target Date</FieldLabel>
                <DatePicker />
              </Field>
              <Field>
                <FieldLabel htmlFor="icon">Goal Name</FieldLabel>
                <Input
                  id="icon"
                  type="file"
                  placeholder="Icon (not required)"
                  className="py-auto"
                />
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
