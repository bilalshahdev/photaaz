"use server";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/lib/auth/server";
import { prisma } from "@/lib/db/prisma";
import { enforceServerActionRateLimit, getRequestIdentity } from "@/services/security/rate-limit";
import { currentLegalVersions } from "@/config/legal";

const privacyTypes = ["ACCESS", "EXPORT", "CORRECTION", "DELETION", "OBJECTION"] as const;

export async function acceptCurrentLegalTerms(formData: FormData) {
  await enforceServerActionRateLimit("legal-acceptance", 10, 60 * 60);
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error("Authentication required.");
  if (formData.get("accepted") !== "on") throw new Error("Acceptance is required.");
  const locale = String(formData.get("locale") || "en").slice(0, 10);
  const requestHeaders = await headers();
  await prisma.legalAcceptance.upsert({
    where: { userId_termsVersion_privacyVersion: { userId: session.user.id, termsVersion: currentLegalVersions.terms, privacyVersion: currentLegalVersions.privacy } },
    update: {},
    create: { userId: session.user.id, termsVersion: currentLegalVersions.terms, privacyVersion: currentLegalVersions.privacy, locale, ipAddressHash: hashIdentity(getRequestIdentity(requestHeaders)), userAgent: requestHeaders.get("user-agent")?.slice(0, 500) },
  });
  const returnTo = String(formData.get("returnTo") || "/");
  redirect((/^\/site\/[a-z0-9-]+\/dashboard(?:\/.*)?$/.test(returnTo) ? returnTo : "/") as never);
}

export async function submitPrivacyRequest(formData: FormData) {
  await enforceServerActionRateLimit("privacy-rights", 5, 60 * 60);
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id || !session.user.email) throw new Error("Sign in before submitting a verified privacy request.");
  const parsed = z.object({ type: z.enum(privacyTypes), details: z.string().trim().min(10).max(5000), locale: z.string().min(2).max(10) }).parse({
    type: formData.get("type"), details: formData.get("details"), locale: formData.get("locale"),
  });
  const requestHeaders = await headers();
  await prisma.legalRequest.create({ data: {
    userId: session.user.id, type: parsed.type, email: session.user.email, name: session.user.name || "Account holder",
    details: parsed.details, declaration: true, locale: parsed.locale, ipAddressHash: hashIdentity(getRequestIdentity(requestHeaders)),
  }});
  redirect(`/${parsed.locale === "en" ? "" : `${parsed.locale}/`}legal/privacy?request=submitted` as never);
}

export async function submitCopyrightNotice(formData: FormData) {
  await enforceServerActionRateLimit("copyright-notice", 5, 60 * 60);
  const parsed = z.object({
    name: z.string().trim().min(2).max(120), email: z.string().trim().email().max(200), sourceUrl: z.string().url().max(2000),
    workDescription: z.string().trim().min(10).max(2000), details: z.string().trim().min(20).max(5000),
    declaration: z.literal("on"), locale: z.string().min(2).max(10),
  }).parse(Object.fromEntries(formData));
  const requestHeaders = await headers();
  await prisma.legalRequest.create({ data: {
    type: "COPYRIGHT", email: parsed.email, name: parsed.name, sourceUrl: parsed.sourceUrl,
    workDescription: parsed.workDescription, details: parsed.details, declaration: true, locale: parsed.locale,
    ipAddressHash: hashIdentity(getRequestIdentity(requestHeaders)),
  }});
  redirect(`/${parsed.locale === "en" ? "" : `${parsed.locale}/`}legal/copyright?request=submitted` as never);
}

function hashIdentity(identity: string) {
  return identity === "unknown" ? null : createHash("sha256").update(identity).digest("hex");
}
