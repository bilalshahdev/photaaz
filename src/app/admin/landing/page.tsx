import { AdminPageHeader } from "@/components/admin/admin-ui";
import { LandingEditor } from "@/components/admin/landing-editor";
import { getTranslationLocaleConfig } from "@/services/admin/admin-data";
import { getPlatformLandingSettings, getPlatformThemes } from "@/services/platform/platform-data";

export default async function AdminLandingPage() {
  const [settings, themes, locales] = await Promise.all([getPlatformLandingSettings(), getPlatformThemes(), getTranslationLocaleConfig()]);
  const enabledLocales = locales.filter((locale) => locale.enabled);

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="w-full">
        <AdminPageHeader
          eyebrow="Landing"
          title="Manage marketing homepage."
          body="Control the hero promise, CTA labels, feature cards, theme showcase ordering, and landing section visibility."
        />
        <LandingEditor initialSettings={settings} initialThemes={themes} locales={enabledLocales} />
      </div>
    </main>
  );
}
