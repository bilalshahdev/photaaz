import { AdminPage, AdminPageHeader } from "@/components/admin/admin-ui";
import { AdminMessageManager } from "@/components/admin/admin-message-manager";
import { getAdminConversationInbox } from "@/services/admin/admin-data";

export default async function AdminMessagesPage() {
  const threads = await getAdminConversationInbox();

  return (
    <AdminPage>
      <AdminPageHeader eyebrow="Communication" title="Client messages." body="Two-way conversations between Photaaz admin and client dashboards." />

      <AdminMessageManager threads={threads} />
    </AdminPage>
  );
}
