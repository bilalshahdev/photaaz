import { prisma } from "@/lib/db/prisma";
import { getPublicEmailDeliverySettings } from "@/services/email/email-service";
import type { AppLocale } from "@/i18n/locales";
import { syncSubscriptionLifecycle } from "@/services/subscription/lifecycle";
import type { LocalizedString, LocalizedStringList } from "@/services/platform/platform-data";
import { defaultPlatformMediaPolicy, type PlatformMediaPolicy } from "@/services/platform/media-policy";

export async function getAdminDashboardStats() {
  await syncSubscriptionLifecycle();

  const now = new Date();
  const expiringSoonEnd = new Date(now);
  expiringSoonEnd.setDate(expiringSoonEnd.getDate() + 7);

  const [tenants, users, activeSubscriptions, expiringSoonSubscriptions, expiredSubscriptions, supportOpen, coupons, notifications, revenue, totalPhotos, totalAlbums, totalBlogs, pendingModeration, pendingCategoryRequests] = await Promise.all([
    prisma.tenant.count(),
    prisma.user.count(),
    prisma.subscription.count({ where: { status: { in: ["ACTIVE", "TRIALING"] } } }),
    prisma.subscription.count({
      where: {
        status: { in: ["ACTIVE", "TRIALING", "PAST_DUE"] },
        currentPeriodEnds: { gte: now, lte: expiringSoonEnd }
      }
    }),
    prisma.subscription.count({ where: { status: "EXPIRED" } }),
    prisma.platformSupportRequest.count({ where: { status: "Open" } }),
    prisma.coupon.count({ where: { enabled: true } }),
    prisma.clientNotification.count({ where: { status: "UNREAD" } }),
    prisma.subscription.findMany({
      where: { status: { in: ["ACTIVE", "TRIALING"] } },
      include: { plan: true }
    }),
    prisma.photo.count(),
    prisma.album.count(),
    prisma.blogPost.count(),
    prisma.photo.count({ where: { moderationStatus: "PENDING" } }),
    prisma.platformCategoryRequest.count({ where: { status: "PENDING" } })
  ]);

  const monthlyRevenue = revenue.reduce((total, subscription) => total + (subscription.plan.monthlyPrice ?? 0), 0) / 100;

  return {
    tenants,
    users,
    activeSubscriptions,
    expiringSoonSubscriptions,
    expiredSubscriptions,
    supportOpen,
    coupons,
    unreadNotifications: notifications,
    monthlyRevenue,
    totalPhotos,
    totalAlbums,
    totalBlogs,
    pendingModeration,
    pendingCategoryRequests
  };
}

export async function getAdminCustomers() {
  await syncSubscriptionLifecycle();

  return prisma.tenant.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      owner: true,
      settings: true,
      subscription: { include: { plan: true } },
      _count: {
        select: {
          albums: true,
          photos: true,
          blogs: true,
          notifications: true
        }
      }
    }
  });
}

export async function getAdminCustomerById(id: string) {
  await syncSubscriptionLifecycle();

  return prisma.tenant.findUnique({
    where: { id },
    include: {
      owner: true,
      settings: true,
      subscription: {
        include: {
          plan: {
            include: {
              features: {
                include: {
                  feature: true
                },
                orderBy: {
                  createdAt: "asc"
                }
              }
            }
          }
        }
      },
      domains: { orderBy: { createdAt: "desc" } },
      categories: { orderBy: { createdAt: "asc" } },
      albums: { orderBy: { createdAt: "desc" }, take: 10, include: { _count: { select: { photos: true } } } },
      pages: { orderBy: { createdAt: "asc" } },
      notifications: { orderBy: { createdAt: "desc" }, take: 10 },
      _count: {
        select: {
          albums: true,
          photos: true,
          blogs: true
        }
      }
    }
  });
}

export async function getAdminConversationInbox() {
  return prisma.conversationThread.findMany({
    orderBy: {
      updatedAt: "desc"
    },
    include: {
      tenant: {
        select: {
          id: true,
          name: true,
          slug: true
        }
      },
      messages: {
        orderBy: {
          createdAt: "asc"
        }
      }
    }
  });
}

export async function getAdminPlans() {
  return prisma.plan.findMany({
    orderBy: [{ displayOrder: "asc" }, { monthlyPrice: "asc" }, { name: "asc" }],
    include: {
      features: { include: { feature: true }, orderBy: { createdAt: "asc" } },
      _count: { select: { subscriptions: true } }
    }
  });
}

export async function getAdminFeatures() {
  return prisma.feature.findMany({
    orderBy: [{ name: "asc" }],
    include: {
      _count: {
        select: {
          plans: true
        }
      }
    }
  });
}

export async function getAdminCoupons() {
  return prisma.coupon.findMany({
    orderBy: { createdAt: "desc" }
  });
}

export async function getAdminCategoryRequests() {
  return prisma.platformCategoryRequest.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    include: {
      tenant: {
        select: {
          id: true,
          name: true,
          slug: true,
          subscription: {
            include: {
              plan: true
            }
          }
        }
      },
      parentType: true
    }
  });
}

