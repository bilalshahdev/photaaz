import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { benefitFeatures, pricingPlans, themeShowcases } from "@/data/marketing";
import { managedPhotographyTypes, supportRequests } from "@/data/platform-admin";
import { cacheDurations, cacheTags } from "@/lib/cache";

export type PlatformThemeView = {
  name: string;
  slug: string;
  image: string;
  description: string;
  features: string[];
  iconKey: string;
  enabled: boolean;
  premium: boolean;
  demoPath: string;
  displayOrder: number;
  seoTitle?: string | null;
  seoDescription?: string | null;
};

export type LocalizedString = string | {
  en: string;
  ur: string;
};

export type PlatformLandingSectionKey = "hero" | "themes" | "features" | "pricing" | "faq" | "contact" | "finalCta";

export type PlatformLandingSection = {
  enabled: boolean;
  displayOrder: number;
};

export type PlatformPricingPlanView = {
  key: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  enabled: boolean;
  featured: boolean;
  displayOrder: number;
};

export type PlatformPhotographyTypeView = {
  name: string;
  slug: string;
  parentSlug?: string | null;
  enabled: boolean;
  categorySeed: boolean;
  displayOrder: number;
  children: PlatformPhotographyTypeView[];
};

export type PlatformLandingSettings = {
  sections: Record<PlatformLandingSectionKey, PlatformLandingSection>;
  hero: {
    eyebrow: LocalizedString;
    headline: LocalizedString;
    subheadline: LocalizedString;
    primaryCta: LocalizedString;
    secondaryCta: LocalizedString;
  };
  seo: {
    title: LocalizedString;
    description: LocalizedString;
  };
  contact: {
    eyebrow: LocalizedString;
    title: LocalizedString;
    body: LocalizedString;
    submitLabel: LocalizedString;
  };
  features: Array<{
    title: string;
    body: string;
    iconKey: string;
    enabled: boolean;
    displayOrder: number;
  }>;
  faqs: Array<{
    question: LocalizedString;
    answer: LocalizedString;
    enabled: boolean;
    displayOrder: number;
  }>;
};

export type PlatformSupportRequestView = {
  id: string;
  name: string;
  email: string;
  topic: string;
  status: string;
  message: string;
};

export type PlatformAnnouncementView = {
  id: string;
  title: string;
  body: string;
  linkLabel?: string | null;
  linkHref?: string | null;
  enabled: boolean;
  marquee: boolean;
  displayOrder: number;
};

