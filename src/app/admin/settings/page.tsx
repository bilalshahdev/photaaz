import { AdminPage, AdminPageHeader } from "@/components/admin/admin-ui";
import { getPlatformAppConfig, getTranslationLocaleConfig } from "@/services/admin/admin-data";
import { AdminAppConfigForm } from "./admin-settings-form";

export default async function AdminSettingsPage() {
  const [config, locales] = await Promise.all([getPlatformAppConfig(), getTranslationLocaleConfig()]);
  const enabledLocales = locales.filter((locale) => locale.enabled);

  return (
    <AdminPage>
      <AdminPageHeader eyebrow="App Config" title="Manage platform details." body="Control global support contacts, footer copy, company address, and dashboard notices." />
      <AdminAppConfigForm config={config} locales={enabledLocales} />
    </AdminPage>
  );
}
