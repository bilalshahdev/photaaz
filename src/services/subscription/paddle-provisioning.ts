import { revalidatePath } from "next/cache";
import { mapPaddleSubscriptionStatus } from "@/services/subscription/paddle-status-policy";
export { mapPaddleSubscriptionStatus } from "@/services/subscription/paddle-status-policy";
import { prisma } from "@/lib/db/prisma";
import { customerDashboardPath } from "@/config/routes";
import {
  getPaddleSubscription,
  getPaddleTransaction,
  type PaddleSubscriptionData
} from "@/lib/paddle/client";

type PaddleCustomData = {
  tenantSlug?: string;
  planKey?: string;
  billingInterval?: string;
};

type PaddleSyncResult =
  | { ok: true; synced: true; tenantSlug: string; planKey: string }
  | { ok: true; synced: false; reason: string }
  | { ok: false; message: string };

type PaddleProvisioningOptions = {
  revalidate?: boolean;
  subscription?: PaddleSubscriptionData | null;
};

const COMPLETED_TRANSACTION_STATUSES = new Set(["completed", "paid", "billed"]);

export async function syncPaddleCheckoutTransaction(
  transactionId: string,
  expectedTenantSlug: string,
  options: PaddleProvisioningOptions = {}
): Promise<PaddleSyncResult> {
  try {
    const transaction = await getPaddleTransaction(transactionId);
    const subscription = await getLinkedPaddleSubscription(transaction);

    if (!isCompletedTransaction(transaction.status)) {
      return {
        ok: true,
        synced: false,
        reason: `Paddle transaction is ${transaction.status ?? "not completed"}.`
      };
    }

    const customData = readCustomData(transaction, subscription);

    if (customData.tenantSlug !== expectedTenantSlug) {
      return {
        ok: false,
        message: "This Paddle transaction does not belong to this portfolio."
      };
    }

    const result = await activateSubscriptionFromPaddleTransaction(transaction, {
      ...options,
      subscription
    });

    return result
      ? {
          ok: true,
          synced: true,
          tenantSlug: result.tenantSlug,
          planKey: result.planKey
        }
      : {
          ok: false,
          message: "Could not apply this Paddle transaction."
        };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Could not verify Paddle checkout."
    };
  }
}

export async function activateSubscriptionFromPaddleTransaction(
  data: Record<string, unknown>,
  options: PaddleProvisioningOptions = {}
) {
  const linkedSubscription = options.subscription ?? (await getLinkedPaddleSubscription(data));
  const customData = readCustomData(data, linkedSubscription);
  const tenantSlug = customData.tenantSlug;
  const planKey = customData.planKey;
  const priceId = readFirstItemPriceId(data) ?? readFirstItemPriceId(linkedSubscription ?? {});

  if (!tenantSlug) return null;

  const [tenant, plan] = await Promise.all([
    prisma.tenant.findUnique({ where: { slug: tenantSlug } }),
    planKey ? prisma.plan.findUnique({ where: { key: planKey } }) : findPlanByPaddlePriceId(priceId)
  ]);

  if (!tenant || !plan) return null;

  const subscriptionId = readString(data.subscription_id) ?? readString(linkedSubscription?.id);
  const transactionId = readString(data.id);
  const customerId = readString(data.customer_id) ?? readString(linkedSubscription?.customer_id);
  const currentPeriodEnds =
    readDateFromPath(linkedSubscription ?? {}, ["current_billing_period", "ends_at"]) ??
    readDate(linkedSubscription?.next_billed_at) ??
    readDate(data.billing_period_ends_at) ??
    readDate(data.next_billed_at);
  const paddleStatus = readString(linkedSubscription?.status) ?? readString(data.status) ?? "transaction.completed";

  await prisma.subscription.upsert({
    where: {
      tenantId: tenant.id
    },
    update: {
      planId: plan.id,
      status: "ACTIVE",
      paddleCustomerId: customerId ?? undefined,
      paddleSubscriptionId: subscriptionId ?? undefined,
      paddleTransactionId: transactionId ?? undefined,
      paddlePriceId: priceId ?? undefined,
      paddleStatus,
      currentPeriodEnds,
      cancelAtPeriodEnd: Boolean(linkedSubscription?.cancel_at_period_end)
    },
    create: {
      tenantId: tenant.id,
      planId: plan.id,
      status: "ACTIVE",
      paddleCustomerId: customerId,
      paddleSubscriptionId: subscriptionId,
      paddleTransactionId: transactionId,
      paddlePriceId: priceId,
      paddleStatus,
      currentPeriodEnds,
      cancelAtPeriodEnd: Boolean(linkedSubscription?.cancel_at_period_end)
    }
  });

  if (options.revalidate !== false) {
    safeRevalidateTenantPaths(tenant.slug);
  }

  return {
    tenantSlug: tenant.slug,
    planKey: plan.key
  };
}

