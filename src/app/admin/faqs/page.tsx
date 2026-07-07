import { AdminPage, AdminPageHeader } from "@/components/admin/admin-ui";
import { FaqEditor } from "@/components/admin/faq-editor";
import { getTranslationLocaleConfig } from "@/services/admin/admin-data";
import { getPlatformLandingSettings } from "@/services/platform/platform-data";

export default async function AdminFaqsPage() {
  const [settings, locales] = await Promise.all([getPlatformLandingSettings(), getTranslationLocaleConfig()]);
  const enabledLocales = locales.filter((locale) => locale.enabled);

  return (
    <AdminPage>
      <AdminPageHeader
        eyebrow="FAQ"
        title="Manage homepage questions."
        body="Create localized FAQ entries and control how many are shown on the public landing page."
      />
      <FaqEditor initialSettings={settings} locales={enabledLocales} />
    </AdminPage>
  );
}
