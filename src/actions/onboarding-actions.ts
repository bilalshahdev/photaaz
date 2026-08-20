"use server";

import { headers } from "next/headers";
import { prisma } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/server";
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

export async function publishOnboardingDraft(
  draft: unknown,
): Promise<PublishOnboardingResult> {
  const result = onboardingSchema.safeParse(draft);

  if (!result.success) {
    return {
      ok: false,
      error:
        result.error.errors[0]?.message ??
        "Please complete the required fields.",
    };
  }

  const data = result.data;
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id || !session.user.email) {
    return {
      ok: false,
      error: "Sign in before publishing your website.",
    };
  }

  if (data.email.trim().toLowerCase() !== session.user.email.toLowerCase()) {
    return {
      ok: false,
      error: "Use the email address connected to your signed-in account.",
    };
  }
  const existingTenant = await prisma.tenant.findUnique({
    where: {
      slug: data.subdomain,
    },
    select: {
      id: true,
    },
  });

  if (existingTenant) {
    return {
      ok: false,
      error: "This subdomain is already taken. Choose another one.",
    };
  }

  const owner = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true },
  });

  if (!owner) {
    return {
      ok: false,
      error: "Your signed-in account could not be verified.",
    };
  }

  await createTenantForOwner({
    ownerUserId: owner.id,
    studioName: data.studioName,
    slug: data.subdomain,
    themeKey: data.theme,
    categories: data.categories,
    primaryType: data.primaryType,
    photoMode: data.photoMode,
  });

  return {
    ok: true,
    slug: data.subdomain,
  };
}
