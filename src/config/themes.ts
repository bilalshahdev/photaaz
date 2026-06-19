export const themeKeys = ["minimal", "editorial", "cinematic", "masonry", "luxury"] as const;

export type ThemeKey = (typeof themeKeys)[number];

export type ThemeConfig = {
  key: ThemeKey;
  name: string;
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

export const themes: ThemeConfig[] = [
  {
    key: "minimal",
    name: "Minimal",
    premium: false,
    description: "Quiet whitespace, crisp gallery grids, and editorial type for portfolio purists.",
    mood: "Clean / Editorial",
    previewImage: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=85",
    palette: ["#f4efe6", "#11100d", "#207567", "#e86845"],
    defaultSettings: {
      navbarStyle: "centered",
      galleryStyle: "grid",
      cardStyle: "minimal",
      footerStyle: "simple"
    }
  },
  {
    key: "editorial",
    name: "Editorial",
    premium: true,
    description: "Magazine-style rhythm with asymmetry, large type, and image-led storytelling.",
    mood: "Magazine / Asymmetric",
    previewImage: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85",
    palette: ["#fff7ed", "#35241f", "#c46a43", "#f0c7b1"],
    defaultSettings: {
      navbarStyle: "floating",
      galleryStyle: "masonry",
      cardStyle: "modern",
      footerStyle: "expanded"
    }
  },
  {
    key: "cinematic",
    name: "Cinematic",
    premium: true,
    description: "Immersive dark canvas, full-screen visuals, and slow editorial pacing.",
    mood: "Immersive / Dark",
    previewImage: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=85",
    palette: ["#e9f1ee", "#17322e", "#2f7d73", "#e0a84c"],
    defaultSettings: {
      navbarStyle: "centered",
      galleryStyle: "masonry",
      cardStyle: "rounded",
      footerStyle: "expanded"
    }
  },
  {
    key: "masonry",
    name: "Masonry",
    premium: true,
    description: "Image-first browsing with flexible masonry galleries and dense collections.",
    mood: "Gallery / Image-first",
    previewImage: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=85",
    palette: ["#f3f1ea", "#111111", "#d24a2f", "#707070"],
    defaultSettings: {
      navbarStyle: "sidebar",
      galleryStyle: "grid",
      cardStyle: "minimal",
      footerStyle: "simple"
    }
  },
  {
    key: "luxury",
    name: "Luxury",
    premium: true,
    description: "Elegant spacing, premium typography, and refined gallery presentation.",
    mood: "Elegant / Premium",
    previewImage: "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?auto=format&fit=crop&w=1200&q=85",
    palette: ["#11100d", "#f6efe4", "#26a69a", "#f06a3a"],
    defaultSettings: {
      navbarStyle: "floating",
      galleryStyle: "masonry",
      cardStyle: "modern",
      footerStyle: "simple"
    }
  }
];
