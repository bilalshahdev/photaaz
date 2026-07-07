import { planLimitKeys } from "@/services/subscription/plan-limits";

export type DisplayPlanFeature = {
  key: string;
  name: string;
  description: string | null;
  limit: number | null;
};

const hiddenClientFeatureKeys = new Set(["watermarks", "clientProofing"]);

const orderedFeatureKeys = [
  planLimitKeys.photosTotal,
  planLimitKeys.heroImagesTotal,
  "pageHeaderImages",
  planLimitKeys.photosPerCategory,
  planLimitKeys.categoriesTotal,
  planLimitKeys.subcategoriesPerCategory,
  planLimitKeys.galleriesTotal,
  planLimitKeys.photosPerGallery,
  "blogs",
  "premiumThemes",
  planLimitKeys.premiumThemesLimit,
  "customDomains",
  "themeComponents",
  "advancedCustomization",
  "anyLanguageLocalization",
  "adminDashboard",
  "responsiveDesign",
  planLimitKeys.categoryRequestsTotal,
  planLimitKeys.freeMaintenanceMonths
];

export function getClientVisiblePlanFeatures<T extends DisplayPlanFeature>(features: T[]) {
  const hasPremiumThemeLimit = features.some((feature) => feature.key === planLimitKeys.premiumThemesLimit);

  return features
    .filter((feature) => !hiddenClientFeatureKeys.has(feature.key))
    .filter((feature) => !(feature.key === "premiumThemes" && hasPremiumThemeLimit))
    .map(normalizePlanFeature)
    .sort((a, b) => featureOrder(a.key) - featureOrder(b.key));
}

export function formatPlanFeatureSummary(feature: DisplayPlanFeature) {
  if (feature.limit === null) {
    return feature.name;
  }

  return `${feature.name} (${feature.limit.toLocaleString("en-US")})`;
}

export function formatPlanAmount(value: number | null) {
  if (value == null || value === 0) {
    return "0";
  }

  return Math.round(value).toLocaleString("en-PK");
}

export function getPrimaryPlanPrice(plan: { monthlyPrice: number | null; annualPrice: number | null; lifetimePrice: number | null }) {
  if (plan.monthlyPrice && plan.monthlyPrice > 0) {
    return { amount: formatPlanAmount(plan.monthlyPrice), prefix: "Rs", suffix: "/ month" };
  }

  if (plan.annualPrice && plan.annualPrice > 0) {
    return { amount: formatPlanAmount(plan.annualPrice), prefix: "Rs", suffix: "/ year" };
  }

  if (plan.lifetimePrice && plan.lifetimePrice > 0) {
    return { amount: formatPlanAmount(plan.lifetimePrice), prefix: "Rs", suffix: "one time" };
  }

  return { amount: "0", prefix: "Rs", suffix: "/ month" };
}

function normalizePlanFeature<T extends DisplayPlanFeature>(feature: T): T {
  if (feature.key === "customDomains") {
    return {
      ...feature,
      name: "Custom domain",
      limit: null
    };
  }

  if (feature.key === planLimitKeys.premiumThemesLimit && feature.limit !== null) {
    return {
      ...feature,
      name: `${feature.limit.toLocaleString("en-US")} premium theme${feature.limit === 1 ? "" : "s"}`,
      limit: null
    };
  }

  if (feature.key === planLimitKeys.freeMaintenanceMonths && feature.limit !== null) {
    return {
      ...feature,
      name: `${feature.limit.toLocaleString("en-US")} month${feature.limit === 1 ? "" : "s"} free maintenance`,
      limit: null
    };
  }

  if (feature.limit === null && unlimitedFeatureLabels[feature.key]) {
    return {
      ...feature,
      name: unlimitedFeatureLabels[feature.key],
      limit: null
    };
  }

  return feature;
}

function featureOrder(key: string) {
  const index = orderedFeatureKeys.indexOf(key);
  return index === -1 ? orderedFeatureKeys.length : index;
}

const unlimitedFeatureLabels: Record<string, string> = {
  blogs: "Unlimited blogs",
  [planLimitKeys.photosTotal]: "Unlimited photos",
  [planLimitKeys.heroImagesTotal]: "Unlimited hero images",
  [planLimitKeys.photosPerCategory]: "Unlimited photos per category",
  [planLimitKeys.categoriesTotal]: "Unlimited categories",
  [planLimitKeys.subcategoriesPerCategory]: "Unlimited subcategories",
  [planLimitKeys.galleriesTotal]: "Unlimited galleries",
  [planLimitKeys.photosPerGallery]: "Unlimited photos per gallery",
  [planLimitKeys.premiumThemesLimit]: "All premium themes",
  [planLimitKeys.categoryRequestsTotal]: "Unlimited category requests"
};
