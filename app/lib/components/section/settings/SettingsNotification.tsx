import { Switch } from "~/components/ui/switch";
import { Separator } from "~/components/ui/separator";

export default function SettingsNotification() {
  return (
    <>
      {/* Budget alerts */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="font-semibold text-sm">Budget Alerts</p>
            <p className="text-muted-foreground text-sm">
              Get notified when you exceed budget thresholds
            </p>
          </div>
          <Switch />
        </div>

        {/* Goal Milestones */}
        <Separator />
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="font-semibold text-sm">Goal Milestones</p>
            <p className="text-muted-foreground text-sm">
              Notifications when you reach savings milestones
            </p>
          </div>
          <Switch />
        </div>

        {/* weekly reports */}
        <Separator />
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="font-semibold text-sm">Weekly Reports</p>
            <p className="text-muted-foreground text-sm">
              Receive weekly financial summary emails
            </p>
          </div>
          <Switch />
        </div>

        <Separator />
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="font-semibold text-sm">Monthly Reports</p>
            <p className="text-muted-foreground text-sm">
              Comprehensive monthly financial reports
            </p>
          </div>
          <Switch />
        </div>
      </div>
    </>
  );
}
