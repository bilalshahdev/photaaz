import { AdminPage, AdminPageHeader } from "@/components/admin/admin-ui";
import { FeaturesCatalog } from "@/components/admin/features-catalog";
import { getAdminFeatures, getTranslationLocaleConfig } from "@/services/admin/admin-data";

export default async function AdminFeaturesPage() {
  const [features, locales] = await Promise.all([getAdminFeatures(), getTranslationLocaleConfig()]);
  const enabledLocales = locales.filter((locale) => locale.enabled);

  return (
    <AdminPage>
      <AdminPageHeader eyebrow="Features" title="Manage package features." body="Create reusable feature definitions, then enable them with limits inside customer packages." />
      <FeaturesCatalog features={features} locales={enabledLocales} />
    </AdminPage>
  );
}
