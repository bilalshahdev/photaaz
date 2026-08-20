import { prisma } from "@/lib/db/prisma";
import { sendEmail } from "@/services/email/email-service";
import type { SubscriptionStatus } from "@prisma/client";
import { getSubscriptionLifecycle, type SubscriptionLifecycleState } from "@/services/subscription/lifecycle-policy";
export { getEffectivePlanKey, getSubscriptionLifecycle, type SubscriptionLifecycleState } from "@/services/subscription/lifecycle-policy";

const ACTIVE_STATUSES: SubscriptionStatus[] = ["ACTIVE", "TRIALING", "PAST_DUE"];

export function formatSubscriptionDate(date: Date) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(date);
}

export function getSubscriptionTextClass(tone: SubscriptionLifecycleState["tone"]) {
  switch (tone) {
    case "success":
      return "text-teal-700";
    case "warning":
      return "text-amber-700";
    case "danger":
      return "text-red-700";
    default:
      return "text-slate-500";
  }
}

export function getSubscriptionBadgeClass(tone: SubscriptionLifecycleState["tone"]) {
  switch (tone) {
    case "success":
      return "border-teal-200 bg-teal-50 text-teal-800";
    case "warning":
      return "border-amber-200 bg-amber-50 text-amber-900";
    case "danger":
      return "border-red-200 bg-red-50 text-red-800";
    default:
      return "border-slate-200 bg-slate-50 text-slate-700";
  }
}

type LifecycleEmailSubscription = {
  tenant: {
    name: string;
    owner: {
      email: string;
      name: string;
    } | null;
  };
  plan: {
    name: string;
  };
};

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    switch (character) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&#039;";
      default:
        return character;
    }
  });
}

async function sendLifecycleEmail(input: {
  subscription: LifecycleEmailSubscription;
  subject: string;
  title: string;
  body: string;
}) {
  const ownerEmail = input.subscription.tenant.owner?.email;

  if (!ownerEmail) {
    return;
  }

  try {
    await sendEmail({
      to: ownerEmail,
      subject: input.subject,
      text: input.body,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
          <p style="font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase; color: #0f766e;">Photaaz</p>
          <h1 style="font-size: 24px; margin: 0 0 12px;">${escapeHtml(input.title)}</h1>
          <p>${escapeHtml(input.body)}</p>
        </div>
      `
    });
  } catch (error) {
    console.error("Subscription lifecycle email failed", error);
  }
}

export async function syncSubscriptionLifecycle() {
  const now = new Date();
  const expiringWindowEnd = new Date(now);
  expiringWindowEnd.setDate(expiringWindowEnd.getDate() + 7);
  const expiringSubscriptions = await prisma.subscription.findMany({
    where: {
      status: { in: ACTIVE_STATUSES },
      currentPeriodEnds: { gte: now, lte: expiringWindowEnd }
    },
    include: {
      plan: true,
      tenant: {
        include: {
          owner: true
        }
      }
    }
  });

  for (const subscription of expiringSubscriptions) {
    const notificationWindowStart = new Date(subscription.currentPeriodEnds ?? now);
    notificationWindowStart.setDate(notificationWindowStart.getDate() - 7);
    const body = `Your ${subscription.plan.name} package ends on ${(subscription.currentPeriodEnds ?? now).toLocaleDateString("en-US")}. Please renew or contact support if you need help.`;
    const existingNotification = await prisma.clientNotification.findFirst({
      where: {
        tenantId: subscription.tenantId,
        title: "Package ending soon",
        createdAt: { gte: notificationWindowStart }
      },
      select: { id: true }
    });

    if (!existingNotification) {
      await prisma.clientNotification.create({
        data: {
          tenantId: subscription.tenantId,
          title: "Package ending soon",
          body,
          channel: "dashboard"
        }
      });
      await sendLifecycleEmail({
        subscription,
        subject: "Your Photaaz package is ending soon",
        title: "Package ending soon",
        body
      });
    }
  }

  const overdueSubscriptions = await prisma.subscription.findMany({
    where: {
      status: { in: ACTIVE_STATUSES },
      currentPeriodEnds: { lt: now }
    },
    include: {
      plan: true,
      tenant: {
        include: {
          owner: true
        }
      }
    }
  });

  const expiredSubscriptions = overdueSubscriptions.filter((subscription) => getSubscriptionLifecycle(subscription).isExpired);

  for (const subscription of expiredSubscriptions) {
    const body = `Your ${subscription.plan.name} package has ended. Renew your package to continue using paid features. Your content is kept safely, but public access is limited to the Basic plan.`;
    const existingNotification = await prisma.clientNotification.findFirst({
      where: {
        tenantId: subscription.tenantId,
        title: "Package expired",
        createdAt: { gte: subscription.currentPeriodEnds ?? undefined }
      },
      select: { id: true }
    });

    await prisma.$transaction([
      prisma.subscription.update({
        where: { id: subscription.id },
        data: { status: "EXPIRED" }
      }),
      ...(existingNotification
        ? []
        : [
            prisma.clientNotification.create({
              data: {
                tenantId: subscription.tenantId,
                title: "Package expired",
                body,
                channel: "dashboard"
              }
            })
          ])
    ]);

    if (!existingNotification) {
      await sendLifecycleEmail({
        subscription,
        subject: "Your Photaaz package has expired",
        title: "Package expired",
        body
      });
    }
  }

  const graceSubscriptions = overdueSubscriptions.filter((subscription) => {
    const lifecycle = getSubscriptionLifecycle(subscription);

    return lifecycle.isUsable && lifecycle.tone === "warning";
  });

  for (const subscription of graceSubscriptions) {
    const lifecycle = getSubscriptionLifecycle(subscription);
    const body = `Your ${subscription.plan.name} package is past its renewal date. ${lifecycle.label}. Renew to keep paid features active.`;
    const existingNotification = await prisma.clientNotification.findFirst({
      where: {
        tenantId: subscription.tenantId,
        title: "Renewal grace period",
        createdAt: { gte: subscription.currentPeriodEnds ?? undefined }
      },
      select: { id: true }
    });

    if (!existingNotification) {
      await prisma.clientNotification.create({
        data: {
          tenantId: subscription.tenantId,
          title: "Renewal grace period",
          body,
          channel: "dashboard"
        }
      });
      await sendLifecycleEmail({
        subscription,
        subject: "Your Photaaz package is in grace period",
        title: "Renewal grace period",
        body
      });
    }
  }

  return {
    expired: expiredSubscriptions.length,
    expiringSoon: expiringSubscriptions.length
  };
}