export const fallbackLandingSettings: PlatformLandingSettings = {
  sections: {
    hero: { enabled: true, displayOrder: 1 },
    themes: { enabled: true, displayOrder: 2 },
    features: { enabled: true, displayOrder: 3 },
    pricing: { enabled: true, displayOrder: 4 },
    faq: { enabled: true, displayOrder: 5 },
    contact: { enabled: true, displayOrder: 6 },
    finalCta: { enabled: true, displayOrder: 7 }
  },
  hero: {
    eyebrow: {
      en: "Portfolio SaaS for photographers",
      ur: "فوٹوگرافرز کے لیے پورٹ فولیو پلیٹ فارم"
    },
    headline: {
      en: "Create a professional photography website in minutes.",
      ur: "چند منٹوں میں اپنی پیشہ ور فوٹوگرافی ویب سائٹ بنائیں۔"
    },
    subheadline: {
      en: "Pick a design, upload your photos, and publish a polished portfolio that presents your work beautifully.",
      ur: "ڈیزائن منتخب کریں، اپنی تصاویر اپ لوڈ کریں، اور ایسا صاف ستھرا پورٹ فولیو شائع کریں جو آپ کے کام کو خوبصورتی سے پیش کرے۔"
    },
    primaryCta: {
      en: "Start free",
      ur: "مفت شروع کریں"
    },
    secondaryCta: {
      en: "View themes",
      ur: "تھیمز دیکھیں"
    }
  },
  seo: {
    title: {
      en: "PhotoFolio - Professional Photography Websites in Minutes",
      ur: "PhotoFolio - چند منٹوں میں پیشہ ور فوٹوگرافی ویب سائٹس"
    },
    description: {
      en: "Create a professional photography website in minutes. Pick a design, upload photos, and publish a polished portfolio with themes, galleries, blogs, and custom domains.",
      ur: "چند منٹوں میں پیشہ ور فوٹوگرافی ویب سائٹ بنائیں۔ ڈیزائن منتخب کریں، تصاویر اپ لوڈ کریں، اور تھیمز، گیلریز، بلاگز، اور کسٹم ڈومین کے ساتھ پورٹ فولیو شائع کریں۔"
    }
  },
  contact: {
    eyebrow: {
      en: "Questions",
      ur: "سوالات"
    },
    title: {
      en: "Need help choosing the right portfolio setup?",
      ur: "صحیح پورٹ فولیو سیٹ اپ منتخب کرنے میں مدد چاہیے؟"
    },
    body: {
      en: "Tell us what kind of photography website you want to launch. We will point you toward the best theme, plan, or domain path.",
      ur: "ہمیں بتائیں آپ کس قسم کی فوٹوگرافی ویب سائٹ لانچ کرنا چاہتے ہیں۔ ہم آپ کو مناسب تھیم، پلان، یا ڈومین راستہ بتائیں گے۔"
    },
    submitLabel: {
      en: "Send question",
      ur: "سوال بھیجیں"
    }
  },
  features: benefitFeatures.map((feature, index) => ({
    title: feature.title,
    body: feature.body,
    iconKey: "feature",
    enabled: true,
    displayOrder: index + 1
  })),
  faqs: [
    {
      question: {
        en: "Can I publish without uploading all my photos first?",
        ur: "کیا میں تمام تصاویر اپ لوڈ کیے بغیر ویب سائٹ شائع کر سکتا ہوں؟"
      },
      answer: {
        en: "Yes. You can start with a theme, starter galleries, and placeholders, then add more work from your dashboard later.",
        ur: "جی ہاں۔ آپ تھیم، ابتدائی گیلریز، اور پلیس ہولڈرز کے ساتھ شروع کر سکتے ہیں، پھر بعد میں ڈیش بورڈ سے مزید کام شامل کر سکتے ہیں۔"
      },
      enabled: true,
      displayOrder: 1
    },
    {
      question: {
        en: "Can I connect my own domain?",
        ur: "کیا میں اپنا ڈومین کنیکٹ کر سکتا ہوں؟"
      },
      answer: {
        en: "You can begin with a free PhotoFolio subdomain. Custom domain connection can be managed from the dashboard on supported packages.",
        ur: "آپ مفت PhotoFolio سب ڈومین سے شروع کر سکتے ہیں۔ سپورٹڈ پیکجز پر کسٹم ڈومین ڈیش بورڈ سے مینیج کیا جا سکتا ہے۔"
      },
      enabled: true,
      displayOrder: 2
    },
    {
      question: {
        en: "Are translations included?",
        ur: "کیا تراجم شامل ہیں؟"
      },
      answer: {
        en: "Translations are available only for predefined supported languages and may have separate charges set by the platform.",
        ur: "تراجم صرف پہلے سے طے شدہ سپورٹڈ زبانوں کے لیے دستیاب ہیں اور ان کے لیے پلیٹ فارم کی طرف سے الگ چارجز ہو سکتے ہیں۔"
      },
      enabled: true,
      displayOrder: 3
    }
  ]
};

export const fallbackThemes: PlatformThemeView[] = themeShowcases.map(({ name, slug, image, description, features }, index) => ({
  name,
  slug,
  image,
  description,
  features,
  iconKey: slug,
  enabled: true,
  premium: index > 1,
  demoPath: `/themes/${slug}/demo`,
  displayOrder: index + 1,
  seoTitle: `${name} Photography Website Theme - PhotoFolio`,
  seoDescription: description
}));

const curatedThemeImages = new Map(themeShowcases.map((theme) => [theme.slug, theme.image]));
const deprecatedThemeImages = new Set([
  "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1000&q=84",
  "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1000&q=84",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=84",
  "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?auto=format&fit=crop&w=1000&q=84",
  "https://images.unsplash.com/photo-1500051638674-ff996a0ec29e?auto=format&fit=crop&w=1000&q=84"
]);

function resolveThemeImage(slug: string, image: string) {
  if (!deprecatedThemeImages.has(image)) {
    return image;
  }

  return curatedThemeImages.get(slug) ?? image;
}

export const fallbackPricingPlans: PlatformPricingPlanView[] = pricingPlans.map((plan, index) => ({
  key: plan.name.toLowerCase(),
  name: plan.name,
  price: plan.price,
  description: plan.description,
  features: plan.features,
  enabled: true,
  featured: Boolean(plan.featured),
  displayOrder: index + 1
}));

