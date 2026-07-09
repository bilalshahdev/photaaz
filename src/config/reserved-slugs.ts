import { locales } from "@/i18n/locales";

export const reservedSlugs = [
  "admin",
  "api",
  "sign-in",
  "sign-up",
  "onboarding",
  "get-started",
  "themes",
  "support",
  ...locales
] as const;

export function isReservedSlug(slug: string) {
  return reservedSlugs.includes(slug as (typeof reservedSlugs)[number]);
}
