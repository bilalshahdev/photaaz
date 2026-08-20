"use server";

import { revalidatePath } from "next/cache";
import { locales } from "@/i18n/locales";
import { z } from "zod";
import { revalidateTenantDashboard, revalidateTenantPublic } from "@/lib/cache";
import { prisma } from "@/lib/db/prisma";
import { assertCategoryLinkLimit } from "@/services/subscription/plan-limits";
import { requireTenantOwner } from "@/services/auth/tenant-authorization";

const linkCategorySchema = z.object({
  tenantSlug: z.string().min(1),
  platformSlug: z.string().min(1),
});

const unlinkCategorySchema = z.object({
  tenantSlug: z.string().min(1),
  categoryId: z.string().min(1),
});

export async function linkCustomerCategory(formData: FormData) {
  const parsed = linkCategorySchema.parse({
    tenantSlug: String(formData.get("tenantSlug") ?? ""),
    platformSlug: String(formData.get("platformSlug") ?? ""),
  });
  const authorizedTenant = await requireTenantOwner(parsed.tenantSlug);

  const [tenant, platformType] = await Promise.all([
    prisma.tenant.findFirst({
      where: { id: authorizedTenant.id, slug: parsed.tenantSlug },
      select: { id: true, slug: true },
    }),
    prisma.platformPhotographyType.findUnique({
      where: { slug: parsed.platformSlug },
      include: {
        parent: true,
        children: {
          where: { enabled: true },
          orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
        },
      },
    }),
  ]);

  if (!tenant) {
    throw new Error("Tenant not found.");
  }

  if (!platformType || !platformType.enabled) {
    throw new Error("Category is not available.");
  }

  if (!platformType.parent && platformType.children.length > 0) {
    throw new Error("Choose one of this category's subcategories instead.");
  }

  await assertCategoryLinkLimit(parsed.tenantSlug, parsed.platformSlug);

  if (platformType.parent) {
    const parent = await upsertTenantCategory({
      tenantId: tenant.id,
      name: platformType.parent.name,
      slug: platformType.parent.slug,
      image: platformType.parent.image,
    });

    await upsertTenantCategory({
      tenantId: tenant.id,
      parentId: parent.id,
      name: platformType.name,
      slug: platformType.slug,
      image: platformType.image,
    });

    revalidateCategoryPaths(tenant.slug);
    return;
  }

  await upsertTenantCategory({
    tenantId: tenant.id,
    name: platformType.name,
    slug: platformType.slug,
    image: platformType.image,
  });

  revalidateCategoryPaths(tenant.slug);
}

export async function unlinkCustomerCategory(formData: FormData) {
  const parsed = unlinkCategorySchema.parse({
    tenantSlug: String(formData.get("tenantSlug") ?? ""),
    categoryId: String(formData.get("categoryId") ?? ""),
  });
  const authorizedTenant = await requireTenantOwner(parsed.tenantSlug);

  const tenant = await prisma.tenant.findFirst({
    where: { id: authorizedTenant.id, slug: parsed.tenantSlug },
    select: { id: true, slug: true },
  });

  if (!tenant) {
    throw new Error("Tenant not found.");
  }

  await prisma.category.deleteMany({
    where: {
      id: parsed.categoryId,
      tenantId: tenant.id,
    },
  });

  revalidateCategoryPaths(tenant.slug);
}

async function upsertTenantCategory({
  tenantId,
  parentId = null,
  name,
  slug,
  image,
}: {
  tenantId: string;
  parentId?: string | null;
  name: string;
  slug: string;
  image: string;
}) {
  return prisma.category.upsert({
    where: {
      tenantId_slug: {
        tenantId,
        slug,
      },
    },
    create: {
      tenantId,
      parentId,
      name,
      slug,
      image,
    },
    update: {
      parentId,
      name,
      image,
    },
    select: {
      id: true,
    },
  });
}

function revalidateCategoryPaths(slug: string) {
  revalidatePath(`/site/${slug}/dashboard/categories`);
  for (const locale of locales) {
    revalidatePath(`/${locale}/site/${slug}/dashboard/categories`);
  }
  revalidateTenantDashboard(slug);
  revalidateTenantPublic(slug);
}
