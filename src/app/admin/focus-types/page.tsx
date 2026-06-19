import { AdminPageHeader } from "@/components/admin/admin-ui";
import { FocusTypesEditor } from "@/components/admin/focus-types-editor";
import { getPlatformPhotographyTypes } from "@/services/platform/platform-data";

export default async function AdminFocusTypesPage() {
  const types = await getPlatformPhotographyTypes();

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <AdminPageHeader
          eyebrow="Categories"
          title="Manage photography categories and subcategories."
          body="Super admin controls this taxonomy. If a category has subcategories, customers must choose one of those subcategories when uploading photos."
        />
        <FocusTypesEditor initialTypes={types} />
      </div>
    </main>
  );
}
