import type { SubscriptionStatus } from "@prisma/client";

export function mapPaddleSubscriptionStatus(status: string | null, eventType: string): SubscriptionStatus {
  if (eventType === "subscription.canceled") return "CANCELED";
  if (status === "active") return "ACTIVE";
  if (status === "trialing") return "TRIALING";
  if (status === "past_due" || status === "paused") return "PAST_DUE";
  if (status === "canceled") return "CANCELED";
  return "ACTIVE";
}