export async function updateSubscriptionFromPaddleSubscription(
  eventType: string,
  data: Record<string, unknown>,
  options: PaddleProvisioningOptions = {}
) {
  const paddleSubscriptionId = readString(data.id);
  const customData = readCustomData(data);
  const tenantSlug = customData.tenantSlug;
  const planKey = customData.planKey;
  const priceId = readFirstItemPriceId(data);
  const customerId = readString(data.customer_id);
  const status = mapPaddleSubscriptionStatus(readString(data.status), eventType);
  const currentPeriodEnds = readDateFromPath(data, ["current_billing_period", "ends_at"]) ?? readDate(data.next_billed_at);

  let existingSubscription = paddleSubscriptionId
    ? await prisma.subscription.findFirst({
        where: {
          paddleSubscriptionId
        },
        include: {
          tenant: true
        }
      })
    : null;

  if (!existingSubscription && tenantSlug) {
    existingSubscription = await prisma.subscription.findFirst({
      where: {
        tenant: {
          slug: tenantSlug
        }
      },
      include: {
        tenant: true
      }
    });
  }

  if (!existingSubscription) return;

  const plan = planKey ? await prisma.plan.findUnique({ where: { key: planKey } }) : await findPlanByPaddlePriceId(priceId);

  await prisma.subscription.update({
    where: {
      tenantId: existingSubscription.tenantId
    },
    data: {
      planId: plan?.id ?? existingSubscription.planId,
      status,
      paddleCustomerId: customerId ?? undefined,
      paddleSubscriptionId: paddleSubscriptionId ?? undefined,
      paddlePriceId: priceId ?? undefined,
      paddleStatus: readString(data.status) ?? eventType,
      currentPeriodEnds,
      cancelAtPeriodEnd: Boolean(data.cancel_at_period_end)
    }
  });

  if (options.revalidate !== false) {
    safeRevalidateTenantPaths(existingSubscription.tenant.slug);
  }
}

function isCompletedTransaction(status: string | undefined) {
  return status ? COMPLETED_TRANSACTION_STATUSES.has(status) : false;
}

function readCustomData(...sources: Array<Record<string, unknown> | null | undefined>): PaddleCustomData {
  return sources.reduce<PaddleCustomData>((data, source) => {
    const value = source?.custom_data;
    return value && typeof value === "object" ? { ...data, ...(value as PaddleCustomData) } : data;
  }, {});
}

function readString(value: unknown) {
  return typeof value === "string" && value.length ? value : null;
}

function readDate(value: unknown) {
  const text = readString(value);
  if (!text) return null;
  const date = new Date(text);
  return Number.isNaN(date.getTime()) ? null : date;
}

function readDateFromPath(data: Record<string, unknown>, path: string[]) {
  let current: unknown = data;

  for (const segment of path) {
    if (!current || typeof current !== "object") return null;
    current = (current as Record<string, unknown>)[segment];
  }

  return readDate(current);
}

function readFirstItemPriceId(data: Record<string, unknown>) {
  const items = Array.isArray(data.items) ? data.items : [];
  const firstItem = items[0];

  if (!firstItem || typeof firstItem !== "object") return null;

  const price = (firstItem as Record<string, unknown>).price;
  if (!price || typeof price !== "object") return null;

  return readString((price as Record<string, unknown>).id);
}

async function getLinkedPaddleSubscription(data: Record<string, unknown>) {
  const subscriptionId = readString(data.subscription_id);

  if (!subscriptionId) return null;

  try {
    return await getPaddleSubscription(subscriptionId);
  } catch (error) {
    console.warn("Could not fetch linked Paddle subscription:", error instanceof Error ? error.message : error);
    return null;
  }
}

async function findPlanByPaddlePriceId(priceId: string | null) {
  if (!priceId) return null;

  return prisma.plan.findFirst({
    where: {
      OR: [
        { paddleMonthlyPriceId: priceId },
        { paddleAnnualPriceId: priceId },
        { paddleLifetimePriceId: priceId }
      ]
    }
  });
}

function revalidateTenantPaths(slug: string) {
  revalidatePath(customerDashboardPath(slug, "/package"));
  revalidatePath(customerDashboardPath(slug, "/"));
  revalidatePath(`/site/${slug}`);
  revalidatePath("/");
}

function safeRevalidateTenantPaths(slug: string) {
  try {
    revalidateTenantPaths(slug);
  } catch (error) {
    console.error("Paddle subscription synced, but cache revalidation failed:", error);
  }
}
