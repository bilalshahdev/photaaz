import assert from "node:assert/strict";
import crypto from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { verifyPaddleWebhookSignatureWithSecret } from "../../src/lib/paddle/webhook-signature";
import { getEffectivePlanKey, getSubscriptionLifecycle } from "../../src/services/subscription/lifecycle-policy";
import { mapPaddleSubscriptionStatus } from "../../src/services/subscription/paddle-status-policy";

function signature(body: string, secret: string, timestamp: number) {
  const h1 = crypto.createHmac("sha256", secret).update(`${timestamp}:${body}`).digest("hex");
  return `ts=${timestamp};h1=${h1}`;
}

test("Paddle signatures accept authentic bodies and reject missing, invalid, tampered, future, and stale deliveries", () => {
  const body = JSON.stringify({ event_id: "evt_1", event_type: "transaction.completed" });
  const secret = "test_webhook_secret";
  const now = 1_800_000_000;
  const header = signature(body, secret, now);
  assert.equal(verifyPaddleWebhookSignatureWithSecret(body, header, secret, { nowSeconds: now }), true);
  assert.equal(verifyPaddleWebhookSignatureWithSecret(body, null, secret, { nowSeconds: now }), false);
  assert.equal(verifyPaddleWebhookSignatureWithSecret(body, header, "wrong", { nowSeconds: now }), false);
  assert.equal(verifyPaddleWebhookSignatureWithSecret(`${body} `, header, secret, { nowSeconds: now }), false);
  assert.equal(verifyPaddleWebhookSignatureWithSecret(body, signature(body, secret, now - 301), secret, { nowSeconds: now }), false);
  assert.equal(verifyPaddleWebhookSignatureWithSecret(body, signature(body, secret, now + 301), secret, { nowSeconds: now }), false);
});

test("subscription lifecycle preserves paid access through exact grace boundaries then falls back to Free", () => {
  const originalNow = Date.now;
  Date.now = () => Date.UTC(2030, 0, 20, 12);
  try {
    const input = (daysAgo: number, gracePeriodDays: number) => ({
      status: "PAST_DUE" as const,
      currentPeriodEnds: new Date(Date.now() - daysAgo * 86_400_000),
      plan: { key: gracePeriodDays === 7 ? "plus" : "pro", gracePeriodDays },
    });
    assert.equal(getEffectivePlanKey(input(7, 7)), "plus");
    assert.equal(getSubscriptionLifecycle(input(7, 7)).isUsable, true);
    assert.equal(getEffectivePlanKey(input(8, 7)), "free");
    assert.equal(getEffectivePlanKey(input(14, 14)), "pro");
    assert.equal(getEffectivePlanKey(input(15, 14)), "free");
    assert.equal(getEffectivePlanKey({ status: "CANCELED", currentPeriodEnds: null, plan: { key: "pro", gracePeriodDays: 14 } }), "free");
    assert.equal(getEffectivePlanKey({ status: "ACTIVE", currentPeriodEnds: null, plan: { key: "ownership", gracePeriodDays: 0 } }), "ownership");
  } finally {
    Date.now = originalNow;
  }
});

test("Paddle subscription events map to safe internal lifecycle states", () => {
  assert.equal(mapPaddleSubscriptionStatus("active", "subscription.updated"), "ACTIVE");
  assert.equal(mapPaddleSubscriptionStatus("trialing", "subscription.updated"), "TRIALING");
  assert.equal(mapPaddleSubscriptionStatus("past_due", "subscription.updated"), "PAST_DUE");
  assert.equal(mapPaddleSubscriptionStatus("paused", "subscription.updated"), "PAST_DUE");
  assert.equal(mapPaddleSubscriptionStatus("canceled", "subscription.updated"), "CANCELED");
  assert.equal(mapPaddleSubscriptionStatus("active", "subscription.canceled"), "CANCELED");
});

test("billing writes are tenant-scoped and duplicate deliveries converge on unique upserts", () => {
  const provisioning = readFileSync(path.join(process.cwd(), "src/services/subscription/paddle-provisioning.ts"), "utf8");
  const schema = readFileSync(path.join(process.cwd(), "prisma/schema.prisma"), "utf8");
  assert.match(provisioning, /customData\.tenantSlug !== expectedTenantSlug/);
  assert.match(provisioning, /prisma\.subscription\.upsert\([\s\S]*?tenantId: tenant\.id/);
  assert.match(provisioning, /prisma\.subscription\.update\([\s\S]*?tenantId: existingSubscription\.tenantId/);
  assert.match(schema, /tenantId\s+String\s+@unique/);
  assert.match(schema, /paddleSubscriptionId\s+String\?\s+@unique/);
  assert.match(schema, /paddleTransactionId\s+String\?\s+@unique/);
});

test("webhook rejects signatures before parsing or applying any event", () => {
  const route = readFileSync(path.join(process.cwd(), "src/app/api/paddle/webhook/route.ts"), "utf8");
  assert.ok(route.indexOf("verifyPaddleWebhookSignature") < route.indexOf("JSON.parse"));
  assert.ok(route.indexOf("JSON.parse") < route.indexOf("handlePaddleEvent(event)"));
});
