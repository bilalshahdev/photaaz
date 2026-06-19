import { AdminPageHeader } from "@/components/admin/admin-ui";
import { DemosEditor } from "@/components/admin/demos-editor";
import { getPlatformThemes } from "@/services/platform/platform-data";

export default async function AdminDemosPage() {
  const themes = await getPlatformThemes();

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AdminPageHeader eyebrow="Demos" title="Manage live demo routes." body="Each theme should have one strong demo. These records map theme cards to public demo websites." />
        <DemosEditor initialThemes={themes} />
      </div>
    </main>
  );
}
