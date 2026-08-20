import { unstable_cache } from "next/cache";
import type { BrandFont } from "@/lib/brand-fonts";
import { prisma } from "@/lib/db/prisma";
import {
  benefitFeatures,
  pricingPlans,
  themeShowcases,
} from "@/data/marketing";
import {
  managedPhotographyTypes,
  supportRequests,
} from "@/data/platform-admin";
import { cacheDurations, cacheTags } from "@/lib/cache";
import {
  defaultThemeCustomizationPolicy,
  normalizeThemeCustomizationPolicy,
  type ThemeCustomizationPolicy,
} from "@/config/theme-customization";
import {
  formatPlanFeatureSummary,
  formatPlanAmount,
  getClientVisiblePlanFeatures,
} from "@/services/subscription/plan-presentation";
import {
  localizedPlatformCopy,
  localizedPlatformFeature,
  platformCopyTranslations,
  platformLocales,
} from "@/i18n/platform-copy";

export type PlatformThemeView = {
  name: LocalizedString;
  slug: string;
  image: string;
  description: LocalizedString;
  features: LocalizedString[];
  iconKey: string;
  enabled: boolean;
  premium: boolean;
  demoPath: string;
  displayOrder: number;
  customization: ThemeCustomizationPolicy;
  seoTitle?: LocalizedString | null;
  seoDescription?: LocalizedString | null;
};

export type LocalizedString = string | Record<string, string>;
export type LocalizedStringList = string[] | Record<string, string[]>;

export type PlatformLandingSectionKey =
  | "hero"
  | "themes"
  | "features"
  | "pricing"
  | "faq"
  | "contact"
  | "finalCta";

export type PlatformLandingSection = {
  enabled: boolean;
  displayOrder: number;
};

export type PlatformPricingPlanView = {
  key: string;
  name: LocalizedString;
  price: LocalizedString;
  monthlyPrice: number | null;
  annualPrice: number | null;
  lifetimePrice: number | null;
  description: LocalizedString;
  features: LocalizedString[];
  enabled: boolean;
  featured: boolean;
  displayOrder: number;
};

export type PlatformPhotographyTypeView = {
  name: LocalizedString;
  slug: string;
  image: string;
  parentSlug?: string | null;
  enabled: boolean;
  categorySeed: boolean;
  displayOrder: number;
  children: PlatformPhotographyTypeView[];
};

