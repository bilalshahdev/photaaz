import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  adminCookieName,
  createAdminSession,
  getAdminCredentials,
  requireSuperAdmin,
} from "@/services/auth/admin-authorization";
import { enforceRateLimit, getRequestIdentity, RateLimitError } from "@/services/security/rate-limit";

export async function GET() {
  try {
    await requireSuperAdmin();
    return NextResponse.json({ authenticated: true });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
export async function POST(request: Request) {
  try {
    await enforceRateLimit({ scope: "admin-sign-in", identity: getRequestIdentity(request.headers), limit: 5, windowSeconds: 15 * 60 });
  } catch (error) {
    if (error instanceof RateLimitError) return NextResponse.json({ error: error.message }, { status: 429, headers: { "Retry-After": String(error.retryAfterSeconds) } });
    throw error;
  }
  const input = (await request.json()) as { email?: string; password?: string };
  const expected = getAdminCredentials();
  if (input.email !== expected.email || input.password !== expected.password)
    return NextResponse.json(
      { error: "Invalid super-admin credentials." },
      { status: 401 },
    );
  const session = createAdminSession(expected.email);
  (await cookies()).set(adminCookieName, session.value, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: session.maxAge,
  });
  return NextResponse.json({ authenticated: true });
}
export async function DELETE() {
  (await cookies()).delete(adminCookieName);
  return NextResponse.json({ authenticated: false });
}