export async function getAdminEmailSettings() {
  const settings = await prisma.emailSetting.findMany({
    orderBy: [{ category: "asc" }, { label: "asc" }]
  });

  if (settings.length) {
    return settings;
  }

  return [
    { id: "subscription-expiring", key: "subscription.expiring", label: "Subscription expiring", description: "Notify clients before a package ends.", enabled: true, category: "subscription", createdAt: new Date(), updatedAt: new Date() },
    { id: "subscription-ended", key: "subscription.ended", label: "Subscription ended", description: "Notify clients when package access ends.", enabled: true, category: "subscription", createdAt: new Date(), updatedAt: new Date() },
    { id: "account-created", key: "account.created", label: "Account created", description: "Welcome email after account/site creation.", enabled: true, category: "account", createdAt: new Date(), updatedAt: new Date() },
    { id: "support-inquiry", key: "support.inquiry", label: "Platform support inquiry", description: "Notify the platform owner when someone submits the main-site support form.", enabled: true, category: "support", createdAt: new Date(), updatedAt: new Date() },
    { id: "tenant-inquiry", key: "tenant.inquiry", label: "Portfolio visitor inquiry", description: "Notify a client when a visitor submits their portfolio contact form.", enabled: true, category: "support", createdAt: new Date(), updatedAt: new Date() },
    { id: "manual-email", key: "manual.email", label: "Manual emails", description: "Allow super admin to send manual emails.", enabled: true, category: "manual", createdAt: new Date(), updatedAt: new Date() }
  ];
}

export async function getAdminEmailDeliverySettings() {
  return getPublicEmailDeliverySettings();
}

export type PlatformAppConfig = {
  brandName: string;
  brandFont: import("@/lib/brand-fonts").BrandFont;
  brandFontSize: import("@/lib/brand-fonts").BrandFontSize;
  signatureColor: string;
  faviconUrl: string;
  appleTouchIconUrl: string;
  socialPreviewImageUrl: string;
  seoKeywords: LocalizedStringList;
  supportEmail: string;
  salesEmail: string;
  footerText: LocalizedString;
  copyrightText: LocalizedString;
  companyAddress: string;
  dashboardNotice: LocalizedString;
  themeSwitchCooldownDays: number;
  media: PlatformMediaPolicy;
  phone: {
    label: string;
    value: string;
    enabled: boolean;
  };
  creatorLink: {
    label: string;
    href: string;
    enabled: boolean;
  };
  socialLinks: {
    instagram: PlatformExternalLink;
    facebook: PlatformExternalLink;
    youtube: PlatformExternalLink;
    linkedin: PlatformExternalLink;
    snapchat: PlatformExternalLink;
  };
};

export type PlatformExternalLink = {
  label: string;
  href: string;
  enabled: boolean;
};

export const defaultPlatformAppConfig: PlatformAppConfig = {
  brandName: "Photaaz",
  brandFont: "inter",
  brandFontSize: "md",
  signatureColor: "#0f766e",
  faviconUrl: "/favicon.svg",
  appleTouchIconUrl: "/favicon.svg",
  socialPreviewImageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=90",
  seoKeywords: {
    en: ["photography website", "photography portfolio", "photographer website", "photo gallery website", "portfolio website builder"]
  },
  supportEmail: "bilalshah.dev@gmail.com",
  salesEmail: "bilalshah.dev@gmail.com",
  footerText: { en: "Clean websites for photographers, built to showcase visual work." },
  copyrightText: { en: "Copyright (c) {year} Photaaz. All rights reserved." },
  companyAddress: "Islamabad, Pakistan",
  dashboardNotice: { en: "" },
  themeSwitchCooldownDays: 14,
  media: defaultPlatformMediaPolicy,
  phone: {
    label: "Phone",
    value: "",
    enabled: false
  },
  creatorLink: {
    label: "Bilal Shah",
    href: "https://bilalshah.dev/",
    enabled: true
  },
  socialLinks: {
    instagram: { label: "Instagram", href: "https://www.instagram.com/bilalshah.photos/", enabled: true },
    facebook: { label: "Facebook", href: "https://www.facebook.com/reallybilalshah", enabled: true },
    youtube: { label: "YouTube", href: "https://www.youtube.com/@bilalshahvlogs", enabled: true },
    linkedin: { label: "LinkedIn", href: "https://www.linkedin.com/in/bilalshahdev/", enabled: true },
    snapchat: { label: "Snapchat", href: "https://www.snapchat.com/add/reallybilalshah", enabled: true }
  }
};

