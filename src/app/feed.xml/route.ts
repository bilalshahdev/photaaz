import { resolveLocalizedString } from "@/i18n/locales";
import { getPlatformBlogArticles } from "@/data/platform-blog";
import { SITE_URL } from "@/lib/seo";
import { getPlatformAppConfig } from "@/services/admin/admin-data";
import { getPlatformAnnouncements, getPlatformThemes } from "@/services/platform/platform-data";

export const revalidate = 600;

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const [config, announcements, themes] = await Promise.all([
    getPlatformAppConfig(),
    getPlatformAnnouncements({ enabledOnly: true }).catch(() => []),
    getPlatformThemes({ enabledOnly: true }).catch(() => [])
  ]);
  const blogArticles = getPlatformBlogArticles();

  const announcementItems = announcements.slice(0, 10).map((announcement) => {
    const href = announcement.linkHref || "/";
    const url = href.startsWith("http") ? href : `${SITE_URL}${href}`;

    return `
    <item>
      <title>${escapeXml(resolveLocalizedString(announcement.title, "en"))}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="false">${escapeXml(`announcement-${announcement.id}`)}</guid>
      <description>${escapeXml(resolveLocalizedString(announcement.body, "en"))}</description>
    </item>`;
  });

  const themeItems = themes.slice(0, 10).map((theme) => {
    const url = `${SITE_URL}/themes/${theme.slug}`;

    return `
    <item>
      <title>${escapeXml(`${resolveLocalizedString(theme.name, "en")} theme`)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <description>${escapeXml(resolveLocalizedString(theme.description, "en"))}</description>
    </item>`;
  });

  const blogItems = blogArticles.map((article) => {
    const url = `${SITE_URL}/blog/${article.slug}`;

    return `
    <item>
      <title>${escapeXml(resolveLocalizedString(article.title, "en"))}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate>
      <description>${escapeXml(resolveLocalizedString(article.excerpt, "en"))}</description>
    </item>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(config.brandName)} Updates</title>
    <link>${SITE_URL}/</link>
    <description>${escapeXml(resolveLocalizedString(config.footerText, "en"))}</description>
    <language>en</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>${blogItems.join("")}${announcementItems.join("")}${themeItems.join("")}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=600, s-maxage=600"
    }
  });
}
