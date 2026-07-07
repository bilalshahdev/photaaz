"use server";

import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/db/prisma";
import { onboardingSchema } from "@/lib/onboarding-validation";
import { createTenantForOwner } from "@/services/tenant/create-tenant";

type PublishOnboardingResult =
  | {
      ok: true;
      slug: string;
    }
  | {
      ok: false;
      error: string;
    };

export async function publishOnboardingDraft(draft: unknown): Promise<PublishOnboardingResult> {
  const result = onboardingSchema.safeParse(draft);

  if (!result.success) {
    return {
      ok: false,
      error: result.error.errors[0]?.message ?? "Please complete the required fields."
    };
  }

  const data = result.data;
  const existingTenant = await prisma.tenant.findUnique({
    where: {
      slug: data.subdomain
    },
    select: {
      id: true
    }
  });

  if (existingTenant) {
    return {
      ok: false,
      error: "This subdomain is already taken. Choose another one."
    };
  }

  const owner = await prisma.user.upsert({
    where: {
      email: data.email
    },
    update: {
      name: data.studioName
    },
    create: {
      id: randomUUID(),
      name: data.studioName,
      email: data.email
    }
  });

  await createTenantForOwner({
    ownerUserId: owner.id,
    studioName: data.studioName,
    slug: data.subdomain,
    themeKey: data.theme,
    categories: data.categories,
    primaryType: data.primaryType,
    photoMode: data.photoMode
  });

  return {
    ok: true,
    slug: data.subdomain
  };
}
