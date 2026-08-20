import { AdminPage, AdminPageHeader } from "@/components/admin/admin-ui";
import { PackageCatalog } from "@/components/admin/package-catalog";
import { getAdminFeatures, getAdminPlans, getTranslationLocaleConfig } from "@/services/admin/admin-data";

export default async function AdminPackagesPage() {
  const [plans, features, locales] = await Promise.all([getAdminPlans(), getAdminFeatures(), getTranslationLocaleConfig()]);
  const enabledLocales = locales.filter((locale) => locale.enabled);

  return (
    <AdminPage>
      <AdminPageHeader eyebrow="Packages" title="Manage customer packages." body="Control real subscription plans used by customer tenants, public pricing cards, linked features, limits, enabled state, and subscriber counts." />
      <PackageCatalog plans={plans} features={features} locales={enabledLocales} />
    </AdminPage>
  );
}