export type PlatformLandingSettings = {
  sections: Record<PlatformLandingSectionKey, PlatformLandingSection>;
  hero: {
    headline: LocalizedString;
    subheadline: LocalizedString;
    primaryCta: LocalizedString;
    secondaryCta: LocalizedString;
    headlineFont: BrandFont;
    headlineSize: number;
    headlineColor: string;
    carouselIntervalSeconds: number;
    slides: Array<{
      id: string;
      image: string;
      alt: string;
      blank: boolean;
      showButtons: boolean;
      headline: LocalizedString;
      subheadline: LocalizedString;
      linkUrl: string;
    }>;
  };
  seo: {
    title: LocalizedString;
    description: LocalizedString;
    keywords: LocalizedStringList;
  };
  contact: {
    eyebrow: LocalizedString;
    title: LocalizedString;
    body: LocalizedString;
    submitLabel: LocalizedString;
  };
  features: Array<{
    title: LocalizedString;
    body: LocalizedString;
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
  faqDisplayLimit: number;
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
  title: LocalizedString;
  body: LocalizedString;
  linkLabel?: LocalizedString | null;
  linkHref?: string | null;
  enabled: boolean;
  marquee: boolean;
  displayOrder: number;
};

function translateMarketingCopy(value: string): LocalizedString {
  const countFirstFeature = value.match(/^(\d+)\s+(.+)$/);
  const parenthesizedFeature = value.match(/^(.+?)\s+\((.+)\)$/);

  if (countFirstFeature) {
    return localizedPlatformFeature(
      countFirstFeature[2],
      Number(countFirstFeature[1]),
    );
  }

  if (parenthesizedFeature) {
    const numericLimit = Number(parenthesizedFeature[2].replace(/,/g, ""));

    if (!Number.isNaN(numericLimit)) {
      return localizedPlatformFeature(parenthesizedFeature[1], numericLimit);
    }
  }

  return platformCopyTranslations[value] ?? localizedPlatformCopy(value);
}

function translateMarketingList(values: string[]): LocalizedString[] {
  return values.map((value) => translateMarketingCopy(value));
}

function localizedThemeSeoTitle(name: LocalizedString): LocalizedString {
  if (typeof name === "string") {
    return `${name} Photography Website Theme - Photaaz`;
  }

  return Object.fromEntries(
    Object.entries(name).map(([locale, value]) => [
      locale,
      locale === "ur" || locale === "ar"
        ? `${value} - Photaaz`
        : locale === "es"
          ? `${value} Tema de sitio web de fotografía - Photaaz`
          : locale === "tr"
            ? `${value} Fotoğraf Web Sitesi Teması - Photaaz`
            : locale === "hi"
              ? `${value} फोटोग्राफी वेबसाइट थीम - Photaaz`
              : locale === "pt"
                ? `${value} Tema de site de fotografia - Photaaz`
                : locale === "de"
                  ? `${value} Fotografie-Website-Theme - Photaaz`
                  : locale === "fr"
                    ? `${value} Thème de site photo - Photaaz`
                    : `${value} Photography Website Theme - Photaaz`,
    ]),
  );
}

export const fallbackLandingSettings: PlatformLandingSettings = {
  sections: {
    hero: { enabled: true, displayOrder: 1 },
    themes: { enabled: true, displayOrder: 2 },
    features: { enabled: true, displayOrder: 3 },
    pricing: { enabled: true, displayOrder: 4 },
    faq: { enabled: true, displayOrder: 5 },
    contact: { enabled: true, displayOrder: 6 },
    finalCta: { enabled: true, displayOrder: 7 },
  },
  hero: {
    headline: {
      en: "Create a professional photography website in minutes.",
      ur: "چند منٹوں میں اپنی پیشہ ور فوٹوگرافی ویب سائٹ بنائیں۔",
    },
    subheadline: {
      en: "Pick a design, upload your photos, and publish a polished portfolio that presents your work beautifully.",
      ur: "ڈیزائن منتخب کریں، اپنی تصاویر اپ لوڈ کریں، اور ایسا صاف ستھرا پورٹ فولیو شائع کریں جو آپ کے کام کو خوبصورتی سے پیش کرے۔",
    },
    primaryCta: {
      en: "Start free",
      ur: "مفت شروع کریں",
    },
    secondaryCta: {
      en: "View themes",
      ur: "تھیمز دیکھیں",
    },
    headlineFont: "inter",
    headlineSize: 76,
    headlineColor: "#ffffff",
    carouselIntervalSeconds: 9,
    slides: [
      {
        id: "hero-1",
        image:
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2600&q=90",
        alt: "Photographer capturing a wide scenic landscape at golden hour",
        blank: false,
        showButtons: true,
        headline: "",
        subheadline: "",
        linkUrl: "",
      },
      {
        id: "hero-2",
        image:
          "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=2600&q=90",
        alt: "Professional camera held during an outdoor photography session",
        blank: false,
        showButtons: true,
        headline: "",
        subheadline: "",
        linkUrl: "",
      },
      {
        id: "hero-3",
        image:
          "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=2600&q=90",
        alt: "Photographer working with a camera in a cinematic outdoor setting",
        blank: false,
        showButtons: true,
        headline: "",
        subheadline: "",
        linkUrl: "",
      },
    ],
  },
  seo: {
    title: {
      en: "Photaaz - Professional Photography Websites in Minutes",
      ur: "Photaaz - چند منٹوں میں پیشہ ور فوٹوگرافی ویب سائٹس",
    },
    description: {
      en: "Create a professional photography website in minutes. Pick a design, upload photos, and publish a polished portfolio with themes, galleries, blogs, and a custom domain.",
      ur: "چند منٹوں میں پیشہ ور فوٹوگرافی ویب سائٹ بنائیں۔ ڈیزائن منتخب کریں، تصاویر اپ لوڈ کریں، اور تھیمز، گیلریز، بلاگز، اور کسٹم ڈومین کے ساتھ پورٹ فولیو شائع کریں۔",
    },
    keywords: {
      en: [
        "photography website",
        "photography portfolio",
        "photographer website",
        "photo gallery website",
        "portfolio website builder",
      ],
      ur: ["فوٹوگرافی ویب سائٹ", "فوٹوگرافی پورٹ فولیو", "فوٹوگرافر ویب سائٹ"],
    },
  },
  contact: {
    eyebrow: {
      en: "Questions",
      ur: "سوالات",
    },
    title: {
      en: "Need help choosing the right portfolio setup?",
      ur: "صحیح پورٹ فولیو سیٹ اپ منتخب کرنے میں مدد چاہیے؟",
    },
    body: {
      en: "Tell us what kind of photography website you want to launch. We will point you toward the best theme, plan, or domain path.",
      ur: "ہمیں بتائیں آپ کس قسم کی فوٹوگرافی ویب سائٹ لانچ کرنا چاہتے ہیں۔ ہم آپ کو مناسب تھیم، پلان، یا ڈومین راستہ بتائیں گے۔",
    },
    submitLabel: {
      en: "Send question",
      ur: "سوال بھیجیں",
    },
  },
  features: benefitFeatures.map((feature, index) => ({
    title: translateMarketingCopy(feature.title),
    body: translateMarketingCopy(feature.body),
    iconKey: "feature",
    enabled: true,
    displayOrder: index + 1,
  })),
  faqs: [
    {
      question: {
        en: "Can I publish without uploading all my photos first?",
        ur: "کیا میں تمام تصاویر اپ لوڈ کیے بغیر ویب سائٹ شائع کر سکتا ہوں؟",
      },
      answer: {
        en: "Yes. You can start with a theme, starter galleries, and placeholders, then add more work from your dashboard later.",
        ur: "جی ہاں۔ آپ تھیم، ابتدائی گیلریز، اور پلیس ہولڈرز کے ساتھ شروع کر سکتے ہیں، پھر بعد میں ڈیش بورڈ سے مزید کام شامل کر سکتے ہیں۔",
      },
      enabled: true,
      displayOrder: 1,
    },
    {
      question: {
        en: "Can I connect my own domain?",
        ur: "کیا میں اپنا ڈومین کنیکٹ کر سکتا ہوں؟",
      },
      answer: {
        en: "You can begin with a free Photaaz subdomain. Custom domain connection can be managed from the dashboard on supported packages.",
        ur: "آپ مفت Photaaz سب ڈومین سے شروع کر سکتے ہیں۔ سپورٹڈ پیکجز پر کسٹم ڈومین ڈیش بورڈ سے مینیج کیا جا سکتا ہے۔",
      },
      enabled: true,
      displayOrder: 2,
    },
    {
      question: {
        en: "Are translations included?",
        ur: "کیا تراجم شامل ہیں؟",
      },
      answer: {
        en: "Translations are available only for predefined supported languages and may have separate charges set by the platform.",
        ur: "تراجم صرف پہلے سے طے شدہ سپورٹڈ زبانوں کے لیے دستیاب ہیں اور ان کے لیے پلیٹ فارم کی طرف سے الگ چارجز ہو سکتے ہیں۔",
      },
      enabled: true,
      displayOrder: 3,
    },
  ],
  faqDisplayLimit: 4,
};

Object.assign(fallbackLandingSettings.hero, {
  headline: localizedPlatformCopy(
    "Create a professional photography website in minutes.",
  ),
  subheadline: localizedPlatformCopy(
    "Pick a design, upload your photos, and publish a polished portfolio that presents your work beautifully.",
  ),
  primaryCta: localizedPlatformCopy("Start free"),
  secondaryCta: localizedPlatformCopy("View themes"),
});

Object.assign(fallbackLandingSettings.seo, {
  title: localizedPlatformCopy(
    "Photaaz - Professional Photography Websites in Minutes",
  ),
  description: localizedPlatformCopy(
    "Launch a polished photography portfolio with themes, galleries, blogs, domains, and admin tools built for photographers.",
  ),
  keywords: {
    en: [
      "photography website",
      "photography portfolio",
      "photographer website",
      "photo gallery website",
      "portfolio website builder",
    ],
    ur: [
      "فوٹوگرافی ویب سائٹ",
      "فوٹوگرافی پورٹ فولیو",
      "فوٹوگرافر ویب سائٹ",
      "فوٹو گیلری ویب سائٹ",
    ],
    es: [
      "sitio web de fotografía",
      "portafolio fotográfico",
      "sitio para fotógrafos",
      "galería de fotos",
    ],
    ar: ["موقع تصوير", "بورتفوليو تصوير", "موقع مصور", "معرض صور"],
    tr: [
      "fotoğraf sitesi",
      "fotoğraf portfolyosu",
      "fotoğrafçı web sitesi",
      "fotoğraf galerisi",
    ],
    hi: [
      "फोटोग्राफी वेबसाइट",
      "फोटोग्राफी पोर्टफोलियो",
      "फोटोग्राफर वेबसाइट",
      "फोटो गैलरी",
    ],
    pt: [
      "site de fotografia",
      "portfólio de fotografia",
      "site para fotógrafos",
      "galeria de fotos",
    ],
    de: [
      "Fotografie Website",
      "Fotografie Portfolio",
      "Fotografen Website",
      "Fotogalerie",
    ],
    fr: ["site photo", "portfolio photo", "site photographe", "galerie photo"],
  },
});

Object.assign(fallbackLandingSettings.contact, {
  eyebrow: localizedPlatformCopy("Questions"),
  title: localizedPlatformCopy("Need help choosing the right portfolio setup?"),
  body: localizedPlatformCopy(
    "Tell us what kind of photography website you want to launch. We will point you toward the best theme, plan, or domain path.",
  ),
  submitLabel: localizedPlatformCopy("Send question"),
});

fallbackLandingSettings.faqs = [
  {
    question: localizedPlatformCopy(
      "Can I publish without uploading all my photos first?",
    ),
    answer: localizedPlatformCopy(
      "Yes. You can start with a theme, starter galleries, and placeholders, then add more work from your dashboard later.",
    ),
    enabled: true,
    displayOrder: 1,
  },
  {
    question: localizedPlatformCopy("Can I connect my own domain?"),
    answer: localizedPlatformCopy(
      "You can begin with a free Photaaz subdomain. Custom domain connection can be managed from the dashboard on supported packages.",
    ),
    enabled: true,
    displayOrder: 2,
  },
  {
    question: localizedPlatformCopy("Are translations included?"),
    answer: localizedPlatformCopy(
      "Translations are available only for predefined supported languages and may have separate charges set by the platform.",
    ),
    enabled: true,
    displayOrder: 3,
  },
];

export const fallbackThemes: PlatformThemeView[] = themeShowcases.map(
  ({ name, slug, image, description, features }, index) => ({
    name,
    slug,
    image,
    description: translateMarketingCopy(description),
    features: translateMarketingList(features),
    iconKey: slug,
    enabled: true,
    premium: themeShowcases[index]?.tier === "premium",
    demoPath: `/themes/${slug}/demo`,
    displayOrder: index + 1,
    customization: defaultThemeCustomizationPolicy,
    seoTitle: localizedThemeSeoTitle(name),
    seoDescription: translateMarketingCopy(description),
  }),
);

const curatedThemeImages = new Map(
  themeShowcases.map((theme) => [theme.slug, theme.image]),
);
const deprecatedThemeImages = new Set([
  "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1000&q=84",
  "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1000&q=84",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=84",
  "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?auto=format&fit=crop&w=1000&q=84",
  "https://images.unsplash.com/photo-1500051638674-ff996a0ec29e?auto=format&fit=crop&w=1000&q=84",
]);

function resolveThemeImage(slug: string, image: string) {
  if (!deprecatedThemeImages.has(image)) {
    return image;
  }

  return curatedThemeImages.get(slug) ?? image;
}

export const fallbackPricingPlans: PlatformPricingPlanView[] = pricingPlans.map(
  (plan, index) => ({
    key: plan.name.toLowerCase(),
    name: translateMarketingCopy(plan.name),
    price: plan.price,
    monthlyPrice: plan.monthlyPrice,
    annualPrice: plan.annualPrice,
    lifetimePrice: plan.lifetimePrice,
    description: translateMarketingCopy(plan.description),
    features: translateMarketingList(plan.features),
    enabled: true,
    featured: Boolean(plan.featured),
    displayOrder: index + 1,
  }),
);

export const fallbackPhotographyTypes: PlatformPhotographyTypeView[] =
  managedPhotographyTypes.map((type, index) => ({
    ...type,
    parentSlug: type.parentSlug ?? null,
    displayOrder: index + 1,
    children: [],
  }));

export const fallbackSupportRequests: PlatformSupportRequestView[] =
  supportRequests;

export const fallbackAnnouncements: PlatformAnnouncementView[] = [
  {
    id: "welcome-announcement",
    title: {
      en: "New portfolio themes",
      ur: "نئی پورٹ فولیو تھیمز",
    },
    body: {
      en: "Explore the latest theme previews and choose a layout before creating your site.",
      ur: "اپنی سائٹ بنانے سے پہلے تازہ تھیم پری ویوز دیکھیں اور ایک لے آؤٹ منتخب کریں۔",
    },
    linkLabel: {
      en: "View themes",
      ur: "تھیمز دیکھیں",
    },
    linkHref: "/themes",
    enabled: true,
    marquee: true,
    displayOrder: 1,
  },
];

fallbackAnnouncements[0] = {
  ...fallbackAnnouncements[0],
  title: localizedPlatformCopy("New portfolio themes"),
  body: localizedPlatformCopy(
    "Explore the latest theme previews and choose a layout before creating your site.",
  ),
  linkLabel: localizedPlatformCopy("View themes"),
};

const landingSectionKeys: PlatformLandingSectionKey[] = [
  "hero",
  "themes",
  "features",
  "pricing",
  "faq",
  "contact",
  "finalCta",
];

function isLocalizedRecord(value: unknown): value is Record<string, string> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function localizedOrFallback(
  value: unknown,
  fallback: string,
): LocalizedString {
  if (!isLocalizedRecord(value)) {
    return localizedPlatformCopy(fallback);
  }

  const overrides = Object.fromEntries(
    Object.entries(value).filter(
      ([locale, translation]) => locale === "en" || translation !== fallback,
    ),
  ) as Partial<Record<(typeof platformLocales)[number], string>>;

  return localizedPlatformCopy(fallback, overrides);
}

function localizedFeatureSummary(
  name: LocalizedString,
  limit: number | null,
): LocalizedString {
  if (limit === null) return name;

  if (typeof name === "string") {
    return `${name} (${limit})`;
  }

  return Object.fromEntries(
    Object.entries(name).map(([locale, value]) => [
      locale,
      `${value} (${limit})`,
    ]),
  );
}

function localizedListOrFallback(
  value: unknown,
  fallback: string[],
): LocalizedString[] {
  if (!Array.isArray(value)) {
    return translateMarketingList(fallback);
  }

  return value.map((item, index) => {
    const fallbackValue = fallback[index] ?? "";

    if (typeof item === "string") {
      return translateMarketingCopy(item);
    }

    if (isLocalizedRecord(item)) {
      return localizedPlatformCopy(
        fallbackValue,
        item as Partial<Record<(typeof platformLocales)[number], string>>,
      );
    }

    return translateMarketingCopy(fallbackValue);
  });
}

function normalizeLandingSections(
  value: unknown,
): Record<PlatformLandingSectionKey, PlatformLandingSection> {
  const candidate =
    value && typeof value === "object"
      ? (value as Partial<
          Record<PlatformLandingSectionKey, Partial<PlatformLandingSection>>
        >)
      : {};

  return landingSectionKeys.reduce(
    (sections, key) => {
      const section = candidate[key];
      const fallback = fallbackLandingSettings.sections[key];

      sections[key] = {
        enabled:
          typeof section?.enabled === "boolean"
            ? section.enabled
            : fallback.enabled,
        displayOrder:
          typeof section?.displayOrder === "number"
            ? section.displayOrder
            : fallback.displayOrder,
      };

      return sections;
    },
    {} as Record<PlatformLandingSectionKey, PlatformLandingSection>,
  );
}

function normalizeLandingSettings(
  value: PlatformLandingSettings,
): PlatformLandingSettings {
  return {
    ...fallbackLandingSettings,
    ...value,
    sections: normalizeLandingSections(value.sections),
    hero: {
      ...fallbackLandingSettings.hero,
      ...value.hero,
      slides:
        Array.isArray(value.hero?.slides) && value.hero.slides.length
          ? value.hero.slides.map((slide) => ({
              ...slide,
              blank: slide.blank ?? false,
              showButtons: slide.showButtons ?? true,
              linkUrl: slide.linkUrl ?? "",
            }))
          : fallbackLandingSettings.hero.slides,
    },
    seo: {
      ...fallbackLandingSettings.seo,
      ...value.seo,
      keywords: value.seo?.keywords ?? fallbackLandingSettings.seo.keywords,
    },
    contact: {
      ...fallbackLandingSettings.contact,
      ...value.contact,
    },
    features: Array.isArray(value.features)
      ? value.features
      : fallbackLandingSettings.features,
    faqs: Array.isArray(value.faqs) ? value.faqs : fallbackLandingSettings.faqs,
    faqDisplayLimit:
      typeof value.faqDisplayLimit === "number"
        ? value.faqDisplayLimit
        : fallbackLandingSettings.faqDisplayLimit,
  };
}

function isLandingSettings(value: unknown): value is PlatformLandingSettings {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<PlatformLandingSettings>;

  return Boolean(
    candidate.hero?.headline &&
    candidate.hero.subheadline &&
    candidate.seo?.title &&
    candidate.contact?.title &&
    Array.isArray(candidate.features),
  );
}

async function fromDbOrFallback<T>(
  query: () => Promise<T>,
  fallback: T,
): Promise<T> {
  try {
    return await query();
  } catch {
    return fallback;
  }
}

async function getPlatformLandingSettingsFromDb() {
  return fromDbOrFallback(async () => {
    const setting = await prisma.platformSetting.findUnique({
      where: { key: "landing" },
    });

    return isLandingSettings(setting?.value)
      ? normalizeLandingSettings(setting.value)
      : fallbackLandingSettings;
  }, fallbackLandingSettings);
}

export function getPlatformLandingSettings() {
  return unstable_cache(
    getPlatformLandingSettingsFromDb,
    ["platform-landing-settings"],
    {
      revalidate: cacheDurations.platform,
      tags: [cacheTags.platform, cacheTags.platformLanding],
    },
  )();
}

async function getPlatformThemesFromDb({ enabledOnly = false } = {}) {
  return fromDbOrFallback(
    async () => {
      const themes = await prisma.platformTheme.findMany({
        where: enabledOnly ? { enabled: true } : undefined,
        orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
      });

      return themes.map((theme) => ({
        name: localizedOrFallback(theme.nameI18n, theme.name),
        slug: theme.slug,
        image: resolveThemeImage(theme.slug, theme.image),
        description: localizedOrFallback(
          theme.descriptionI18n,
          theme.description,
        ),
        features: localizedListOrFallback(theme.featuresI18n, theme.features),
        iconKey: theme.iconKey,
        enabled: theme.enabled,
        premium: theme.premium,
        demoPath: theme.demoPath,
        displayOrder: theme.displayOrder,
        customization: normalizeThemeCustomizationPolicy(theme.customization),
        seoTitle: theme.seoTitle
          ? localizedOrFallback(theme.seoTitleI18n, theme.seoTitle)
          : localizedOrFallback(theme.seoTitleI18n, ""),
        seoDescription: theme.seoDescription
          ? localizedOrFallback(theme.seoDescriptionI18n, theme.seoDescription)
          : localizedOrFallback(theme.seoDescriptionI18n, ""),
      }));
    },
    enabledOnly
      ? fallbackThemes.filter((theme) => theme.enabled)
      : fallbackThemes,
  );
}

export function getPlatformThemes({ enabledOnly = false } = {}) {
  return unstable_cache(
    () => getPlatformThemesFromDb({ enabledOnly }),
    ["platform-themes-v5", enabledOnly ? "enabled" : "all"],
    {
      revalidate: cacheDurations.platform,
      tags: [cacheTags.platform, cacheTags.platformThemes],
    },
  )();
}

export async function getPlatformTheme(slug: string) {
  const themes = await getPlatformThemes();

  return themes.find((theme) => theme.slug === slug) ?? null;
}

async function getPlatformPricingPlansFromDb({ enabledOnly = false } = {}) {
  return fromDbOrFallback(
    async () => {
      const plans = await prisma.plan.findMany({
        where: enabledOnly ? { enabled: true } : undefined,
        include: {
          features: {
            where: { enabled: true },
            include: { feature: true },
            orderBy: { createdAt: "asc" },
          },
        },
        orderBy: [
          { displayOrder: "asc" },
          { monthlyPrice: "asc" },
          { name: "asc" },
        ],
      });

      return plans.map((plan) => {
        const features = plan.features.map((access) => ({
          key: access.feature.key,
          name: access.feature.name,
          localizedName: localizedOrFallback(
            access.feature.nameI18n,
            access.feature.name,
          ),
          description: access.feature.description,
          limit: access.limit,
        }));
        const visibleFeatures = getClientVisiblePlanFeatures(
          features.map((feature) => ({
            key: feature.key,
            name: feature.name,
            description: feature.description,
            limit: feature.limit,
          })),
        );

        return {
          key: plan.key,
          name: localizedOrFallback(plan.nameI18n, plan.name),
          price: formatPackagePrice(plan.monthlyPrice, plan.lifetimePrice),
          monthlyPrice: plan.monthlyPrice,
          annualPrice: plan.annualPrice,
          lifetimePrice: plan.lifetimePrice,
          description: localizedOrFallback(
            plan.descriptionI18n,
            plan.description ||
              `For photographers using the ${plan.name} package.`,
          ),
          features: visibleFeatures.map((feature) => {
            const source = features.find((item) => item.key === feature.key);
            return source
              ? localizedFeatureSummary(source.localizedName, source.limit)
              : formatPlanFeatureSummary(feature);
          }),
          enabled: plan.enabled,
          featured: plan.featured,
          displayOrder: plan.displayOrder || 99,
        };
      });
    },
    enabledOnly
      ? fallbackPricingPlans.filter((plan) => plan.enabled)
      : fallbackPricingPlans,
  );
}

export function getPlatformPricingPlans({ enabledOnly = false } = {}) {
  return unstable_cache(
    () => getPlatformPricingPlansFromDb({ enabledOnly }),
    ["platform-pricing-plans", enabledOnly ? "enabled" : "all"],
    {
      revalidate: cacheDurations.platform,
      tags: [cacheTags.platform, cacheTags.platformPricing],
    },
  )();
}

function formatPackagePrice(
  monthlyPrice: number | null,
  lifetimePrice: number | null,
) {
  if (monthlyPrice && monthlyPrice > 0) {
    return formatPlanAmount(monthlyPrice);
  }

  if (lifetimePrice && lifetimePrice > 0) {
    return formatPlanAmount(lifetimePrice);
  }

  if (!monthlyPrice) {
    return "$0";
  }

  return formatPlanAmount(monthlyPrice);
}

async function getPlatformPhotographyTypesFromDb() {
  return fromDbOrFallback(async () => {
    const types = await prisma.platformPhotographyType.findMany({
      include: {
        parent: true,
        children: {
          include: {
            parent: true,
          },
          orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
        },
      },
      orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
    });

    return types.map((type) => ({
      name: localizedOrFallback(type.nameI18n, type.name),
      slug: type.slug,
      image: type.image,
      parentSlug: type.parent?.slug ?? null,
      enabled: type.enabled,
      categorySeed: type.categorySeed,
      displayOrder: type.displayOrder,
      children: type.children.map((child) => ({
        name: localizedOrFallback(child.nameI18n, child.name),
        slug: child.slug,
        image: child.image,
        parentSlug: child.parent?.slug ?? type.slug,
        enabled: child.enabled,
        categorySeed: child.categorySeed,
        displayOrder: child.displayOrder,
        children: [],
      })),
    }));
  }, fallbackPhotographyTypes);
}

export function getPlatformPhotographyTypes() {
  return unstable_cache(
    getPlatformPhotographyTypesFromDb,
    ["platform-photography-types"],
    {
      revalidate: cacheDurations.platform,
      tags: [cacheTags.platform, "platform:photography-types"],
    },
  )();
}

export async function getPlatformSupportRequests() {
  return fromDbOrFallback(async () => {
    const requests = await prisma.platformSupportRequest.findMany({
      orderBy: { createdAt: "desc" },
    });

    return requests.map((request) => ({
      id: request.id,
      name: request.name,
      email: request.email,
      topic: request.topic,
      status: request.status,
      message: request.message,
    }));
  }, fallbackSupportRequests);
}

async function getPlatformAnnouncementsFromDb({ enabledOnly = false } = {}) {
  return fromDbOrFallback(
    async () => {
      const announcements = await prisma.announcement.findMany({
        where: enabledOnly ? { enabled: true } : undefined,
        orderBy: [{ displayOrder: "asc" }, { updatedAt: "desc" }],
      });

      return announcements.map((announcement) => ({
        id: announcement.id,
        title: localizedOrFallback(announcement.titleI18n, announcement.title),
        body: localizedOrFallback(announcement.bodyI18n, announcement.body),
        linkLabel: announcement.linkLabel
          ? localizedOrFallback(
              announcement.linkLabelI18n,
              announcement.linkLabel,
            )
          : localizedOrFallback(announcement.linkLabelI18n, ""),
        linkHref: announcement.linkHref,
        enabled: announcement.enabled,
        marquee: announcement.marquee,
        displayOrder: announcement.displayOrder,
      }));
    },
    enabledOnly
      ? fallbackAnnouncements.filter((announcement) => announcement.enabled)
      : fallbackAnnouncements,
  );
}

export function getPlatformAnnouncements({ enabledOnly = false } = {}) {
  return unstable_cache(
    () => getPlatformAnnouncementsFromDb({ enabledOnly }),
    ["platform-announcements", enabledOnly ? "enabled" : "all"],
    {
      revalidate: cacheDurations.platform,
      tags: [cacheTags.platform, cacheTags.platformAnnouncements],
    },
  )();
}
