"use server";

import { z } from "zod";
import { revalidateTenantDashboard, revalidateTenantPublic } from "@/lib/cache";
import { prisma } from "@/lib/db/prisma";

const photoSchema = z.object({
  tenantSlug: z.string().min(1),
  categoryId: z.string().min(1),
  title: z.string().trim().min(2),
  imageUrl: z.string().url()
});

export async function createCustomerPhoto(formData: FormData) {
  const parsed = photoSchema.parse({
    tenantSlug: String(formData.get("tenantSlug") ?? ""),
    categoryId: String(formData.get("categoryId") ?? ""),
    title: String(formData.get("title") ?? ""),
    imageUrl: String(formData.get("imageUrl") ?? "")
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

  await prisma.photo.create({
    data: {
      tenantId: tenant.id,
      categoryId: category.id,
      title: parsed.title,
      alt: parsed.title,
      cloudinaryId: `manual/${tenant.id}/${Date.now()}`,
      secureUrl: parsed.imageUrl
    }
  });

  revalidateTenantPublic(parsed.tenantSlug);
  revalidateTenantDashboard(parsed.tenantSlug);
}
