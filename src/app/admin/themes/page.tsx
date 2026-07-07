import { AdminPageHeader } from "@/components/admin/admin-ui";
import { ThemesEditor } from "@/components/admin/themes-editor";
import { getPlatformThemes } from "@/services/platform/platform-data";

export default async function AdminThemesPage() {
  const themes = await getPlatformThemes();

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="w-full">
        <AdminPageHeader eyebrow="Themes" title="Manage theme catalog." body="Enable themes, edit copy, mark premium themes, and control what appears in onboarding." />
        <ThemesEditor initialThemes={themes} />
      </div>
    </main>
  );
}
