"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db/prisma";
import { revalidateTenantDashboard, revalidateTenantPublic } from "@/lib/cache";
import { saveTenantImageUpload } from "@/services/storage/local-upload";
import { assertBlogCreateLimit } from "@/services/subscription/plan-limits";

const blogSchema = z.object({
  tenantSlug: z.string().min(1),
  blogId: z.string().optional(),
  title: z.string().trim().min(2).max(140),
  slug: z.string().trim().min(2).max(160).optional(),
  excerpt: z.string().trim().max(300).optional(),
  blogCategoryId: z.string().optional(),
  relatedCategoryId: z.string().optional(),
  featuredPhotoId: z.string().optional(),
  tags: z.string().trim().optional(),
  contentHtml: z.string().trim().min(10)
});

const deleteBlogSchema = z.object({
  tenantSlug: z.string().min(1),
  blogId: z.string().min(1)
});

const blogCategorySchema = z.object({
  tenantSlug: z.string().min(1),
  categoryId: z.string().optional(),
  name: z.string().trim().min(2).max(80),
  slug: z.string().trim().min(2).max(100).optional(),
  description: z.string().trim().max(220).optional()
});

const deleteBlogCategorySchema = z.object({
  tenantSlug: z.string().min(1),
  categoryId: z.string().min(1)
});

export async function createCustomerBlogPost(formData: FormData) {
  const parsed = blogSchema.parse({
    tenantSlug: String(formData.get("tenantSlug") ?? ""),
    blogId: normalizeOptionalString(formData.get("blogId")),
    title: String(formData.get("title") ?? ""),
    slug: normalizeOptionalString(formData.get("slug")),
    excerpt: String(formData.get("excerpt") ?? ""),
    blogCategoryId: normalizeEmptySelect(formData.get("blogCategoryId")),
    relatedCategoryId: normalizeEmptySelect(formData.get("relatedCategoryId")),
    featuredPhotoId: normalizeOptionalString(formData.get("featuredPhotoId")),
    tags: String(formData.get("tags") ?? ""),
    contentHtml: String(formData.get("contentHtml") ?? "")
  });
  const featuredImageFile = formData.get("featuredImageFile");

  const tenant = await prisma.tenant.findUnique({
    where: {
      slug: parsed.tenantSlug
    },
    select: {
      id: true
    }
  });

  if (!tenant) {
    throw new Error("Tenant not found.");
  }

  await assertBlogCreateLimit(parsed.tenantSlug);

  const slug = slugify(parsed.slug || parsed.title);
  const featuredImage = await resolveFeaturedImage({
    tenantId: tenant.id,
    tenantSlug: parsed.tenantSlug,
    featuredPhotoId: parsed.featuredPhotoId,
    featuredImageFile
  });
  const tags = parseTags(parsed.tags);

  await prisma.blogPost.create({
    data: {
      tenantId: tenant.id,
      categoryId: parsed.relatedCategoryId || null,
      blogCategoryId: parsed.blogCategoryId || null,
      title: parsed.title,
      slug,
      excerpt: parsed.excerpt || null,
      featuredImage,
      metaTitle: parsed.title,
      metaDescription: parsed.excerpt || null,
      tags,
      content: {
        type: "html",
        html: parsed.contentHtml
      },
      publishedAt: null,
      moderationStatus: "PENDING",
      moderationNote: null
    }
  });

  revalidatePath(`/site/${parsed.tenantSlug}/dashboard/blogs`);
  revalidateTenantDashboard(parsed.tenantSlug);
  revalidateTenantPublic(parsed.tenantSlug);
}

export async function updateCustomerBlogPost(formData: FormData) {
  const parsed = blogSchema.extend({ blogId: z.string().min(1) }).parse({
    tenantSlug: String(formData.get("tenantSlug") ?? ""),
    blogId: String(formData.get("blogId") ?? ""),
    title: String(formData.get("title") ?? ""),
    slug: normalizeOptionalString(formData.get("slug")),
    excerpt: String(formData.get("excerpt") ?? ""),
    blogCategoryId: normalizeEmptySelect(formData.get("blogCategoryId")),
    relatedCategoryId: normalizeEmptySelect(formData.get("relatedCategoryId")),
    featuredPhotoId: normalizeOptionalString(formData.get("featuredPhotoId")),
    tags: String(formData.get("tags") ?? ""),
    contentHtml: String(formData.get("contentHtml") ?? "")
  });
  const featuredImageFile = formData.get("featuredImageFile");

  const tenant = await prisma.tenant.findUnique({
    where: {
      slug: parsed.tenantSlug
    },
    select: {
      id: true
    }
  });

  if (!tenant) {
    throw new Error("Tenant not found.");
  }

  const existingBlog = await prisma.blogPost.findFirst({
    where: {
      id: parsed.blogId,
      tenantId: tenant.id
    },
    select: {
      id: true,
      featuredImage: true
    }
  });

  if (!existingBlog) {
    throw new Error("Blog post not found.");
  }

  const featuredImage = await resolveFeaturedImage({
    tenantId: tenant.id,
    tenantSlug: parsed.tenantSlug,
    featuredPhotoId: parsed.featuredPhotoId,
    featuredImageFile
  });

  await prisma.blogPost.update({
    where: {
      id: existingBlog.id
    },
    data: {
      categoryId: parsed.relatedCategoryId || null,
      blogCategoryId: parsed.blogCategoryId || null,
      title: parsed.title,
      slug: slugify(parsed.slug || parsed.title),
      excerpt: parsed.excerpt || null,
      featuredImage: featuredImage ?? existingBlog.featuredImage,
      metaTitle: parsed.title,
      metaDescription: parsed.excerpt || null,
      tags: parseTags(parsed.tags),
      content: {
        type: "html",
        html: parsed.contentHtml
      },
      publishedAt: null,
      moderationStatus: "PENDING",
      moderationNote: "Edited by client and waiting for review."
    }
  });

  revalidatePath(`/site/${parsed.tenantSlug}/dashboard/blogs`);
  revalidatePath(`/site/${parsed.tenantSlug}/dashboard/blogs/${parsed.blogId}`);
  revalidateTenantDashboard(parsed.tenantSlug);
  revalidateTenantPublic(parsed.tenantSlug);
}

