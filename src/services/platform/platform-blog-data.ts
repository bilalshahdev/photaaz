import { unstable_cache } from "next/cache";
import {
  platformBlogArticles,
  type PlatformBlogArticle,
} from "@/data/platform-blog";
import { prisma } from "@/lib/db/prisma";
import { cacheDurations, cacheTags } from "@/lib/cache";
import { locales, type AppLocale } from "@/i18n/locales";

export type ManagedPlatformBlogArticle = PlatformBlogArticle & {
  id?: string;
  enabled: boolean;
  featured: boolean;
  displayOrder: number;
};

function localizedTextExists(
  value: PlatformBlogArticle["title"],
  locale: AppLocale,
) {
  return typeof value === "string"
    ? locale === "en" && value.trim().length > 0
    : Boolean(value[locale]?.trim());
}

function localizedListExists(
  value: string[] | Record<string, string[]>,
  locale: AppLocale,
) {
  const items = Array.isArray(value)
    ? locale === "en"
      ? value
      : []
    : (value[locale] ?? []);
  return items.some((item) => item.trim().length > 0);
}

export function hasPlatformBlogTranslation(
  article: PlatformBlogArticle,
  locale: AppLocale,
) {
  return (
    localizedTextExists(article.title, locale) &&
    localizedTextExists(article.excerpt, locale) &&
    localizedTextExists(article.readTime, locale) &&
    article.sections.length > 0 &&
    article.sections.every(
      (section) =>
        localizedTextExists(section.heading, locale) &&
        localizedListExists(section.body, locale),
    )
  );
}

export function getPlatformBlogTranslationLocales(
  article: PlatformBlogArticle,
) {
  return locales.filter((locale) =>
    hasPlatformBlogTranslation(article, locale),
  );
}

function legacyArticles(): ManagedPlatformBlogArticle[] {
  return platformBlogArticles.map((article, index) => ({
    ...article,
    enabled: true,
    featured: index === 0,
    displayOrder: index + 1,
  }));
}

function mapRecord(record: {
  id: string;
  slug: string;
  title: unknown;
  excerpt: unknown;
  coverImage: string;
  readTime: unknown;
  keywords: unknown;
  sections: unknown;
  enabled: boolean;
  featured: boolean;
  displayOrder: number;
  publishedAt: Date | null;
}): ManagedPlatformBlogArticle {
  return {
    id: record.id,
    slug: record.slug,
    title: record.title as PlatformBlogArticle["title"],
    excerpt: record.excerpt as PlatformBlogArticle["excerpt"],
    coverImage: record.coverImage,
    publishedAt: (record.publishedAt ?? new Date()).toISOString(),
    readTime: record.readTime as PlatformBlogArticle["readTime"],
    keywords: record.keywords as PlatformBlogArticle["keywords"],
    sections: record.sections as PlatformBlogArticle["sections"],
    enabled: record.enabled,
    featured: record.featured,
    displayOrder: record.displayOrder,
  };
}

async function readArticles(includeDisabled: boolean) {
  try {
    const records = await prisma.platformBlogPost.findMany({
      where: includeDisabled
        ? undefined
        : { enabled: true, publishedAt: { lte: new Date() } },
      orderBy: [
        { featured: "desc" },
        { displayOrder: "asc" },
        { publishedAt: "desc" },
      ],
    });

    if (records.length > 0) {
      return records.map(mapRecord);
    }
  } catch {
    // Keep the existing articles available until the new table is migrated.
  }

  return legacyArticles();
}

export function getManagedPlatformBlogArticles({
  includeDisabled = false,
} = {}) {
  if (includeDisabled) return readArticles(true);

  return unstable_cache(() => readArticles(false), ["managed-platform-blog"], {
    revalidate: cacheDurations.platform,
    tags: [cacheTags.platform],
  })();
}

export async function getManagedPlatformBlogArticle(slug: string) {
  const articles = await getManagedPlatformBlogArticles();
  return articles.find((article) => article.slug === slug) ?? null;
}
