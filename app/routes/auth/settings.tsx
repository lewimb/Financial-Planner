import Header from "~/lib/components/shared/Header";
import { SettingsTab } from "../../lib/components/section/settings/SettingsTab";
export default function Settings() {
  return (
    <div className="space-y-6">
      <Header title="Settings" subtitle="Manage your account and preferences" />
      <SettingsTab />
    </div>
  );
}
