import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { SettingsProfileForm } from "./SettingsProfileForm";
import PushNotifications from "./SettingsPushNotifications";
import { SettingsSecurity } from "./SettingsSecurity";
import { SettingsDangerZone } from "./SettingsDangerZone";
import { SettingsFinancialProfile } from "./SettingsFinancialProfile";
import { SettingsActivity } from "./SettingsActivity";
import type { FinancialProfile } from "~/lib/types/financial-profile";
import type { User } from "~/lib/types/user";
import type { NotificationPreferences } from "~/lib/types/notifications";
import type { ActivityItem } from "~/lib/types/activity";

interface Props {
  profile: FinancialProfile | null;
  user: User | null;
  notificationPrefs: NotificationPreferences | null;
  activity: ActivityItem[];
}

export function SettingsTab({ profile, user, notificationPrefs, activity }: Props) {
  return (
    <div className="flex w-full flex-col gap-6">
      <Tabs defaultValue="account">
        <TabsList>
          <TabsTrigger value="account">Profile</TabsTrigger>
          <TabsTrigger value="financial">Financial Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              <SettingsProfileForm user={user} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="financial">
          <Card>
            <CardHeader>
              <CardTitle>Financial Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <SettingsFinancialProfile profile={profile} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent className="space-y-6" value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Push Notifications</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              <PushNotifications preferences={notificationPrefs} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent className="space-y-6" value="security">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent>
              <SettingsSecurity />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <SettingsDangerZone />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
            </CardHeader>
            <CardContent>
              <SettingsActivity items={activity} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
