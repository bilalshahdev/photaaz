import createMiddleware from "next-intl/middleware";
import { hasLocale } from "next-intl";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "@/i18n/routing";
import { customerDemos } from "@/data/customer-demos";

const intlMiddleware = createMiddleware(routing);
const internalLocaleRewriteHeader = "x-photaaz-internal-locale-rewrite";
const adminCookieName = "photaaz-admin-session";
const authSessionCookieNames = [
  "better-auth.session_token",
  "__Secure-better-auth.session_token",
];

const reservedRootSegments = new Set([
  "",
  "admin",
  "api",
  "blog",
  "checkout",
  "get-started",
  "legal",
  "legal-accept",
  "onboarding",
  "sign-in",
  "sign-up",
  "site",
  "themes",
]);

const publicRouteSegments = new Set([
  "get-started",
  "blog",
  "legal",
  "legal-accept",
  "onboarding",
  "sign-in",
  "sign-up",
  "themes",
]);

function isAssetPath(pathname: string) {
  return pathname.includes(".");
}

async function publicTenantExists(request: NextRequest, slug: string) {
  if (Object.prototype.hasOwnProperty.call(customerDemos, slug)) {
    return true;
  }

  const lookupUrl = request.nextUrl.clone();
  lookupUrl.pathname = `/api/public/tenants/${encodeURIComponent(slug)}`;
  lookupUrl.search = "";
  const response = await fetch(lookupUrl, {
    method: "HEAD",
    cache: "no-store",
  });

  return response.ok;
}

function tenantNotFound(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = "/_not-found";
  url.search = "";

  return NextResponse.rewrite(url, { status: 404 });
}

function getCookieLocale(request: NextRequest) {
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;

  return hasLocale(routing.locales, cookieLocale) ? cookieLocale : null;
}

function getPreferredLocale(request: NextRequest) {
  return getCookieLocale(request) ?? routing.defaultLocale;
}

function localizedPath(locale: string, segments: string[]) {
  const suffix = segments.length ? `/${segments.join("/")}` : "";

  return locale === routing.defaultLocale
    ? suffix || "/"
    : `/${locale}${suffix}`;
}

function redirectToLocale(
  request: NextRequest,
  locale: string,
  segments: string[],
) {
  const url = request.nextUrl.clone();
  url.pathname = localizedPath(locale, segments);

  return NextResponse.redirect(url);
}

function routeDefaultLocaleInternally(
  request: NextRequest,
  segments: string[],
) {
  const url = request.nextUrl.clone();
  url.pathname = segments.length
    ? `/${routing.defaultLocale}/${segments.join("/")}`
    : `/${routing.defaultLocale}`;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(internalLocaleRewriteHeader, "1");

  return NextResponse.rewrite(url, {
    request: {
      headers: requestHeaders,
    },
  });
}

function normalizeLocalePrefix(request: NextRequest, segments: string[]) {
  const [firstSegment, secondSegment] = segments;
  const cookieLocale = getCookieLocale(request);

  if (hasLocale(routing.locales, firstSegment)) {
    if (cookieLocale && cookieLocale !== firstSegment) {
      return redirectToLocale(request, cookieLocale, segments.slice(1));
    }

    return null;
  }

  if (secondSegment && publicRouteSegments.has(secondSegment)) {
    return redirectToLocale(
      request,
      getPreferredLocale(request),
      segments.slice(1),
    );
  }

  return null;
}

function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(
    normalized.length + ((4 - (normalized.length % 4)) % 4),
    "=",
  );
  return Uint8Array.from(atob(padded), (character) => character.charCodeAt(0));
}

async function hasValidAdminSession(request: NextRequest) {
  const value = request.cookies.get(adminCookieName)?.value;
  const secret = process.env.BETTER_AUTH_SECRET;
  const configuredEmail = process.env.SUPER_ADMIN_EMAIL;
  const expectedEmail =
    configuredEmail ||
    (process.env.NODE_ENV !== "production" ? "photaaz@admin.com" : null);

  if (!value || !secret || !expectedEmail) return false;

  try {
    const [payload, supplied] = value.split(".");
    if (!payload || !supplied) return false;
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    );
    const expected = new Uint8Array(
      await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload)),
    );
    const received = decodeBase64Url(supplied);
    if (expected.length !== received.length) {
      return false;
    }
    let difference = 0;
    for (let index = 0; index < expected.length; index += 1) {
      difference |= expected[index] ^ received[index];
    }
    if (difference !== 0) return false;
    const session = JSON.parse(
      new TextDecoder().decode(decodeBase64Url(payload)),
    ) as { email?: string; expiresAt?: number };

    return (
      session.email === expectedEmail &&
      typeof session.expiresAt === "number" &&
      session.expiresAt >= Math.floor(Date.now() / 1000)
    );
  } catch {
    return false;
  }
}

