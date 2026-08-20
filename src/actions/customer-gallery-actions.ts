"use server";

import { z } from "zod";
import { revalidateTenantDashboard, revalidateTenantPublic } from "@/lib/cache";
import { prisma } from "@/lib/db/prisma";
import { slugify } from "@/lib/slug";
import { assertGalleryCreateLimit } from "@/services/subscription/plan-limits";
import { requireTenantOwner } from "@/services/auth/tenant-authorization";

const gallerySchema = z.object({
  tenantSlug: z.string().min(1),
  title: z.string().trim().min(2),
  slug: z.string().trim().optional(),
  description: z.string().trim().optional(),
  categoryId: z.string().trim().optional(),
  featured: z.boolean(),
  published: z.boolean(),
});

const galleryUpdateSchema = gallerySchema.extend({
  galleryId: z.string().min(1),
});

const galleryDeleteSchema = z.object({
  tenantSlug: z.string().min(1),
  galleryId: z.string().min(1),
});

export async function createCustomerGallery(formData: FormData) {
  const parsed = gallerySchema.parse({
    tenantSlug: String(formData.get("tenantSlug") ?? ""),
    title: String(formData.get("title") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    description: String(formData.get("description") ?? ""),
    categoryId: normalizeOptional(formData.get("categoryId")),
    featured: formData.get("featured") === "on",
    published: formData.get("published") === "on",
  });

  const tenant = await getTenant(parsed.tenantSlug);
  await assertGalleryCreateLimit(parsed.tenantSlug);

  const categoryId = await getTenantCategoryId(tenant.id, parsed.categoryId);
  const slug = await createUniqueAlbumSlug(
    tenant.id,
    parsed.slug || parsed.title,
  );

  await prisma.album.create({
    data: {
      tenantId: tenant.id,
      title: parsed.title,
      slug,
      description: parsed.description || null,
      categoryId,
      featured: parsed.featured,
      published: parsed.published,
    },
  });

  revalidateGalleryPaths(parsed.tenantSlug);
}

export async function updateCustomerGallery(formData: FormData) {
  const parsed = galleryUpdateSchema.parse({
    tenantSlug: String(formData.get("tenantSlug") ?? ""),
    galleryId: String(formData.get("galleryId") ?? ""),
    title: String(formData.get("title") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    description: String(formData.get("description") ?? ""),
    categoryId: normalizeOptional(formData.get("categoryId")),
    featured: formData.get("featured") === "on",
    published: formData.get("published") === "on",
  });

  const tenant = await getTenant(parsed.tenantSlug);
  const album = await prisma.album.findFirst({
    where: {
      id: parsed.galleryId,
      tenantId: tenant.id,
    },
    select: {
      id: true,
      slug: true,
    },
  });

  if (!album) {
    throw new Error("Gallery not found.");
  }

  const categoryId = await getTenantCategoryId(tenant.id, parsed.categoryId);
  const requestedSlug = slugify(parsed.slug || parsed.title);
  const slug =
    requestedSlug === album.slug
      ? album.slug
      : await createUniqueAlbumSlug(tenant.id, requestedSlug);

  await prisma.album.update({
    where: {
      id: album.id,
    },
    data: {
      title: parsed.title,
      slug,
      description: parsed.description || null,
      categoryId,
      featured: parsed.featured,
      published: parsed.published,
    },
  });

  revalidateGalleryPaths(parsed.tenantSlug);
}

export async function deleteCustomerGallery(formData: FormData) {
  const parsed = galleryDeleteSchema.parse({
    tenantSlug: String(formData.get("tenantSlug") ?? ""),
    galleryId: String(formData.get("galleryId") ?? ""),
  });

  const tenant = await getTenant(parsed.tenantSlug);

  await prisma.album.deleteMany({
    where: {
      id: parsed.galleryId,
      tenantId: tenant.id,
    },
  });

  revalidateGalleryPaths(parsed.tenantSlug);
}

async function getTenant(slug: string) {
  const authorizedTenant = await requireTenantOwner(slug);
  const tenant = await prisma.tenant.findFirst({
    where: {
      id: authorizedTenant.id,
      slug,
    },
    select: {
      id: true,
      slug: true,
    },
  });

  if (!tenant) {
    throw new Error("Tenant not found.");
  }

  return tenant;
}

async function getTenantCategoryId(tenantId: string, categoryId?: string) {
  if (!categoryId) {
    return null;
  }

  const category = await prisma.category.findFirst({
    where: {
      id: categoryId,
      tenantId,
    },
    select: {
      id: true,
    },
  });

  if (!category) {
    throw new Error("Category not found.");
  }

  return category.id;
}

async function createUniqueAlbumSlug(tenantId: string, value: string) {
  const baseSlug = slugify(value) || "gallery";
  let slug = baseSlug;
  let suffix = 2;

  while (
    await prisma.album.findUnique({
      where: { tenantId_slug: { tenantId, slug } },
      select: { id: true },
    })
  ) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return slug;
}

function normalizeOptional(value: FormDataEntryValue | null) {
  const normalized = String(value ?? "").trim();
  return normalized && normalized !== "none" ? normalized : undefined;
}

function revalidateGalleryPaths(slug: string) {
  revalidateTenantPublic(slug);
  revalidateTenantDashboard(slug);
}
