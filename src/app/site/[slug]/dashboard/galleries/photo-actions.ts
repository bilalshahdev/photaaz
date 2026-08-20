"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { revalidateTenantDashboard, revalidateTenantPublic } from "@/lib/cache";
import { prisma } from "@/lib/db/prisma";
import { deleteLocalUpload, saveTenantImageUpload } from "@/services/storage/local-upload";
import { assertCategoryRequestLimit, assertGalleryPhotoLimit, assertPhotoCategoryLimit, assertPhotoUploadLimits } from "@/services/subscription/plan-limits";
import { requireTenantOwner } from "@/services/auth/tenant-authorization";
import { deleteCloudinaryAsset, readUploadedCloudinaryAsset } from "@/services/storage/direct-cloudinary-upload";

const photoSchema = z.object({
  tenantSlug: z.string().min(1),
  categoryId: z.string().min(1),
  albumId: z.string().optional(),
  title: z.string().trim().min(2),
  rightsConfirmed: z.literal("on")
});

const photoUpdateSchema = z.object({
  tenantSlug: z.string().min(1),
  photoId: z.string().min(1),
  categoryId: z.string().min(1),
  albumId: z.string().optional(),
  title: z.string().trim().min(2)
});

const photoDeleteSchema = z.object({
  tenantSlug: z.string().min(1),
  photoId: z.string().min(1)
});

const categoryRequestSchema = z.object({
  tenantSlug: z.string().min(1),
  parentSlug: z.string().optional(),
  name: z.string().trim().min(2),
  note: z.string().trim().optional()
});

export async function createCustomerPhoto(formData: FormData) {
  const parsed = photoSchema.parse({
    tenantSlug: String(formData.get("tenantSlug") ?? ""),
    categoryId: String(formData.get("categoryId") ?? ""),
    albumId: normalizeOptionalSelect(formData.get("albumId")),
    title: String(formData.get("title") ?? ""),
    rightsConfirmed: String(formData.get("rightsConfirmed") ?? "")
  });
  const imageFile = formData.get("imageFile");
  const tenant = await requireTenantOwner(parsed.tenantSlug);

  const category = await prisma.category.findFirst({
    where: {
      id: parsed.categoryId,
      tenantId: tenant.id
    },
    include: {
      children: {
        select: {
          id: true
        }
      }
    }
  });

  if (!category) {
    throw new Error("Category not found.");
  }

  if (category.children.length > 0) {
    throw new Error("Choose a subcategory before uploading a photo.");
  }

  const albumId = await getTenantAlbumId(tenant.id, parsed.albumId);
  await assertPhotoUploadLimits(parsed.tenantSlug, category.id);
  if (albumId) {
    await assertGalleryPhotoLimit(parsed.tenantSlug, albumId);
  }
  const headerStore = await headers();
  const upload = readUploadedCloudinaryAsset(formData, "imageFile", parsed.tenantSlug) ??
    (imageFile instanceof File ? await saveTenantImageUpload(imageFile, parsed.tenantSlug, { area: "photos", fileLabel: parsed.title }) : null);
  if (!upload) throw new Error("Choose an image to upload.");

  await prisma.photo.create({
    data: {
      tenantId: tenant.id,
      categoryId: category.id,
      albumId,
      title: parsed.title,
      alt: parsed.title,
      cloudinaryId: upload.storageId,
      secureUrl: upload.publicPath,
      moderationStatus: "PENDING",
      rightsConfirmed: true,
      rightsAcceptedAt: new Date(),
      uploadIp: headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ?? headerStore.get("x-real-ip"),
      uploadUserAgent: headerStore.get("user-agent")
    }
  });

  revalidateTenantPublic(parsed.tenantSlug);
  revalidateTenantDashboard(parsed.tenantSlug);
}

