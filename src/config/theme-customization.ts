export const themeCustomizationKeys = [
  "colors",
  "fonts",
  "navbarStyle",
  "galleryStyle",
  "cardStyle",
  "footerStyle"
] as const;

export type ThemeCustomizationKey = (typeof themeCustomizationKeys)[number];

export type ThemeCustomizationPolicy = {
  allowed: Record<ThemeCustomizationKey, boolean>;
  minPlan: Record<ThemeCustomizationKey, string>;
};

export const defaultThemeCustomizationPolicy: ThemeCustomizationPolicy = {
  allowed: {
    colors: true,
    fonts: true,
    navbarStyle: true,
    galleryStyle: true,
    cardStyle: true,
    footerStyle: true
  },
  minPlan: {
    colors: "free",
    fonts: "pro",
    navbarStyle: "pro",
    galleryStyle: "free",
    cardStyle: "pro",
    footerStyle: "pro"
  }
};

export const themeCustomizationLabels: Record<ThemeCustomizationKey, string> = {
  colors: "Colors",
  fonts: "Fonts",
  navbarStyle: "Navbar style",
  galleryStyle: "Gallery layout",
  cardStyle: "Card style",
  footerStyle: "Footer style"
};

export const planGateOptions = ["free", "plus", "pro", "ownership"] as const;

export function normalizeThemeCustomizationPolicy(value: unknown): ThemeCustomizationPolicy {
  const candidate = value && typeof value === "object" ? value as Partial<ThemeCustomizationPolicy> : {};
  const allowed = candidate.allowed && typeof candidate.allowed === "object" ? candidate.allowed as Partial<Record<ThemeCustomizationKey, boolean>> : {};
  const minPlan = candidate.minPlan && typeof candidate.minPlan === "object" ? candidate.minPlan as Partial<Record<ThemeCustomizationKey, string>> : {};

  return {
    allowed: themeCustomizationKeys.reduce(
      (result, key) => {
        result[key] = typeof allowed[key] === "boolean" ? allowed[key] : defaultThemeCustomizationPolicy.allowed[key];
        return result;
      },
      {} as ThemeCustomizationPolicy["allowed"]
    ),
    minPlan: themeCustomizationKeys.reduce(
      (result, key) => {
        result[key] = typeof minPlan[key] === "string" ? minPlan[key] : defaultThemeCustomizationPolicy.minPlan[key];
        return result;
      },
      {} as ThemeCustomizationPolicy["minPlan"]
    )
  };
}
