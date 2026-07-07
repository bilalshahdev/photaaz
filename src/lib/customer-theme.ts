export type CustomerSiteThemeVariant =
  | "minimal"
  | "editorial"
  | "cinematic"
  | "masonry"
  | "luxury"
  | "monochrome"
  | "panorama";

export function resolveCustomerSiteThemeVariant(slug: string): CustomerSiteThemeVariant {
  if (slug.includes("editorial")) return "editorial";
  if (slug.includes("cinematic")) return "cinematic";
  if (slug.includes("masonry")) return "masonry";
  if (slug.includes("luxury")) return "luxury";
  if (slug.includes("monochrome")) return "monochrome";
  if (slug.includes("panorama")) return "panorama";

  return "minimal";
}
