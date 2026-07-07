import { AdminPageHeader } from "@/components/admin/admin-ui";
import { AnnouncementsEditor } from "@/components/admin/announcements-editor";
import { getTranslationLocaleConfig } from "@/services/admin/admin-data";
import { getPlatformAnnouncements } from "@/services/platform/platform-data";

export default async function AdminAnnouncementsPage() {
  const [announcements, locales] = await Promise.all([getPlatformAnnouncements(), getTranslationLocaleConfig()]);

  return (
    <div>
      <AdminPageHeader
        eyebrow="Announcements"
        title="Manage announcement bars."
        body="Create promotional notes, discounts, release updates, or onboarding notices with optional links and marquee motion."
      />
      <AnnouncementsEditor initialAnnouncements={announcements} locales={locales.filter((locale) => locale.enabled)} />
    </div>
  );
}
