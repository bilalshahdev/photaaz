import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";
import { syncPaddleCheckoutTransaction } from "@/services/subscription/paddle-provisioning";
import { enforceRateLimit, getRequestIdentity, RateLimitError } from "@/services/security/rate-limit";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    await enforceRateLimit({ scope: "checkout-sync", identity: getRequestIdentity(request.headers), limit: 20, windowSeconds: 60 });
  } catch (error) {
    if (error instanceof RateLimitError) return NextResponse.json({ error: error.message }, { status: 429, headers: { "Retry-After": String(error.retryAfterSeconds) } });
    throw error;
  }
  const transactionId = request.nextUrl.searchParams.get("_ptxn");
  const returnTo = getSafeReturnPath(request);
  const tenantSlug = getTenantSlug(returnTo);

  if (!transactionId || !tenantSlug) {
    return NextResponse.redirect(buildReturnUrl(request, returnTo, "error", transactionId));
  }

  const result = await syncPaddleCheckoutTransaction(transactionId, tenantSlug, {
    revalidate: false
  }).catch((error) => {
    console.error("Paddle checkout return crashed while syncing:", error);

    return {
      ok: false as const,
      synced: false,
      message: error instanceof Error ? error.message : "Could not verify Paddle checkout."
    };
  });

  if (!result.ok) {
    console.error("Paddle checkout return could not be synced:", result.message);
    const checkoutState = result.message.toLowerCase().includes("does not belong") ? "error" : "pending";

    return NextResponse.redirect(buildReturnUrl(request, returnTo, checkoutState, transactionId));
  }

  return NextResponse.redirect(buildReturnUrl(request, returnTo, result.synced ? "success" : "pending", transactionId));
}

function getSafeReturnPath(request: NextRequest) {
  const rawReturnTo = request.nextUrl.searchParams.get("returnTo");

  if (!rawReturnTo) return "/";

  try {
    const url = new URL(rawReturnTo, request.nextUrl.origin);
    const path = `${url.pathname}${url.search}${url.hash}`;

    return isSafePackageReturnPath(path) ? path : "/";
  } catch {
    return "/";
  }
}

function isSafePackageReturnPath(path: string) {
  return /^\/(?:[a-z]{2}(?:-[A-Z]{2})?\/)?site\/[^/]+\/dashboard\/package(?:\/)?(?:[?#].*)?$/.test(path);
}

function getTenantSlug(returnTo: string) {
  const match = returnTo.match(/^\/(?:[a-z]{2}(?:-[A-Z]{2})?\/)?site\/([^/]+)\/dashboard\/package(?:\/)?(?:[?#].*)?$/);
  return match?.[1] ? decodeURIComponent(match[1]) : null;
}

function buildReturnUrl(request: NextRequest, returnTo: string, checkout: "success" | "pending" | "error", transactionId: string | null) {
  const url = new URL(returnTo, getPublicOrigin(request));

  url.searchParams.set("checkout", checkout);

  if (transactionId) {
    url.searchParams.set("_ptxn", transactionId);
  }

  return url;
}

function getPublicOrigin(request: NextRequest) {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto") ?? "https";
  const host = request.headers.get("host");
  const envOrigin = env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  const envHost = getHostname(envOrigin);

  if (forwardedHost?.endsWith(".trycloudflare.com")) {
    return `${forwardedProto}://${forwardedHost}`;
  }

  if (host?.endsWith(".trycloudflare.com")) {
    return `${request.nextUrl.protocol.replace(":", "")}://${host}`;
  }

  if (forwardedHost && (!envHost || envHost === "localhost" || envHost === "127.0.0.1")) {
    return `${forwardedProto}://${forwardedHost}`;
  }

  if (envOrigin && !envOrigin.includes("0.0.0.0")) {
    return envOrigin;
  }

  if (forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`;
  }

  if (host && !host.startsWith("0.0.0.0")) {
    const proto = request.headers.get("x-forwarded-proto") ?? request.nextUrl.protocol.replace(":", "") ?? "http";

    return `${proto}://${host}`;
  }

  return request.nextUrl.origin;
}

function getHostname(origin: string) {
  try {
    return new URL(origin).hostname;
  } catch {
    return null;
  }
}
