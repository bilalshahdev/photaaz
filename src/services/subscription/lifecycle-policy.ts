import type { SubscriptionStatus } from "@prisma/client";

export type SubscriptionLifecycleState = {
  label: string;
  tone: "neutral" | "success" | "warning" | "danger";
  daysLeft: number | null;
  isUsable: boolean;
  isExpired: boolean;
  isExpiringSoon: boolean;
};

export function getSubscriptionLifecycle(input?: { status: SubscriptionStatus; currentPeriodEnds: Date | null; plan?: { gracePeriodDays?: number | null } } | null): SubscriptionLifecycleState {
  if (!input) return { label: "No package", tone: "neutral", daysLeft: null, isUsable: false, isExpired: false, isExpiringSoon: false };
  if (input.status === "CANCELED" || input.status === "EXPIRED") return { label: input.status === "EXPIRED" ? "Expired" : "Canceled", tone: "danger", daysLeft: null, isUsable: false, isExpired: input.status === "EXPIRED", isExpiringSoon: false };
  if (!input.currentPeriodEnds) return { label: input.status === "PAST_DUE" ? "Past due" : "Active, no end date", tone: input.status === "PAST_DUE" ? "warning" : "success", daysLeft: null, isUsable: input.status !== "PAST_DUE", isExpired: false, isExpiringSoon: false };

  const daysLeft = Math.ceil((input.currentPeriodEnds.getTime() - Date.now()) / 86_400_000);
  if (daysLeft < 0) {
    const gracePeriodDays = Math.max(0, input.plan?.gracePeriodDays ?? 0);
    const daysOverdue = Math.abs(daysLeft);
    if (gracePeriodDays > 0 && daysOverdue <= gracePeriodDays) {
      const graceDaysLeft = gracePeriodDays - daysOverdue;
      return { label: graceDaysLeft === 0 ? "Grace period ends today" : `${graceDaysLeft} grace day${graceDaysLeft === 1 ? "" : "s"} left`, tone: "warning", daysLeft, isUsable: true, isExpired: false, isExpiringSoon: true };
    }
    return { label: `Ended ${daysOverdue} day${daysOverdue === 1 ? "" : "s"} ago`, tone: "danger", daysLeft, isUsable: false, isExpired: true, isExpiringSoon: false };
  }
  if (daysLeft <= 7) return { label: `${daysLeft} day${daysLeft === 1 ? "" : "s"} left`, tone: "warning", daysLeft, isUsable: true, isExpired: false, isExpiringSoon: true };
  return { label: `${daysLeft} days left`, tone: "success", daysLeft, isUsable: true, isExpired: false, isExpiringSoon: false };
}

export function getEffectivePlanKey(input?: { status: SubscriptionStatus; currentPeriodEnds: Date | null; plan: { key: string; gracePeriodDays?: number | null } } | null) {
  return input && getSubscriptionLifecycle(input).isUsable ? input.plan.key : "free";
}
