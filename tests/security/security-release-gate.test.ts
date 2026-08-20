import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { hasMatchingImageSignature } from "../../src/services/storage/local-upload";
import { prisma } from "../../src/lib/db/prisma";
import { enforceRateLimit, RateLimitError } from "../../src/services/security/rate-limit";

const read = (file: string) => readFileSync(path.join(process.cwd(), file), "utf8");

test("admin and tenant authorization are server-session and ownership based", () => {
  const admin = read("src/services/auth/admin-authorization.ts");
  const tenant = read("src/services/auth/tenant-authorization.ts");
  assert.match(admin, /cookies\(\)/);
  assert.match(admin, /timingSafeEqual/);
  assert.match(admin, /BETTER_AUTH_SECRET is required/);
  assert.doesNotMatch(admin, /localStorage/);
  assert.match(tenant, /auth\.api\.getSession/);
  assert.match(tenant, /ownerUserId: session\.user\.id/);
  assert.match(tenant, /status: "ACTIVE"/);
});

test("unknown and suspended tenants are deliberately hidden as 404", () => {
  const lookup = read("src/app/api/public/tenants/[slug]/route.ts");
  const proxy = read("src/proxy.ts");
  assert.match(lookup, /tenant\?\.status === "ACTIVE" \? 204 : 404/);
  assert.match(proxy, /NextResponse\.rewrite\(url, \{ status: 404 \}\)/);
});

test("cron and Paddle webhooks reject forged credentials before work", () => {
  const cron = read("src/app/api/cron/subscriptions/route.ts");
  const webhook = read("src/app/api/paddle/webhook/route.ts");
  assert.match(cron, /authorization === `Bearer \$\{secret\}`/);
  assert.doesNotMatch(cron, /searchParams\.get\("secret"\)/);
  assert.ok(webhook.indexOf("verifyPaddleWebhookSignature") < webhook.indexOf("JSON.parse"));
});

test("security-sensitive public endpoints have persistent database rate limits", () => {
  const schema = read("prisma/schema.prisma");
  assert.match(schema, /model SecurityRateLimitBucket/);
  for (const file of [
    "src/app/api/auth/[...all]/route.ts",
    "src/app/api/admin/session/route.ts",
    "src/app/api/uploads/cloudinary/sign/route.ts",
    "src/app/api/admin/uploads/cloudinary/sign/route.ts",
    "src/actions/support-actions.ts",
    "src/actions/tenant-inquiry-actions.ts",
    "src/app/checkout/paddle/return/route.ts",
  ]) assert.match(read(file), /enforce(?:ServerAction)?RateLimit/, file);
});

test("database rate limiter remains atomic under concurrent requests", async () => {
  const scope = `security-test-${crypto.randomUUID()}`;
  const attempts = await Promise.allSettled(
    Array.from({ length: 8 }, () => enforceRateLimit({ scope, identity: "same-client", limit: 3, windowSeconds: 60 })),
  );
  assert.equal(attempts.filter((result) => result.status === "fulfilled").length, 3);
  const rejected = attempts.filter((result): result is PromiseRejectedResult => result.status === "rejected");
  assert.equal(rejected.length, 5);
  assert.ok(rejected.every((result) => result.reason instanceof RateLimitError));
  await prisma.securityRateLimitBucket.deleteMany({ where: { scope } });
});

test("server upload validation rejects MIME spoofing using file signatures", () => {
  const png = Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const jpeg = Uint8Array.from([0xff, 0xd8, 0xff, 0xe0]);
  const gif = new TextEncoder().encode("GIF89a");
  const webp = Uint8Array.from([...new TextEncoder().encode("RIFF"), 0, 0, 0, 0, ...new TextEncoder().encode("WEBP")]);
  assert.equal(hasMatchingImageSignature(png, "image/png"), true);
  assert.equal(hasMatchingImageSignature(jpeg, "image/jpeg"), true);
  assert.equal(hasMatchingImageSignature(gif, "image/gif"), true);
  assert.equal(hasMatchingImageSignature(webp, "image/webp"), true);
  assert.equal(hasMatchingImageSignature(new TextEncoder().encode("<script>"), "image/png"), false);
  assert.equal(hasMatchingImageSignature(png, "image/jpeg"), false);
});

test("server environment secrets are not exposed through NEXT_PUBLIC names", () => {
  const env = read("src/lib/env.ts");
  for (const secret of ["BETTER_AUTH_SECRET", "SUPER_ADMIN_PASSWORD", "CLOUDINARY_API_SECRET", "SUPABASE_SERVICE_ROLE_KEY", "PADDLE_API_KEY", "PADDLE_WEBHOOK_SECRET", "RESEND_API_KEY", "SMTP_PASSWORD"]) {
    assert.doesNotMatch(env, new RegExp(`NEXT_PUBLIC_${secret}`));
  }
  const nextConfig = read("next.config.ts");
  assert.doesNotMatch(nextConfig, /BETTER_AUTH_SECRET|SUPER_ADMIN_PASSWORD|CLOUDINARY_API_SECRET|SUPABASE_SERVICE_ROLE_KEY|PADDLE_API_KEY|PADDLE_WEBHOOK_SECRET|RESEND_API_KEY|SMTP_PASSWORD/);
});
