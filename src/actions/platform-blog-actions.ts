"use server";

import type { Prisma } from "@prisma/client";
import { revalidatePath, updateTag } from "next/cache";
import { z } from "zod";
import { locales } from "@/i18n/locales";
import { prisma } from "@/lib/db/prisma";
import { platformBlogArticles } from "@/data/platform-blog";
import { cacheTags } from "@/lib/cache";
import { requireSuperAdmin } from "@/services/auth/admin-authorization";

const localizedStringSchema = z.record(z.string().min(1), z.string());
const localizedListSchema = z.record(z.string().min(1), z.array(z.string()));

const platformBlogPostSchema = z.object({
  id: z.string().optional(),
  slug: z
    .string()
    .trim()
    .min(2)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: localizedStringSchema,
  excerpt: localizedStringSchema,
  coverImage: z.string().url(),
  readTime: localizedStringSchema,
  keywords: localizedListSchema,
  sections: z.array(
    z.object({ heading: localizedStringSchema, body: localizedListSchema }),
  ),
  enabled: z.boolean(),
  featured: z.boolean(),
  displayOrder: z.number().int().min(1),
  publishedAt: z.string().min(1),
});

export type PlatformBlogPostInput = z.input<typeof platformBlogPostSchema>;

function json(value: unknown) {
  return value as Prisma.InputJsonValue;
}

async function ensureLegacyArticles() {
  if (await prisma.platformBlogPost.count()) return;

  await prisma.$transaction(
    platformBlogArticles.map((article, index) =>
      prisma.platformBlogPost.create({
        data: {
          slug: article.slug,
          title: json(article.title),
          excerpt: json(article.excerpt),
          coverImage: article.coverImage,
          readTime: json(article.readTime),
          keywords: json(article.keywords),
          sections: json(article.sections),
          enabled: true,
          featured: index === 0,
          displayOrder: index + 1,
          publishedAt: new Date(article.publishedAt),
        },
      }),
    ),
  );
}

function revalidatePlatformBlog(slug?: string) {
  updateTag(cacheTags.platform);
  revalidatePath("/blog");
  revalidatePath("/feed.xml");
  revalidatePath("/sitemap.xml");
  for (const locale of locales) {
    const prefix = locale === "en" ? "" : `/${locale}`;
    revalidatePath(`${prefix}/blog` || "/blog");
    if (slug) revalidatePath(`${prefix}/blog/${slug}`);
  }
  revalidatePath("/admin/blogs");
}

export async function savePlatformBlogPost(input: PlatformBlogPostInput) {
  await requireSuperAdmin();
  const parsed = platformBlogPostSchema.parse(input);
  await ensureLegacyArticles();

  const data = {
    slug: parsed.slug,
    title: json(parsed.title),
    excerpt: json(parsed.excerpt),
    coverImage: parsed.coverImage,
    readTime: json(parsed.readTime),
    keywords: json(parsed.keywords),
    sections: json(parsed.sections),
    enabled: parsed.enabled,
    featured: parsed.featured,
    displayOrder: parsed.displayOrder,
    publishedAt: new Date(parsed.publishedAt),
  };

  const post = parsed.id
    ? await prisma.platformBlogPost.update({ where: { id: parsed.id }, data })
    : await prisma.platformBlogPost.upsert({
        where: { slug: parsed.slug },
        update: data,
        create: data,
      });

  if (parsed.featured) {
    await prisma.platformBlogPost.updateMany({
      where: { id: { not: post.id }, featured: true },
      data: { featured: false },
    });
  }

  revalidatePlatformBlog(post.slug);
  return post.id;
}

export async function deletePlatformBlogPost(id: string) {
  await requireSuperAdmin();
  await ensureLegacyArticles();
  const post = await prisma.platformBlogPost.delete({ where: { id } });
  revalidatePlatformBlog(post.slug);
}
