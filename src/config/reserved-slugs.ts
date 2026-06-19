export const reservedSlugs = [
  "admin",
  "api",
  "sign-in",
  "sign-up",
  "onboarding",
  "get-started",
  "themes",
  "support",
  "en",
  "ur"
] as const;

export function isReservedSlug(slug: string) {
  return reservedSlugs.includes(slug as (typeof reservedSlugs)[number]);
}
