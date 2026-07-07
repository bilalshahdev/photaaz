export const legalLinks = [
  { label: { en: "Privacy Policy", ur: "رازداری پالیسی" }, slug: "privacy" },
  { label: { en: "Terms", ur: "شرائط" }, slug: "terms" },
  { label: { en: "Refund Policy", ur: "ریفنڈ پالیسی" }, slug: "refund" },
  { label: { en: "Cookie Policy", ur: "کوکی پالیسی" }, slug: "cookies" },
  { label: { en: "Acceptable Use", ur: "قابل قبول استعمال" }, slug: "acceptable-use" }
] as const;

export type LegalSlug = (typeof legalLinks)[number]["slug"];

export function legalPath(slug: LegalSlug) {
  return `/legal/${slug}`;
}
