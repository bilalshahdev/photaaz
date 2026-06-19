import { AdminPageHeader } from "@/components/admin/admin-ui";
import { AnnouncementsEditor } from "@/components/admin/announcements-editor";
import { getPlatformAnnouncements } from "@/services/platform/platform-data";

export default async function AdminAnnouncementsPage() {
  const announcements = await getPlatformAnnouncements();

  return (
    <div>
      <AdminPageHeader
        eyebrow="Announcements"
        title="Manage announcement bars."
        body="Create promotional notes, discounts, release updates, or onboarding notices with optional links and marquee motion."
      />
      <AnnouncementsEditor initialAnnouncements={announcements} />
    </div>
  );
}
