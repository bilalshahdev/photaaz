import { AdminPageHeader } from "@/components/admin/admin-ui";
import { SeoEditor } from "@/components/admin/seo-editor";
import { getPlatformAppConfig, getTranslationLocaleConfig } from "@/services/admin/admin-data";
import { getPlatformLandingSettings } from "@/services/platform/platform-data";

export default async function AdminSeoPage() {
  const [settings, appConfig, locales] = await Promise.all([getPlatformLandingSettings(), getPlatformAppConfig(), getTranslationLocaleConfig()]);
  const enabledLocales = locales.filter((locale) => locale.enabled);

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="w-full">
        <AdminPageHeader
          eyebrow="SEO"
          title="Manage search and sharing."
          body="Control localized homepage metadata, social preview assets, favicons, signature color, and crawl-ready platform endpoints."
        />
        <SeoEditor initialSettings={settings} initialAppConfig={appConfig} locales={enabledLocales} />
      </div>
    </main>
  );
}