export async function getPlatformAppConfig(): Promise<PlatformAppConfig> {
  const setting = await prisma.platformSetting.findUnique({ where: { key: "app_config" } });
  const savedConfig = setting?.value && typeof setting.value === "object" ? (setting.value as Partial<PlatformAppConfig>) : {};

  return {
    ...defaultPlatformAppConfig,
    ...savedConfig,
    brandName: savedConfig.brandName ?? defaultPlatformAppConfig.brandName,
    signatureColor: savedConfig.signatureColor ?? defaultPlatformAppConfig.signatureColor,
    faviconUrl: savedConfig.faviconUrl ?? defaultPlatformAppConfig.faviconUrl,
    appleTouchIconUrl: savedConfig.appleTouchIconUrl ?? defaultPlatformAppConfig.appleTouchIconUrl,
    socialPreviewImageUrl: savedConfig.socialPreviewImageUrl ?? defaultPlatformAppConfig.socialPreviewImageUrl,
    seoKeywords: savedConfig.seoKeywords ?? defaultPlatformAppConfig.seoKeywords,
    copyrightText: savedConfig.copyrightText ?? defaultPlatformAppConfig.copyrightText,
    themeSwitchCooldownDays: typeof savedConfig.themeSwitchCooldownDays === "number" ? savedConfig.themeSwitchCooldownDays : defaultPlatformAppConfig.themeSwitchCooldownDays,
    media: {
      ...defaultPlatformAppConfig.media,
      ...(savedConfig.media ?? {}),
      platformBranding: {
        ...defaultPlatformAppConfig.media.platformBranding,
        ...(savedConfig.media?.platformBranding ?? {})
      }
    },
    phone: {
      ...defaultPlatformAppConfig.phone,
      ...(savedConfig.phone ?? {})
    },
    creatorLink: {
      ...defaultPlatformAppConfig.creatorLink,
      ...(savedConfig.creatorLink ?? {})
    },
    socialLinks: {
      instagram: { ...defaultPlatformAppConfig.socialLinks.instagram, ...(savedConfig.socialLinks?.instagram ?? {}) },
      facebook: { ...defaultPlatformAppConfig.socialLinks.facebook, ...(savedConfig.socialLinks?.facebook ?? {}) },
      youtube: { ...defaultPlatformAppConfig.socialLinks.youtube, ...(savedConfig.socialLinks?.youtube ?? {}) },
      linkedin: { ...defaultPlatformAppConfig.socialLinks.linkedin, ...(savedConfig.socialLinks?.linkedin ?? {}) },
      snapchat: { ...defaultPlatformAppConfig.socialLinks.snapchat, ...(savedConfig.socialLinks?.snapchat ?? {}) }
    }
  };
}

export type TranslationLocaleConfig = {
  code: AppLocale;
  label: string;
  nativeLabel: string;
  direction: "ltr" | "rtl";
  enabled: boolean;
  priceCents: number;
  billingNote: string;
};

export const predefinedTranslationLocales: TranslationLocaleConfig[] = [
  {
    code: "en",
    label: "English",
    nativeLabel: "English",
    direction: "ltr",
    enabled: true,
    priceCents: 0,
    billingNote: "Default platform language"
  },
  {
    code: "es",
    label: "Spanish",
    nativeLabel: "Español",
    direction: "ltr",
    enabled: true,
    priceCents: 500,
    billingNote: "Latin America & Spain"
  },
  {
    code: "ar",
    label: "Arabic",
    nativeLabel: "العربية",
    direction: "rtl",
    enabled: true,
    priceCents: 500,
    billingNote: "Middle East & North Africa"
  },
  {
    code: "tr",
    label: "Turkish",
    nativeLabel: "Türkçe",
    direction: "ltr",
    enabled: true,
    priceCents: 500,
    billingNote: "Turkey"
  },
  {
    code: "hi",
    label: "Hindi",
    nativeLabel: "हिन्दी",
    direction: "ltr",
    enabled: true,
    priceCents: 500,
    billingNote: "India"
  },
  {
    code: "pt",
    label: "Portuguese",
    nativeLabel: "Português",
    direction: "ltr",
    enabled: true,
    priceCents: 500,
    billingNote: "Brazil & Portugal"
  },
  {
    code: "de",
    label: "German",
    nativeLabel: "Deutsch",
    direction: "ltr",
    enabled: true,
    priceCents: 500,
    billingNote: "Germany, Austria, Switzerland"
  },
  {
    code: "fr",
    label: "French",
    nativeLabel: "Français",
    direction: "ltr",
    enabled: true,
    priceCents: 500,
    billingNote: "France, Canada, North Africa"
  }
];

function isTranslationLocaleConfig(value: unknown): value is TranslationLocaleConfig[] {
  return Array.isArray(value) && value.every((item) => item && typeof item === "object" && "code" in item && "enabled" in item && "priceCents" in item);
}

export async function getTranslationLocaleConfig(): Promise<TranslationLocaleConfig[]> {
  const setting = await prisma.platformSetting.findUnique({ where: { key: "translation_locales" } });
  const saved = isTranslationLocaleConfig(setting?.value) ? setting.value : [];

  return predefinedTranslationLocales.map((locale) => ({
    ...locale,
    ...(saved.find((item) => item.code === locale.code) ?? {})
  }));
}

export async function getEnabledTranslationLocales(): Promise<AppLocale[]> {
  const locales = await getTranslationLocaleConfig();
  const enabledLocales = locales.filter((locale) => locale.enabled).map((locale) => locale.code);

  return enabledLocales.includes("en") ? enabledLocales : ["en", ...enabledLocales];
}
