import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { env } from "@/lib/env";

export const adminCookieName = "photaaz-admin-session";
const maxAge = 60 * 60 * 12;

export function getAdminCredentials() {
  if (env.SUPER_ADMIN_EMAIL && env.SUPER_ADMIN_PASSWORD)
    return { email: env.SUPER_ADMIN_EMAIL, password: env.SUPER_ADMIN_PASSWORD };
  if (env.NODE_ENV !== "production")
    return { email: "photaaz@admin.com", password: "admin@123" };
  throw new Error("Super-admin credentials are not configured.");
}
export function createAdminSession(email: string) {
  const expiresAt = Math.floor(Date.now() / 1000) + maxAge;
  const payload = Buffer.from(JSON.stringify({ email, expiresAt })).toString(
    "base64url",
  );
  return { value: `${payload}.${sign(payload)}`, maxAge };
}
export async function requireSuperAdmin() {
  const value = (await cookies()).get(adminCookieName)?.value;
  if (!value) throw new Error("Super-admin authentication required.");
  const [payload, supplied] = value.split(".");
  if (!payload || !supplied) throw new Error("Invalid super-admin session.");
  const expected = Buffer.from(sign(payload), "base64url");
  const received = Buffer.from(supplied, "base64url");
  if (
    expected.length !== received.length ||
    !timingSafeEqual(expected, received)
  )
    throw new Error("Invalid super-admin session.");
  const data = JSON.parse(
    Buffer.from(payload, "base64url").toString("utf8"),
  ) as { email: string; expiresAt: number };
  const credentials = getAdminCredentials();
  if (
    data.email !== credentials.email ||
    data.expiresAt < Math.floor(Date.now() / 1000)
  )
    throw new Error("Super-admin session expired.");
  return data;
}
function sign(payload: string) {
  if (!env.BETTER_AUTH_SECRET) {
    throw new Error("BETTER_AUTH_SECRET is required for super-admin sessions.");
  }
  return createHmac(
    "sha256",
    env.BETTER_AUTH_SECRET,
  )
    .update(payload)
    .digest("base64url");
}
