import type { Route } from "next";

export const routeSegments = {
  marketing: "/",
  dashboard: "/dashboard",
  admin: "/admin",
  publicPreview: "/site"
} as const;

export function marketingPath(path = ""): Route {
  return `/${path}`.replace("//", "/") as Route;
}

export function customerPath(slug: string, path = ""): Route {
  return `${routeSegments.publicPreview}/${slug}${path}` as Route;
}

export function customerDashboardPath(slug: string, path = ""): Route {
  return customerPath(slug, `${routeSegments.dashboard}${path}`);
}

export function signInPath(): Route {
  return "/sign-in" as Route;
}

export function signUpPath(): Route {
  return "/sign-up" as Route;
}

export function onboardingPath(): Route {
  return "/get-started" as Route;
}

export function themesPath(): Route {
  return "/themes" as Route;
}

export function themePath(theme: string): Route {
  return `/themes/${theme}` as Route;
}

export function themeDemoPath(theme: string): Route {
  return `/themes/${theme}/demo` as Route;
}

export function adminPath(path = ""): Route {
  return `${routeSegments.admin}${path}` as Route;
}

export function themeStudioPath(slug = "demo"): Route {
  return customerDashboardPath(slug, "/theme");
}
