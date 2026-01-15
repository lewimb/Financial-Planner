import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { SettingsProfileForm } from "./SettingsProfileForm";
import SettingsNotification from "./SettingsNotification";
import PushNotifications from "./SettingsPushNotifications";
import { SettingsSecurity } from "./SettingsSecurity";
import { SettingsDangerZone } from "./SettingsDangerZone";

export function SettingsTab() {
  return (
    <div className="flex w-full  flex-col gap-6">
      <Tabs defaultValue="account">
        <TabsList>
          <TabsTrigger value="account">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              <SettingsProfileForm />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent className="space-y-6" value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              <SettingsNotification />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Push Notifications</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              <PushNotifications />
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
      </Tabs>
    </div>
  );
}