export async function createCustomerBlogCategory(formData: FormData) {
  const parsed = blogCategorySchema.parse({
    tenantSlug: String(formData.get("tenantSlug") ?? ""),
    name: String(formData.get("name") ?? ""),
    slug: normalizeOptionalString(formData.get("slug")),
    description: String(formData.get("description") ?? "")
  });
  const tenant = await getTenantForBlogAction(parsed.tenantSlug);
  const displayOrder = await prisma.blogCategory.count({
    where: {
      tenantId: tenant.id
    }
  });

  await prisma.blogCategory.create({
    data: {
      tenantId: tenant.id,
      name: parsed.name,
      slug: slugify(parsed.slug || parsed.name),
      description: parsed.description || null,
      displayOrder: displayOrder + 1
    }
  });

  revalidatePath(`/site/${parsed.tenantSlug}/dashboard/blog-categories`);
  revalidateTenantDashboard(parsed.tenantSlug);
}

export async function updateCustomerBlogCategory(formData: FormData) {
  const parsed = blogCategorySchema.extend({ categoryId: z.string().min(1) }).parse({
    tenantSlug: String(formData.get("tenantSlug") ?? ""),
    categoryId: String(formData.get("categoryId") ?? ""),
    name: String(formData.get("name") ?? ""),
    slug: normalizeOptionalString(formData.get("slug")),
    description: String(formData.get("description") ?? "")
  });
  const tenant = await getTenantForBlogAction(parsed.tenantSlug);

  await prisma.blogCategory.update({
    where: {
      id: parsed.categoryId,
      tenantId: tenant.id
    },
    data: {
      name: parsed.name,
      slug: slugify(parsed.slug || parsed.name),
      description: parsed.description || null
    }
  });

  revalidatePath(`/site/${parsed.tenantSlug}/dashboard/blog-categories`);
  revalidateTenantDashboard(parsed.tenantSlug);
  revalidateTenantPublic(parsed.tenantSlug);
}

export async function deleteCustomerBlogCategory(formData: FormData) {
  const parsed = deleteBlogCategorySchema.parse({
    tenantSlug: String(formData.get("tenantSlug") ?? ""),
    categoryId: String(formData.get("categoryId") ?? "")
  });
  const tenant = await getTenantForBlogAction(parsed.tenantSlug);

  await prisma.blogCategory.deleteMany({
    where: {
      id: parsed.categoryId,
      tenantId: tenant.id
    }
  });

  revalidatePath(`/site/${parsed.tenantSlug}/dashboard/blog-categories`);
  revalidateTenantDashboard(parsed.tenantSlug);
  revalidateTenantPublic(parsed.tenantSlug);
}

async function getTenantForBlogAction(tenantSlug: string) {
  const tenant = await prisma.tenant.findUnique({
    where: {
      slug: tenantSlug
    },
    select: {
      id: true
    }
  });

  if (!tenant) {
    throw new Error("Tenant not found.");
  }

  return tenant;
}

export async function deleteCustomerBlogPost(formData: FormData) {
  const parsed = deleteBlogSchema.parse({
    tenantSlug: String(formData.get("tenantSlug") ?? ""),
    blogId: String(formData.get("blogId") ?? "")
  });

  const tenant = await prisma.tenant.findUnique({
    where: {
      slug: parsed.tenantSlug
    },
    select: {
      id: true
    }
  });

  if (!tenant) {
    throw new Error("Tenant not found.");
  }

  await prisma.blogPost.deleteMany({
    where: {
      id: parsed.blogId,
      tenantId: tenant.id
    }
  });

  revalidatePath(`/site/${parsed.tenantSlug}/dashboard/blogs`);
  revalidateTenantDashboard(parsed.tenantSlug);
  revalidateTenantPublic(parsed.tenantSlug);
}

async function resolveFeaturedImage({
  tenantId,
  tenantSlug,
  featuredPhotoId,
  featuredImageFile
}: {
  tenantId: string;
  tenantSlug: string;
  featuredPhotoId?: string;
  featuredImageFile: FormDataEntryValue | null;
}) {
  if (featuredImageFile instanceof File && featuredImageFile.size > 0) {
    const upload = await saveTenantImageUpload(featuredImageFile, tenantSlug, { area: "blogs", fileLabel: "featured" });
    return upload.publicPath;
  }

  if (!featuredPhotoId) {
    return null;
  }

  const photo = await prisma.photo.findFirst({
    where: {
      id: featuredPhotoId,
      tenantId
    },
    select: {
      secureUrl: true
    }
  });

  return photo?.secureUrl ?? null;
}

function slugify(value: string) {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "post"
  );
}

function normalizeEmptySelect(value: FormDataEntryValue | null) {
  const normalized = String(value ?? "");
  return normalized === "none" ? "" : normalized;
}

function normalizeOptionalString(value: FormDataEntryValue | null) {
  const normalized = String(value ?? "").trim();
  return normalized || undefined;
}

function parseTags(value?: string) {
  return (value ?? "")
    .split(",")
    .map((tag) => tag.trim().replace(/\s+/g, " "))
    .filter(Boolean)
    .filter((tag, index, tags) => tags.findIndex((candidate) => candidate.toLowerCase() === tag.toLowerCase()) === index)
    .slice(0, 20);
}
