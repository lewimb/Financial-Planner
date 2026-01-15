import { Button } from "~/components/ui/button";
import { Field, FieldGroup } from "~/components/ui/field";
import { Label } from "~/components/ui/label";

export function SettingsDangerZone() {
  return (
    <div className="w-full p-6 border border-destructive rounded-lg">
      <form>
        <FieldGroup>
          <Field>
            <Label>Delete Account</Label>
            <Label className="text-muted-foreground">
              Once you delete your account, there is no going back. All your
              data will be permanently removed.
            </Label>
            <Button
              className="max-w-fit mt-2"
              type="submit"
              variant="destructive"
            >
              Delete Account
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