export async function updateCustomerPhoto(formData: FormData) {
  const parsed = photoUpdateSchema.parse({
    tenantSlug: String(formData.get("tenantSlug") ?? ""),
    photoId: String(formData.get("photoId") ?? ""),
    categoryId: String(formData.get("categoryId") ?? ""),
    albumId: normalizeOptionalSelect(formData.get("albumId")),
    title: String(formData.get("title") ?? "")
  });

  const tenant = await requireTenantOwner(parsed.tenantSlug);

  const category = await prisma.category.findFirst({
    where: {
      id: parsed.categoryId,
      tenantId: tenant.id
    },
    include: {
      children: {
        select: {
          id: true
        }
      }
    }
  });

  if (!category) {
    throw new Error("Category not found.");
  }

  if (category.children.length > 0) {
    throw new Error("Choose a subcategory before assigning a photo.");
  }

  const albumId = await getTenantAlbumId(tenant.id, parsed.albumId);
  await assertPhotoCategoryLimit(
    parsed.tenantSlug,
    category.id,
    parsed.photoId,
  );
  if (albumId) {
    await assertGalleryPhotoLimit(parsed.tenantSlug, albumId, parsed.photoId);
  }

  await prisma.photo.update({
    where: {
      id: parsed.photoId,
      tenantId: tenant.id
    },
    data: {
      title: parsed.title,
      alt: parsed.title,
      categoryId: category.id,
      albumId
    }
  });

  revalidateTenantPublic(parsed.tenantSlug);
  revalidateTenantDashboard(parsed.tenantSlug);
}

export async function deleteCustomerPhoto(formData: FormData) {
  const parsed = photoDeleteSchema.parse({
    tenantSlug: String(formData.get("tenantSlug") ?? ""),
    photoId: String(formData.get("photoId") ?? "")
  });

  const tenant = await requireTenantOwner(parsed.tenantSlug);

  const photo = await prisma.photo.findFirst({
    where: {
      id: parsed.photoId,
      tenantId: tenant.id
    },
    select: {
      id: true,
      secureUrl: true,
      cloudinaryId: true
    }
  });

  if (!photo) {
    throw new Error("Photo not found.");
  }

  await prisma.photo.delete({
    where: {
      id: photo.id
    }
  });
  await deleteLocalUpload(photo.secureUrl);
  await deleteCloudinaryAsset(photo.cloudinaryId);

  revalidateTenantPublic(parsed.tenantSlug);
  revalidateTenantDashboard(parsed.tenantSlug);
}

export async function requestCustomerCategory(formData: FormData) {
  const parsed = categoryRequestSchema.parse({
    tenantSlug: String(formData.get("tenantSlug") ?? ""),
    parentSlug: normalizeEmptySelect(formData.get("parentSlug")),
    name: String(formData.get("name") ?? ""),
    note: String(formData.get("note") ?? "")
  });
  const imageFile = formData.get("imageFile");

  const authorizedTenant = await requireTenantOwner(parsed.tenantSlug);
  const tenant = await prisma.tenant.findUnique({
    where: { id: authorizedTenant.id },
    include: {
      subscription: {
        include: {
          plan: true
        }
      }
    }
  });

  if (!tenant) {
    throw new Error("Tenant not found.");
  }

  await assertCategoryRequestLimit(parsed.tenantSlug);

  const parentType = parsed.parentSlug
    ? await prisma.platformPhotographyType.findUnique({
        where: { slug: parsed.parentSlug },
        select: { id: true }
      })
    : null;

  if (parsed.parentSlug && !parentType) {
    throw new Error("Parent category not found.");
  }

  const slug = slugify(parsed.parentSlug ? `${parsed.parentSlug}-${parsed.name}` : parsed.name);
  const directUpload = readUploadedCloudinaryAsset(formData, "imageFile", parsed.tenantSlug);
  const image = directUpload?.publicPath ?? (imageFile instanceof File && imageFile.size > 0
      ? (await saveTenantImageUpload(imageFile, parsed.tenantSlug, { area: "categories", fileLabel: parsed.name })).publicPath
      : "");

  await prisma.platformCategoryRequest.create({
    data: {
      tenantId: tenant.id,
      parentTypeId: parentType?.id,
      name: parsed.name,
      slug,
      image,
      note: parsed.note
    }
  });

  revalidateTenantDashboard(parsed.tenantSlug);
}

function slugify(value: string) {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "category"
  );
}

function normalizeEmptySelect(value: FormDataEntryValue | null) {
  const normalized = String(value ?? "");
  return normalized === "none" ? "" : normalized;
}

function normalizeOptionalSelect(value: FormDataEntryValue | null) {
  const normalized = String(value ?? "").trim();
  return normalized && normalized !== "none" ? normalized : undefined;
}

async function getTenantAlbumId(tenantId: string, albumId?: string) {
  if (!albumId) {
    return null;
  }

  const album = await prisma.album.findFirst({
    where: {
      id: albumId,
      tenantId
    },
    select: {
      id: true
    }
  });

  if (!album) {
    throw new Error("Gallery not found.");
  }

  return album.id;
}
