export const themeKeys = ["minimal", "editorial", "cinematic", "masonry", "luxury", "monochrome", "panorama"] as const;

export type ThemeKey = (typeof themeKeys)[number];
export type ThemeTier = "basic" | "premium" | "special";
export type PlanThemeAccess = "free" | "paid" | "pro";

export type ThemeConfig = {
  key: ThemeKey;
  name: string;
  tier: ThemeTier;
  premium: boolean;
  description: string;
  mood: string;
  previewImage: string;
  palette: string[];
  defaultSettings: {
    navbarStyle: "centered" | "sidebar" | "floating";
    galleryStyle: "grid" | "masonry";
    cardStyle: "minimal" | "modern" | "rounded";
    footerStyle: "simple" | "expanded";
  };
};

const planThemeAccessRank: Record<PlanThemeAccess, number> = {
  free: 0,
  paid: 1,
  pro: 2
};

export function getPlanThemeAccess(planKey: string): PlanThemeAccess {
  if (planKey === "free") {
    return "free";
  }

  if (planKey === "pro" || planKey === "ownership") {
    return "pro";
  }

  return "paid";
}

export function getThemeRequiredAccess(theme: ThemeConfig): PlanThemeAccess {
  if (theme.tier === "special") {
    return "pro";
  }

  if (theme.tier === "premium") {
    return "paid";
  }

  return "free";
}

export function canPlanUseTheme(planKey: string, theme: ThemeConfig) {
  return planThemeAccessRank[getPlanThemeAccess(planKey)] >= planThemeAccessRank[getThemeRequiredAccess(theme)];
}

export function getAccessibleThemeKeys(planKey: string, premiumThemeLimit: number | null | undefined): ThemeKey[] {
  const basicThemeKeys = themes.filter((theme) => theme.tier === "basic").map((theme) => theme.key);
  const paidThemeKeys = themes.filter((theme) => theme.tier === "premium" && canPlanUseTheme(planKey, theme)).map((theme) => theme.key);
  const specialThemeKeys = themes.filter((theme) => theme.tier === "special" && canPlanUseTheme(planKey, theme)).map((theme) => theme.key);

  if (premiumThemeLimit == null) {
    return [...basicThemeKeys, ...paidThemeKeys, ...specialThemeKeys];
  }

  if (premiumThemeLimit <= 0) {
    return basicThemeKeys;
  }

  return [...basicThemeKeys, ...paidThemeKeys, ...specialThemeKeys].slice(0, basicThemeKeys.length + premiumThemeLimit);
}

export function canPlanUseThemeWithLimit(planKey: string, theme: ThemeConfig, premiumThemeLimit: number | null | undefined) {
  return getAccessibleThemeKeys(planKey, premiumThemeLimit).includes(theme.key);
}

export function getThemeBadgeLabel(theme: ThemeConfig) {
  if (theme.tier === "special") {
    return "Special";
  }

  if (theme.tier === "premium") {
    return "Premium";
  }

  return "Basic";
}

export const themes: ThemeConfig[] = [
  {
    key: "minimal",
    name: "Lumen",
    tier: "basic",
    premium: false,
    description: "Soft whitespace, warm image crops, and a clear inquiry path for wedding and lifestyle portfolios.",
    mood: "Light / Refined",
    previewImage: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85",
    palette: ["#f7f0e6", "#15120f", "#1d7a70", "#d8875f"],
    defaultSettings: {
      navbarStyle: "centered",
      galleryStyle: "grid",
      cardStyle: "minimal",
      footerStyle: "simple"
    }
  },
  {
    key: "editorial",
    name: "Archive",
    tier: "premium",
    premium: true,
    description: "A magazine-style system for campaign stories, visual essays, journals, and bold portfolio features.",
    mood: "Magazine / Story-led",
    previewImage: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85",
    palette: ["#f8f1e8", "#211917", "#b45f3a", "#2f6f66"],
    defaultSettings: {
      navbarStyle: "floating",
      galleryStyle: "masonry",
      cardStyle: "modern",
      footerStyle: "expanded"
    }
  },
  {
    key: "cinematic",
    name: "Noir",
    tier: "premium",
    premium: true,
    description: "A dark, full-bleed theme for dramatic travel, street, and documentary photography.",
    mood: "Dark / Filmic",
    previewImage: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=85",
    palette: ["#0f1111", "#f4efe6", "#45c2b5", "#c99145"],
    defaultSettings: {
      navbarStyle: "centered",
      galleryStyle: "masonry",
      cardStyle: "rounded",
      footerStyle: "expanded"
    }
  },
  {
    key: "masonry",
    name: "Contact Sheet",
    tier: "premium",
    premium: true,
    description: "A dense visual archive for photographers who want visitors to scan many shoots quickly.",
    mood: "Archive / Dense",
    previewImage: "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?auto=format&fit=crop&w=1200&q=85",
    palette: ["#f4f2ec", "#101418", "#177d74", "#9aa3a7"],
    defaultSettings: {
      navbarStyle: "sidebar",
      galleryStyle: "grid",
      cardStyle: "minimal",
      footerStyle: "simple"
    }
  },
  {
    key: "luxury",
    name: "Atelier",
    tier: "special",
    premium: true,
    description: "Boutique spacing, polished details, and a premium first impression for studios and fashion work.",
    mood: "Boutique / Premium",
    previewImage: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85",
    palette: ["#11100d", "#fbf4e8", "#c9a875", "#19746a"],
    defaultSettings: {
      navbarStyle: "floating",
      galleryStyle: "masonry",
      cardStyle: "modern",
      footerStyle: "simple"
    }
  },
  {
    key: "monochrome",
    name: "Monogram",
    tier: "premium",
    premium: true,
    description: "A fine-art black-and-white theme with gallery-grade presentation and collector-style browsing.",
    mood: "Fine Art / Monochrome",
    previewImage: "https://images.unsplash.com/photo-1496440737103-cd596325d314?auto=format&fit=crop&w=1200&q=85",
    palette: ["#000000", "#f7f7f2", "#6f6f6f", "#d6d6cc"],
    defaultSettings: {
      navbarStyle: "centered",
      galleryStyle: "masonry",
      cardStyle: "minimal",
      footerStyle: "expanded"
    }
  },
  {
    key: "panorama",
    name: "Horizon",
    tier: "special",
    premium: true,
    description: "A wide cinematic layout for landscape, outdoor, and travel photographers.",
    mood: "Landscape / Panoramic",
    previewImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85",
    palette: ["#e9ece6", "#17201c", "#1d7a70", "#d9b56f"],
    defaultSettings: {
      navbarStyle: "floating",
      galleryStyle: "grid",
      cardStyle: "modern",
      footerStyle: "expanded"
    }
  }
];
