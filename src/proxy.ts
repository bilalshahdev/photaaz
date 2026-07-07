import createMiddleware from "next-intl/middleware";
import { hasLocale } from "next-intl";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);
const internalLocaleRewriteHeader = "x-photaaz-internal-locale-rewrite";

const reservedRootSegments = new Set([
  "",
  "admin",
  "api",
  "blog",
  "get-started",
  "legal",
  "onboarding",
  "sign-in",
  "sign-up",
  "site",
  "themes"
]);

const publicRouteSegments = new Set([
  "get-started",
  "blog",
  "legal",
  "onboarding",
  "sign-in",
  "sign-up",
  "themes"
]);

function isAssetPath(pathname: string) {
  return pathname.includes(".");
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

  return locale === routing.defaultLocale ? suffix || "/" : `/${locale}${suffix}`;
}

function redirectToLocale(request: NextRequest, locale: string, segments: string[]) {
  const url = request.nextUrl.clone();
  url.pathname = localizedPath(locale, segments);

  return NextResponse.redirect(url);
}

function routeDefaultLocaleInternally(request: NextRequest, segments: string[]) {
  const url = request.nextUrl.clone();
  url.pathname = segments.length ? `/${routing.defaultLocale}/${segments.join("/")}` : `/${routing.defaultLocale}`;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(internalLocaleRewriteHeader, "1");

  return NextResponse.rewrite(url, {
    request: {
      headers: requestHeaders
    }
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
    return redirectToLocale(request, getPreferredLocale(request), segments.slice(1));
  }

  return null;
}

function rewriteToInternalTenantRoute(request: NextRequest) {
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
    return NextResponse.next();
  }

  const localeResponse = normalizeLocalePrefix(request, segments);

  if (localeResponse) {
    return localeResponse;
  }

  if (hasLocale(routing.locales, firstSegment)) {
    const isInternalDefaultLocaleRewrite =
      firstSegment === routing.defaultLocale && request.headers.get(internalLocaleRewriteHeader) === "1";

    if (isInternalDefaultLocaleRewrite && (!secondSegment || reservedRootSegments.has(secondSegment))) {
      return NextResponse.next();
    }

    if (secondSegment === "site") {
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

  if (preferredLocale !== routing.defaultLocale) {
    return redirectToLocale(request, preferredLocale, segments);
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${routing.defaultLocale}/site/${segments.join("/")}`;
  return NextResponse.rewrite(url);
}

export default function proxy(request: NextRequest) {
  return rewriteToInternalTenantRoute(request) ?? intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"]
};
