export const featureKeys = [
  // Core platform
  "adminDashboard",
  "responsiveDesign",

  // Content limits
  "photos.total",
  "photos.perCategory",
  "photos.perGallery",
  "heroImages.total",
  "galleries.total",
  "categories.total",
  "subcategories.perCategory",
  "blogs",
  "categoryRequests.total",

  // Appearance & branding
  "premiumThemes",
  "premiumThemes.limit",
  "themeComponents",
  "advancedCustomization",
  "pageHeaderImages",
  "watermarks",

  // Domain & localization
  "customDomains",
  "anyLanguageLocalization",

  // Ownership extras
  "freeMaintenance.months"
] as const;

export type FeatureKey = (typeof featureKeys)[number];

/** Features that are just on/off toggles — no numeric limit input should be shown. */
export const booleanOnlyFeatures: ReadonlySet<string> = new Set([
  "adminDashboard",
  "responsiveDesign",
  "premiumThemes",
  "themeComponents",
  "advancedCustomization",
  "pageHeaderImages",
  "watermarks",
  "customDomains",
  "anyLanguageLocalization"
]);

/** Preferred display order for features in the package editor. Features not listed appear at the end. */
export const featureDisplayOrder: readonly string[] = [
  // Core platform
  "adminDashboard",
  "responsiveDesign",

  // Photo & media limits
  "photos.total",
  "photos.perCategory",
  "photos.perGallery",
  "heroImages.total",

  // Organization limits
  "galleries.total",
  "categories.total",
  "subcategories.perCategory",
  "categoryRequests.total",

  // Content
  "blogs",

  // Themes & appearance
  "premiumThemes",
  "premiumThemes.limit",
  "themeComponents",
  "advancedCustomization",
  "pageHeaderImages",
  "watermarks",

  // Domain & localization
  "customDomains",
  "anyLanguageLocalization",

  // Ownership
  "freeMaintenance.months"
];

export const defaultPlanFeatures: Record<string, Partial<Record<FeatureKey, boolean>>> = {
  free: {
    blogs: true,
    customDomains: false,
    premiumThemes: false,
    watermarks: false,
    "photos.total": true,
    "heroImages.total": true,
    pageHeaderImages: false,
    "photos.perCategory": true,
    "categories.total": true,
    "subcategories.perCategory": true,
    "galleries.total": true,
    "photos.perGallery": true,
    "premiumThemes.limit": false,
    themeComponents: false,
    adminDashboard: true,
    responsiveDesign: true,
    "categoryRequests.total": false
  },
  plus: {
    blogs: true,
    customDomains: true,
    premiumThemes: true,
    watermarks: false,
    "photos.total": true,
    "heroImages.total": true,
    pageHeaderImages: true,
    "photos.perCategory": true,
    "categories.total": true,
    "subcategories.perCategory": true,
    "galleries.total": true,
    "photos.perGallery": true,
    "premiumThemes.limit": true,
    themeComponents: true,
    advancedCustomization: false,
    anyLanguageLocalization: false,
    "freeMaintenance.months": false,
    adminDashboard: true,
    responsiveDesign: true,
    "categoryRequests.total": true
  },
  pro: {
    blogs: true,
    customDomains: true,
    premiumThemes: true,
    watermarks: true,
    "photos.total": true,
    "heroImages.total": true,
    pageHeaderImages: true,
    "photos.perCategory": true,
    "categories.total": true,
    "subcategories.perCategory": true,
    "galleries.total": true,
    "photos.perGallery": true,
    "premiumThemes.limit": true,
    themeComponents: true,
    advancedCustomization: false,
    anyLanguageLocalization: false,
    "freeMaintenance.months": false,
    adminDashboard: true,
    responsiveDesign: true,
    "categoryRequests.total": true
  },
  ownership: {
    blogs: true,
    customDomains: true,
    premiumThemes: true,
    watermarks: true,
    "photos.total": true,
    "heroImages.total": true,
    pageHeaderImages: true,
    "photos.perCategory": true,
    "categories.total": true,
    "subcategories.perCategory": true,
    "galleries.total": true,
    "photos.perGallery": true,
    "premiumThemes.limit": true,
    themeComponents: true,
    advancedCustomization: true,
    anyLanguageLocalization: true,
    "freeMaintenance.months": true,
    adminDashboard: true,
    responsiveDesign: true,
    "categoryRequests.total": true
  }
};

export function hasFeature(planKey: string, feature: FeatureKey) {
  return Boolean(defaultPlanFeatures[planKey]?.[feature]);
}
