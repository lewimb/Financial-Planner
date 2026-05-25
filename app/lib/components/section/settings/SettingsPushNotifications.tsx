import { useState, useEffect } from "react";
import { useFetcher } from "react-router";
import { Switch } from "~/components/ui/switch";
import { Separator } from "~/components/ui/separator";
import type { NotificationPreferences } from "~/lib/types/notifications";

interface Props {
  preferences: NotificationPreferences | null;
}

const DEFAULT_PREFS: NotificationPreferences = {
  budget_alerts: true,
  goal_reminders: true,
  anomaly_alerts: true,
  weekly_summary: false,
  push_enabled: false,
};

export default function PushNotifications({ preferences }: Props) {
  const fetcher = useFetcher();
  const [prefs, setPrefs] = useState<NotificationPreferences>(
    preferences ?? DEFAULT_PREFS
  );

  useEffect(() => {
    if (preferences) setPrefs(preferences);
  }, [preferences]);

  function toggle(key: keyof NotificationPreferences) {
    const updated = { ...prefs, [key]: !prefs[key] };
    setPrefs(updated);
    fetcher.submit(
      { intent: "notification-settings", ...Object.fromEntries(
        Object.entries(updated).map(([k, v]) => [k, String(v)])
      )},
      { method: "post" }
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="font-semibold text-sm">Budget Alerts</p>
          <p className="text-muted-foreground text-sm">
            Get notified when you exceed budget thresholds
          </p>
        </div>
        <Switch
          checked={prefs.budget_alerts}
          onCheckedChange={() => toggle("budget_alerts")}
        />
      </div>
      <Separator />
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="font-semibold text-sm">Goal Reminders</p>
          <p className="text-muted-foreground text-sm">
            Receive reminders about upcoming goal deadlines
          </p>
        </div>
        <Switch
          checked={prefs.goal_reminders}
          onCheckedChange={() => toggle("goal_reminders")}
        />
      </div>
      <Separator />
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="font-semibold text-sm">Anomaly Alerts</p>
          <p className="text-muted-foreground text-sm">
            Receive personalized financial tips and anomaly detection
          </p>
        </div>
        <Switch
          checked={prefs.anomaly_alerts}
          onCheckedChange={() => toggle("anomaly_alerts")}
        />
      </div>
      <Separator />
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="font-semibold text-sm">Weekly Summary</p>
          <p className="text-muted-foreground text-sm">
            Receive a weekly financial summary by email
          </p>
        </div>
        <Switch
          checked={prefs.weekly_summary}
          onCheckedChange={() => toggle("weekly_summary")}
        />
      </div>
    </div>
  );
}
