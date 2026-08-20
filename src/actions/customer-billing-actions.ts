"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { prisma } from "@/lib/db/prisma";
import { env } from "@/lib/env";
import {
  createPaddleCheckoutTransaction,
  type PaddleBillingInterval,
} from "@/lib/paddle/client";
import { customerDashboardPath } from "@/config/routes";
import { requireTenantOwner } from "@/services/auth/tenant-authorization";

const checkoutSchema = z.object({
  tenantSlug: z.string().min(1),
  planKey: z.string().min(1),
  billingInterval: z.enum(["monthly", "annual", "lifetime"]),
});

export async function startPlanCheckout(input: z.input<typeof checkoutSchema>) {
  try {
    const parsed = checkoutSchema.parse(input);
    const authorizedTenant = await requireTenantOwner(parsed.tenantSlug);
    const tenant = await prisma.tenant.findFirst({
      where: {
        id: authorizedTenant.id,
        slug: parsed.tenantSlug,
      },
      include: {
        owner: true,
        subscription: {
          include: {
            plan: true,
          },
        },
      },
    });

    if (!tenant) {
      return { ok: false, message: "Portfolio not found." };
    }

    const plan = await prisma.plan.findUnique({
      where: {
        key: parsed.planKey,
      },
    });

    if (!plan || !plan.enabled) {
      return { ok: false, message: "This package is not available." };
    }

    if (tenant.subscription?.plan.key === plan.key) {
      return { ok: false, message: "This package is already active." };
    }

    const priceId = getPaddlePriceId(plan, parsed.billingInterval);

    if (!priceId) {
      return {
        ok: false,
        message: "Checkout is not configured for this package yet.",
      };
    }

    const appUrl = await getCheckoutBaseUrl();
    const returnTo = `${appUrl}${customerDashboardPath(tenant.slug, "/package")}`;
    const checkoutReturnUrl = `${appUrl}/checkout/paddle/return?returnTo=${encodeURIComponent(returnTo)}`;
    const checkout = await tryCreateCheckout({
      priceId,
      tenantSlug: tenant.slug,
      planKey: plan.key,
      billingInterval: parsed.billingInterval,
      customer: {
        email: tenant.owner?.email,
        name: tenant.owner?.name ?? tenant.name,
      },
      successUrl: checkoutReturnUrl,
    });

    if (!checkout.ok) {
      return {
        ok: false,
        message: checkout.message,
      };
    }

    return {
      ok: true,
      transactionId: checkout.transactionId,
      returnTo: customerDashboardPath(tenant.slug, "/package"),
    };
  } catch (error) {
    return {
      ok: false,
      message: getCheckoutErrorMessage(error),
    };
  }
}

async function getCheckoutBaseUrl() {
  const headerStore = await headers();
  const forwardedHost = headerStore.get("x-forwarded-host");
  const host = headerStore.get("host");
  const forwardedProtocol = headerStore.get("x-forwarded-proto") ?? "https";
  const origin = headerStore.get("origin");

  if (isPublicCheckoutHost(forwardedHost)) {
    return `${forwardedProtocol}://${forwardedHost}`.replace(/\/$/, "");
  }

  if (isPublicCheckoutHost(host)) {
    return `${forwardedProtocol}://${host}`.replace(/\/$/, "");
  }

  if (origin) {
    return origin.replace(/\/$/, "");
  }

  if (forwardedHost) {
    return `${forwardedProtocol}://${forwardedHost}`.replace(/\/$/, "");
  }

  if (host) {
    const protocol = headerStore.get("x-forwarded-proto") ?? "http";

    return `${protocol}://${host}`.replace(/\/$/, "");
  }

  return env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
}

function isPublicCheckoutHost(host: string | null) {
  return Boolean(
    host && (host.endsWith(".trycloudflare.com") || host.endsWith(".loca.lt")),
  );
}

async function tryCreateCheckout(
  input: Parameters<typeof createPaddleCheckoutTransaction>[0],
) {
  try {
    const checkout = await createPaddleCheckoutTransaction(input);

    return {
      ok: true as const,
      transactionId: checkout.transactionId,
      checkoutUrl: checkout.checkoutUrl,
    };
  } catch (error) {
    return {
      ok: false as const,
      message: getCheckoutErrorMessage(error),
    };
  }
}

function getCheckoutErrorMessage(error: unknown) {
  if (error instanceof z.ZodError) {
    return "Invalid checkout request.";
  }

  const message =
    error instanceof Error ? error.message : "Could not start checkout.";

  if (message.toLowerCase().includes("default payment link")) {
    return "Paddle checkout is not ready yet. Set the default payment link in Paddle sandbox checkout settings, then try again.";
  }

  if (
    message
      .toLowerCase()
      .includes("does not contain a domain that has been approved")
  ) {
    return "Paddle rejected this checkout domain. Open this dashboard on the Paddle-approved public URL or update the default payment link in Paddle sandbox checkout settings.";
  }

  return message;
}

function getPaddlePriceId(
  plan: {
    paddleMonthlyPriceId: string | null;
    paddleAnnualPriceId: string | null;
    paddleLifetimePriceId: string | null;
  },
  interval: PaddleBillingInterval,
) {
  if (interval === "monthly") return plan.paddleMonthlyPriceId;
  if (interval === "annual") return plan.paddleAnnualPriceId;
  return plan.paddleLifetimePriceId;
}
