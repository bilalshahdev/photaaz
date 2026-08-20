export const legalLinks = [
  { label: { en: "Privacy Policy", ur: "رازداری پالیسی" }, slug: "privacy" },
  { label: { en: "Terms", ur: "شرائط" }, slug: "terms" },
  { label: { en: "Refund & Cancellation", ur: "ریفنڈ اور منسوخی" }, slug: "refund" },
  { label: { en: "Cookie Policy", ur: "کوکی پالیسی" }, slug: "cookies" },
  { label: { en: "Acceptable Use", ur: "قابل قبول استعمال" }, slug: "acceptable-use" },
  { label: { en: "Copyright & Takedown", ur: "کاپی رائٹ" }, slug: "copyright" },
  { label: { en: "Data Processing Addendum", ur: "ڈیٹا پروسیسنگ ضمیمہ" }, slug: "dpa" },
  { label: { en: "Subprocessors", ur: "ذیلی پروسیسرز" }, slug: "subprocessors" },
] as const;

export const currentLegalVersions = {
  terms: "2026-08-17",
  privacy: "2026-08-17",
} as const;

export type LegalSlug = (typeof legalLinks)[number]["slug"];

export function legalPath(slug: LegalSlug) {
  return `/legal/${slug}`;
}