async function rewriteToInternalTenantRoute(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const segments = pathname.split("/").filter(Boolean);
  const [firstSegment, secondSegment] = segments;

  if (segments.length === 0) {
    const preferredLocale = getPreferredLocale(request);

    if (preferredLocale !== routing.defaultLocale) {
      return redirectToLocale(request, preferredLocale, segments);
    }

    return routeDefaultLocaleInternally(request, segments);
  }

  if (isAssetPath(pathname)) {
    return null;
  }

  if (firstSegment === "admin") {
    const isLogin = secondSegment === "login";
    const isAuthenticated = await hasValidAdminSession(request);

    if (!isLogin && !isAuthenticated) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.search = "";
      return NextResponse.redirect(url);
    }

    if (isLogin && isAuthenticated) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      url.search = "";
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  if (firstSegment === "checkout") {
    return NextResponse.next();
  }

  if (firstSegment === "site" && segments[2] === "dashboard") {
    const hasSessionCookie = authSessionCookieNames.some((name) =>
      request.cookies.has(name),
    );

    if (!hasSessionCookie) {
      const url = request.nextUrl.clone();
      url.pathname = "/sign-in";
      url.search = "";
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  const localeResponse = normalizeLocalePrefix(request, segments);

  if (localeResponse) {
    return localeResponse;
  }

  if (hasLocale(routing.locales, firstSegment)) {
    const isInternalDefaultLocaleRewrite =
      firstSegment === routing.defaultLocale &&
      request.headers.get(internalLocaleRewriteHeader) === "1";

    if (
      isInternalDefaultLocaleRewrite &&
      (!secondSegment || reservedRootSegments.has(secondSegment))
    ) {
      return NextResponse.next();
    }

    if (secondSegment === "site" && segments[3] === "dashboard") {
      const url = request.nextUrl.clone();
      url.pathname = `/${segments.slice(1).join("/")}`;

      return NextResponse.redirect(url);
    }

    if (secondSegment === "site") {
      const tenantSlug = segments[2];

      if (!tenantSlug || !(await publicTenantExists(request, tenantSlug))) {
        return tenantNotFound(request);
      }

      return NextResponse.next();
    }

    if (!secondSegment || reservedRootSegments.has(secondSegment)) {
      return null;
    }

    const url = request.nextUrl.clone();
    url.pathname = `/${firstSegment}/site/${segments.slice(1).join("/")}`;
    return NextResponse.rewrite(url);
  }

  if (firstSegment === "site") {
    const tenantSlug = segments[1];

    if (!tenantSlug || !(await publicTenantExists(request, tenantSlug))) {
      return tenantNotFound(request);
    }

    const preferredLocale = getPreferredLocale(request);

    if (preferredLocale !== routing.defaultLocale) {
      return redirectToLocale(request, preferredLocale, segments);
    }

    return routeDefaultLocaleInternally(request, segments);
  }

  if (reservedRootSegments.has(firstSegment)) {
    const preferredLocale = getPreferredLocale(request);

    if (preferredLocale !== routing.defaultLocale) {
      return redirectToLocale(request, preferredLocale, segments);
    }

    return routeDefaultLocaleInternally(request, segments);
  }

  const preferredLocale = getPreferredLocale(request);

  if (!(await publicTenantExists(request, firstSegment))) {
    return tenantNotFound(request);
  }

  if (preferredLocale !== routing.defaultLocale) {
    return redirectToLocale(request, preferredLocale, segments);
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${routing.defaultLocale}/site/${segments.join("/")}`;
  return NextResponse.rewrite(url);
}

export default async function proxy(request: NextRequest) {
  return (
    (await rewriteToInternalTenantRoute(request)) ?? intlMiddleware(request)
  );
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
