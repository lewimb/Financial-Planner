import { Switch } from "~/components/ui/switch";
import { Separator } from "~/components/ui/separator";

export default function PushNotifications() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="font-semibold text-sm">Transaction Alerts</p>
          <p className="text-muted-foreground text-sm">
            Get notified when you exceed budget thresholds
          </p>
        </div>
        <Switch />
      </div>
      <Separator />
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="font-semibold text-sm">AI Coach Tips</p>
          <p className="text-muted-foreground text-sm">
            Receive personalized financial tips
          </p>
        </div>
        <Switch />
      </div>
    </div>
  );
}
