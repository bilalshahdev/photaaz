import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db/prisma";
import { absoluteUrl, getLocalizedSeoUrl } from "@/lib/seo";
import { getEnabledTranslationLocales } from "@/services/admin/admin-data";
import { getPlatformThemes } from "@/services/platform/platform-data";
import {
  getManagedPlatformBlogArticles,
  getPlatformBlogTranslationLocales,
} from "@/services/platform/platform-blog-data";

export const revalidate = 3600;

const epoch = new Date("2024-01-01T00:00:00.000Z");

function latest(...dates: Array<Date | string | null | undefined>) {
  return dates
    .filter(Boolean)
    .map((date) => new Date(date as Date | string))
    .filter((date) => !Number.isNaN(date.getTime()))
    .reduce((newest, date) => (date > newest ? date : newest), epoch);
}

function localizedEntries(
  path: string,
  locales: Awaited<ReturnType<typeof getEnabledTranslationLocales>>,
  options: Omit<MetadataRoute.Sitemap[number], "url">,
) {
  return locales.map((locale) => ({
    url: getLocalizedSeoUrl(path, locale),
    ...options,
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [themes, enabledLocales, tenants, platformBlogArticles] =
    await Promise.all([
      getPlatformThemes({ enabledOnly: true }).catch(() => []),
      getEnabledTranslationLocales().catch(() => ["en" as const]),
      prisma.tenant
        .findMany({
          where: { status: "ACTIVE" },
          select: {
            slug: true,
            updatedAt: true,
          },
          orderBy: { updatedAt: "desc" },
          take: 200,
        })
        .catch(() => []),
      getManagedPlatformBlogArticles(),
    ]);

  const now = new Date();
  const marketingRoutes: MetadataRoute.Sitemap = [
    ...localizedEntries("/", enabledLocales, {
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    }),
    ...localizedEntries("/themes", enabledLocales, {
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    }),
    ...localizedEntries("/get-started", enabledLocales, {
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    }),
    ...localizedEntries("/blog", enabledLocales, {
      lastModified: latest(
        ...platformBlogArticles.map((article) => article.publishedAt),
      ),
      changeFrequency: "weekly",
      priority: 0.75,
    }),
  ];

  const platformBlogRoutes: MetadataRoute.Sitemap =
    platformBlogArticles.flatMap((article) =>
      localizedEntries(
        `/blog/${article.slug}`,
        enabledLocales.filter((locale) =>
          getPlatformBlogTranslationLocales(article).includes(locale),
        ),
        {
          lastModified: latest(article.publishedAt),
          changeFrequency: "monthly",
          priority: 0.65,
        },
      ),
    );

  const themeRoutes: MetadataRoute.Sitemap = themes.flatMap((theme) => [
    ...localizedEntries(`/themes/${theme.slug}`, enabledLocales, {
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    }),
    ...localizedEntries(`/themes/${theme.slug}/demo`, enabledLocales, {
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.65,
    }),
  ]);

  const tenantRoutes: MetadataRoute.Sitemap = tenants.flatMap((tenant) => {
    const tenantUpdated = latest(tenant.updatedAt);

    return [
      ...localizedEntries(`/site/${tenant.slug}`, enabledLocales, {
        lastModified: tenantUpdated,
        changeFrequency: "weekly",
        priority: 0.75,
      }),
      ...localizedEntries(`/site/${tenant.slug}/gallery`, enabledLocales, {
        lastModified: tenantUpdated,
        changeFrequency: "weekly",
        priority: 0.65,
      }),
      ...localizedEntries(`/site/${tenant.slug}/about`, enabledLocales, {
        lastModified: tenant.updatedAt,
        changeFrequency: "monthly",
        priority: 0.45,
      }),
    ];
  });

  return [
    ...marketingRoutes,
    ...platformBlogRoutes,
    ...themeRoutes,
    ...tenantRoutes,
    {
      url: absoluteUrl("/llms.txt"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.2,
    },
  ];
}
