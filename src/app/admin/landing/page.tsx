import { AdminPageHeader } from "@/components/admin/admin-ui";
import { LandingEditor } from "@/components/admin/landing-editor";
import { getPlatformLandingSettings, getPlatformThemes } from "@/services/platform/platform-data";

export default async function AdminLandingPage() {
  const [settings, themes] = await Promise.all([getPlatformLandingSettings(), getPlatformThemes()]);

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AdminPageHeader
          eyebrow="Landing"
          title="Manage marketing homepage."
          body="Control the hero promise, SEO, CTA labels, feature cards, theme showcase ordering, and landing sections."
        />
        <LandingEditor initialSettings={settings} initialThemes={themes} />
      </div>
    </main>
  );
}
