import { AdminPage, AdminPageHeader } from "@/components/admin/admin-ui";
import { PlatformBlogManager } from "@/components/admin/platform-blog-manager";
import { getTranslationLocaleConfig } from "@/services/admin/admin-data";
import { getManagedPlatformBlogArticles } from "@/services/platform/platform-blog-data";

export default async function AdminPlatformBlogsPage() {
  const [articles, localeConfig] = await Promise.all([
    getManagedPlatformBlogArticles({ includeDisabled: true }),
    getTranslationLocaleConfig()
  ]);

  return (
    <AdminPage>
      <AdminPageHeader
        eyebrow="Main-site blog"
        title="Manage Photaaz articles."
        body="Create localized articles, control publishing, edit SEO keywords, and manage the content shown on the public Photaaz blog."
      />
      <PlatformBlogManager initialArticles={articles} locales={localeConfig.filter((locale) => locale.enabled)} />
    </AdminPage>
  );
}
