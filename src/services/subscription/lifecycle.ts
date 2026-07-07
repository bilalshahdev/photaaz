import { prisma } from "@/lib/db/prisma";
import type { SubscriptionStatus } from "@prisma/client";

const ACTIVE_STATUSES: SubscriptionStatus[] = ["ACTIVE", "TRIALING", "PAST_DUE"];

export type SubscriptionLifecycleState = {
  label: string;
  tone: "neutral" | "success" | "warning" | "danger";
  daysLeft: number | null;
  isUsable: boolean;
  isExpired: boolean;
  isExpiringSoon: boolean;
};

export function getSubscriptionLifecycle(input?: { status: SubscriptionStatus; currentPeriodEnds: Date | null; plan?: { gracePeriodDays?: number | null } } | null): SubscriptionLifecycleState {
  if (!input) {
    return {
      label: "No package",
      tone: "neutral",
      daysLeft: null,
      isUsable: false,
      isExpired: false,
      isExpiringSoon: false
    };
  }

  if (input.status === "CANCELED" || input.status === "EXPIRED") {
    return {
      label: input.status === "EXPIRED" ? "Expired" : "Canceled",
      tone: "danger",
      daysLeft: null,
      isUsable: false,
      isExpired: input.status === "EXPIRED",
      isExpiringSoon: false
    };
  }

  if (!input.currentPeriodEnds) {
    return {
      label: input.status === "PAST_DUE" ? "Past due" : "Active, no end date",
      tone: input.status === "PAST_DUE" ? "warning" : "success",
      daysLeft: null,
      isUsable: input.status !== "PAST_DUE",
      isExpired: false,
      isExpiringSoon: false
    };
  }

  const daysLeft = Math.ceil((input.currentPeriodEnds.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  if (daysLeft < 0) {
    const gracePeriodDays = Math.max(0, input.plan?.gracePeriodDays ?? 0);
    const daysOverdue = Math.abs(daysLeft);

    if (gracePeriodDays > 0 && daysOverdue <= gracePeriodDays) {
      const graceDaysLeft = gracePeriodDays - daysOverdue;

      return {
        label: graceDaysLeft === 0 ? "Grace period ends today" : `${graceDaysLeft} grace day${graceDaysLeft === 1 ? "" : "s"} left`,
        tone: "warning",
        daysLeft,
        isUsable: true,
        isExpired: false,
        isExpiringSoon: true
      };
    }

    return {
      label: `Ended ${Math.abs(daysLeft)} day${Math.abs(daysLeft) === 1 ? "" : "s"} ago`,
      tone: "danger",
      daysLeft,
      isUsable: false,
      isExpired: true,
      isExpiringSoon: false
    };
  }

  if (daysLeft <= 7) {
    return {
      label: `${daysLeft} day${daysLeft === 1 ? "" : "s"} left`,
      tone: "warning",
      daysLeft,
      isUsable: true,
      isExpired: false,
      isExpiringSoon: true
    };
  }

  return {
    label: `${daysLeft} days left`,
    tone: "success",
    daysLeft,
    isUsable: true,
    isExpired: false,
    isExpiringSoon: false
  };
}

export function getEffectivePlanKey(input?: { status: SubscriptionStatus; currentPeriodEnds: Date | null; plan: { key: string; gracePeriodDays?: number | null } } | null) {
  const lifecycle = getSubscriptionLifecycle(input);

  if (!input || !lifecycle.isUsable) {
    return "free";
  }

  return input.plan.key;
}

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
      plan: true
    }
  });

  for (const subscription of expiringSubscriptions) {
    const notificationWindowStart = new Date(subscription.currentPeriodEnds ?? now);
    notificationWindowStart.setDate(notificationWindowStart.getDate() - 7);
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
          body: `Your ${subscription.plan.name} package ends on ${(subscription.currentPeriodEnds ?? now).toLocaleDateString("en-US")}. Please renew or contact support if you need help.`,
          channel: "dashboard"
        }
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
      tenant: true
    }
  });

  const expiredSubscriptions = overdueSubscriptions.filter((subscription) => getSubscriptionLifecycle(subscription).isExpired);

  for (const subscription of expiredSubscriptions) {
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
                body: `Your ${subscription.plan.name} package has ended. Contact support or renew your package to continue using paid features.`,
                channel: "dashboard"
              }
            })
          ])
    ]);
  }

  const graceSubscriptions = overdueSubscriptions.filter((subscription) => {
    const lifecycle = getSubscriptionLifecycle(subscription);

    return lifecycle.isUsable && lifecycle.tone === "warning";
  });

  for (const subscription of graceSubscriptions) {
    const lifecycle = getSubscriptionLifecycle(subscription);
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
          body: `Your ${subscription.plan.name} package is past its renewal date. ${lifecycle.label}. Renew or contact support to keep paid features active.`,
          channel: "dashboard"
        }
      });
    }
  }

  return {
    expired: expiredSubscriptions.length,
    expiringSoon: expiringSubscriptions.length
  };
}
