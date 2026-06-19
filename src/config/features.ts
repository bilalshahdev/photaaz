export const featureKeys = [
  "blogs",
  "customDomains",
  "premiumThemes",
  "watermarks",
  "clientProofing"
] as const;

export type FeatureKey = (typeof featureKeys)[number];

export const defaultPlanFeatures: Record<string, Partial<Record<FeatureKey, boolean>>> = {
  free: {
    blogs: true,
    customDomains: false,
    premiumThemes: false,
    watermarks: false,
    clientProofing: false
  },
  pro: {
    blogs: true,
    customDomains: true,
    premiumThemes: true,
    watermarks: false,
    clientProofing: false
  }
};

export function hasFeature(planKey: string, feature: FeatureKey) {
  return Boolean(defaultPlanFeatures[planKey]?.[feature]);
}