export const fallbackPhotographyTypes: PlatformPhotographyTypeView[] = managedPhotographyTypes.map((type, index) => ({
  ...type,
  parentSlug: type.parentSlug ?? null,
  displayOrder: index + 1,
  children: []
}));

export const fallbackSupportRequests: PlatformSupportRequestView[] = supportRequests;

export const fallbackAnnouncements: PlatformAnnouncementView[] = [
  {
    id: "welcome-announcement",
    title: "New portfolio themes",
    body: "Explore the latest theme previews and choose a layout before creating your site.",
    linkLabel: "View themes",
    linkHref: "/themes",
    enabled: true,
    marquee: true,
    displayOrder: 1
  }
];

const landingSectionKeys: PlatformLandingSectionKey[] = ["hero", "themes", "features", "pricing", "faq", "contact", "finalCta"];

function normalizeLandingSections(value: unknown): Record<PlatformLandingSectionKey, PlatformLandingSection> {
  const candidate = value && typeof value === "object" ? (value as Partial<Record<PlatformLandingSectionKey, Partial<PlatformLandingSection>>>) : {};

  return landingSectionKeys.reduce(
    (sections, key) => {
      const section = candidate[key];
      const fallback = fallbackLandingSettings.sections[key];

      sections[key] = {
        enabled: typeof section?.enabled === "boolean" ? section.enabled : fallback.enabled,
        displayOrder: typeof section?.displayOrder === "number" ? section.displayOrder : fallback.displayOrder
      };

      return sections;
    },
    {} as Record<PlatformLandingSectionKey, PlatformLandingSection>
  );
}

function normalizeLandingSettings(value: PlatformLandingSettings): PlatformLandingSettings {
  return {
    ...fallbackLandingSettings,
    ...value,
    sections: normalizeLandingSections(value.sections),
    hero: {
      ...fallbackLandingSettings.hero,
      ...value.hero
    },
    seo: {
      ...fallbackLandingSettings.seo,
      ...value.seo
    },
    contact: {
      ...fallbackLandingSettings.contact,
      ...value.contact
    },
    features: Array.isArray(value.features) ? value.features : fallbackLandingSettings.features,
    faqs: Array.isArray(value.faqs) ? value.faqs : fallbackLandingSettings.faqs
  };
}

function isLandingSettings(value: unknown): value is PlatformLandingSettings {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<PlatformLandingSettings>;

  return Boolean(candidate.hero?.headline && candidate.hero.subheadline && candidate.seo?.title && candidate.contact?.title && Array.isArray(candidate.features));
}

async function fromDbOrFallback<T>(query: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await query();
  } catch {
    return fallback;
  }
}

async function getPlatformLandingSettingsFromDb() {
  return fromDbOrFallback(async () => {
    const setting = await prisma.platformSetting.findUnique({
      where: { key: "landing" }
    });

    return isLandingSettings(setting?.value) ? normalizeLandingSettings(setting.value) : fallbackLandingSettings;
  }, fallbackLandingSettings);
}

export function getPlatformLandingSettings() {
  return unstable_cache(
    getPlatformLandingSettingsFromDb,
    ["platform-landing-settings"],
    {
      revalidate: cacheDurations.platform,
      tags: [cacheTags.platform, cacheTags.platformLanding]
    }
  )();
}

async function getPlatformThemesFromDb({ enabledOnly = false } = {}) {
  return fromDbOrFallback(async () => {
    const themes = await prisma.platformTheme.findMany({
      where: enabledOnly ? { enabled: true } : undefined,
      orderBy: [{ displayOrder: "asc" }, { name: "asc" }]
    });

    return themes.map((theme) => ({
      name: theme.name,
      slug: theme.slug,
      image: resolveThemeImage(theme.slug, theme.image),
      description: theme.description,
      features: theme.features,
      iconKey: theme.iconKey,
      enabled: theme.enabled,
      premium: theme.premium,
      demoPath: theme.demoPath,
      displayOrder: theme.displayOrder,
      seoTitle: theme.seoTitle,
      seoDescription: theme.seoDescription
    }));
  }, enabledOnly ? fallbackThemes.filter((theme) => theme.enabled) : fallbackThemes);
}

