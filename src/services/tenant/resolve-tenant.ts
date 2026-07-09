import type { TenantContext } from "@/types/tenant";
import { env } from "@/lib/env";
import { isLocale } from "@/i18n/locales";
import { prisma } from "@/lib/db/prisma";
import { getEffectivePlanKey, syncSubscriptionLifecycle } from "@/services/subscription/lifecycle";

export async function resolveTenantFromHost(host: string): Promise<TenantContext | null> {
  const rootDomain = env.NEXT_PUBLIC_ROOT_DOMAIN;
  const normalizedHost = host.toLowerCase();

  if (normalizedHost === rootDomain) {
    return null;
  }

  const slug = normalizedHost.endsWith(`.${rootDomain}`)
    ? normalizedHost.replace(`.${rootDomain}`, "")
    : normalizedHost;

  if (!env.DATABASE_URL) {
    return {
      tenantId: "demo-tenant",
      slug,
      status: "ACTIVE",
      locale: "en",
      domain: normalizedHost,
      planKey: "free"
    };
  }

  await syncSubscriptionLifecycle();

  const tenant = await prisma.tenant.findFirst({
    where: {
      OR: [
        { slug },
        {
          domains: {
            some: {
              hostname: normalizedHost,
              status: "VERIFIED"
            }
          }
        }
      ]
    },
    include: {
      subscription: {
        include: {
          plan: true
        }
      }
    }
  });

  if (!tenant || tenant.status === "DELETED") {
    return null;
  }

  return {
    tenantId: tenant.id,
    slug: tenant.slug,
    status: tenant.status,
    locale: isLocale(tenant.defaultLocale) ? tenant.defaultLocale : "en",
    domain: normalizedHost,
    planKey: getEffectivePlanKey(tenant.subscription)
  };
}
