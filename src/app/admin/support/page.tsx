import { AdminPageHeader } from "@/components/admin/admin-ui";
import { SupportInbox } from "@/components/admin/support-inbox";
import { getPlatformSupportRequests } from "@/services/platform/platform-data";

export default async function AdminSupportPage() {
  const requests = await getPlatformSupportRequests();

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="w-full">
        <AdminPageHeader eyebrow="Support" title="Manage support requests." body="Requests from the homepage contact form and demo seed data appear here." />
        <SupportInbox initialRequests={requests} />
      </div>
    </main>
  );
}