export function getPlatformThemes({ enabledOnly = false } = {}) {
  return unstable_cache(
    () => getPlatformThemesFromDb({ enabledOnly }),
    ["platform-themes", enabledOnly ? "enabled" : "all"],
    {
      revalidate: cacheDurations.platform,
      tags: [cacheTags.platform, cacheTags.platformThemes]
    }
  )();
}

export async function getPlatformTheme(slug: string) {
  const themes = await getPlatformThemes();

  return themes.find((theme) => theme.slug === slug) ?? null;
}

async function getPlatformPricingPlansFromDb({ enabledOnly = false } = {}) {
  return fromDbOrFallback(async () => {
    const plans = await prisma.platformPricingPlan.findMany({
      where: enabledOnly ? { enabled: true } : undefined,
      orderBy: [{ displayOrder: "asc" }, { name: "asc" }]
    });

    return plans.map((plan) => ({
      key: plan.key,
      name: plan.name,
      price: plan.price,
      description: plan.description,
      features: plan.features,
      enabled: plan.enabled,
      featured: plan.featured,
      displayOrder: plan.displayOrder
    }));
  }, enabledOnly ? fallbackPricingPlans.filter((plan) => plan.enabled) : fallbackPricingPlans);
}

export function getPlatformPricingPlans({ enabledOnly = false } = {}) {
  return unstable_cache(
    () => getPlatformPricingPlansFromDb({ enabledOnly }),
    ["platform-pricing-plans", enabledOnly ? "enabled" : "all"],
    {
      revalidate: cacheDurations.platform,
      tags: [cacheTags.platform, cacheTags.platformPricing]
    }
  )();
}

async function getPlatformPhotographyTypesFromDb() {
  return fromDbOrFallback(async () => {
    const types = await prisma.platformPhotographyType.findMany({
      include: {
        parent: true,
        children: {
          include: {
            parent: true
          },
          orderBy: [{ displayOrder: "asc" }, { name: "asc" }]
        }
      },
      orderBy: [{ displayOrder: "asc" }, { name: "asc" }]
    });

    return types.map((type) => ({
      name: type.name,
      slug: type.slug,
      parentSlug: type.parent?.slug ?? null,
      enabled: type.enabled,
      categorySeed: type.categorySeed,
      displayOrder: type.displayOrder,
      children: type.children.map((child) => ({
        name: child.name,
        slug: child.slug,
        parentSlug: child.parent?.slug ?? type.slug,
        enabled: child.enabled,
        categorySeed: child.categorySeed,
        displayOrder: child.displayOrder,
        children: []
      }))
    }));
  }, fallbackPhotographyTypes);
}

export function getPlatformPhotographyTypes() {
  return unstable_cache(
    getPlatformPhotographyTypesFromDb,
    ["platform-photography-types"],
    {
      revalidate: cacheDurations.platform,
      tags: [cacheTags.platform, "platform:photography-types"]
    }
  )();
}

export async function getPlatformSupportRequests() {
  return fromDbOrFallback(async () => {
    const requests = await prisma.platformSupportRequest.findMany({
      orderBy: { createdAt: "desc" }
    });

    return requests.map((request) => ({
      id: request.id,
      name: request.name,
      email: request.email,
      topic: request.topic,
      status: request.status,
      message: request.message
    }));
  }, fallbackSupportRequests);
}

async function getPlatformAnnouncementsFromDb({ enabledOnly = false } = {}) {
  return fromDbOrFallback(async () => {
    const announcements = await prisma.announcement.findMany({
      where: enabledOnly ? { enabled: true } : undefined,
      orderBy: [{ displayOrder: "asc" }, { updatedAt: "desc" }]
    });

    return announcements.map((announcement) => ({
      id: announcement.id,
      title: announcement.title,
      body: announcement.body,
      linkLabel: announcement.linkLabel,
      linkHref: announcement.linkHref,
      enabled: announcement.enabled,
      marquee: announcement.marquee,
      displayOrder: announcement.displayOrder
    }));
  }, enabledOnly ? fallbackAnnouncements.filter((announcement) => announcement.enabled) : fallbackAnnouncements);
}

export function getPlatformAnnouncements({ enabledOnly = false } = {}) {
  return unstable_cache(
    () => getPlatformAnnouncementsFromDb({ enabledOnly }),
    ["platform-announcements", enabledOnly ? "enabled" : "all"],
    {
      revalidate: cacheDurations.platform,
      tags: [cacheTags.platform, cacheTags.platformAnnouncements]
    }
  )();
}
