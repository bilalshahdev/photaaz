import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth/server";
import { enforceRateLimit, getRequestIdentity, RateLimitError } from "@/services/security/rate-limit";
import { currentLegalVersions } from "@/config/legal";
import { prisma } from "@/lib/db/prisma";
import { createHash } from "node:crypto";

const handler = toNextJsHandler(auth.handler);
export const GET = handler.GET;
export async function POST(request: Request) {
  try {
    await enforceRateLimit({ scope: "account-auth", identity: getRequestIdentity(request.headers), limit: 10, windowSeconds: 15 * 60 });
  } catch (error) {
    if (error instanceof RateLimitError) return Response.json({ error: error.message }, { status: 429, headers: { "Retry-After": String(error.retryAfterSeconds) } });
    throw error;
  }
  const isSignUp = new URL(request.url).pathname.endsWith("/sign-up/email");
  const signUpInput = isSignUp ? await request.clone().json().catch(() => null) as Record<string, unknown> | null : null;
  const versions = signUpInput?.legalVersions as Record<string, unknown> | undefined;
  if (isSignUp && (signUpInput?.legalAccepted !== true || versions?.terms !== currentLegalVersions.terms || versions?.privacy !== currentLegalVersions.privacy)) {
    return Response.json({ message: "Current Terms and Privacy Policy must be accepted." }, { status: 400 });
  }
  const response = await handler.POST(request);
  if (isSignUp && response.ok && typeof signUpInput?.email === "string") {
    const user = await prisma.user.findUnique({ where: { email: signUpInput.email.toLowerCase() }, select: { id: true } });
    if (!user) return Response.json({ message: "Could not record legal acceptance." }, { status: 500 });
    const identity = getRequestIdentity(request.headers);
    await prisma.legalAcceptance.upsert({
      where: { userId_termsVersion_privacyVersion: { userId: user.id, termsVersion: currentLegalVersions.terms, privacyVersion: currentLegalVersions.privacy } },
      update: {},
      create: {
        userId: user.id,
        termsVersion: currentLegalVersions.terms,
        privacyVersion: currentLegalVersions.privacy,
        locale: typeof signUpInput.locale === "string" ? signUpInput.locale : "en",
        ipAddressHash: identity === "unknown" ? null : createHash("sha256").update(identity).digest("hex"),
        userAgent: request.headers.get("user-agent")?.slice(0, 500),
      },
    });
  }
  return response;
}
