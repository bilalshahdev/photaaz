import { prisma } from "@/lib/db/prisma";
import type { AppLocale } from "@/i18n/locales";

export async function getAdminDashboardStats() {
  const [tenants, users, activeSubscriptions, supportOpen, coupons, notifications, revenue] = await Promise.all([
    prisma.tenant.count(),
    prisma.user.count(),
    prisma.subscription.count({ where: { status: { in: ["ACTIVE", "TRIALING"] } } }),
    prisma.platformSupportRequest.count({ where: { status: "Open" } }),
    prisma.coupon.count({ where: { enabled: true } }),
    prisma.clientNotification.count({ where: { status: "UNREAD" } }),
    prisma.subscription.findMany({
      where: { status: { in: ["ACTIVE", "TRIALING"] } },
      include: { plan: true }
    })
  ]);

  const monthlyRevenue = revenue.reduce((total, subscription) => total + (subscription.plan.monthlyPrice ?? 0), 0);

  return {
    tenants,
    users,
    activeSubscriptions,
    supportOpen,
    coupons,
    unreadNotifications: notifications,
    monthlyRevenue
  };
}

export async function getAdminCustomers() {
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
  return prisma.tenant.findUnique({
    where: { id },
    include: {
      owner: true,
      settings: true,
      subscription: { include: { plan: true } },
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

export async function getAdminPlans() {
  return prisma.plan.findMany({
    orderBy: { monthlyPrice: "asc" },
    include: {
      features: { include: { feature: true }, orderBy: { createdAt: "asc" } },
      _count: { select: { subscriptions: true } }
    }
  });
}

export async function getAdminCoupons() {
  return prisma.coupon.findMany({
    orderBy: { createdAt: "desc" }
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
    { id: "manual-email", key: "manual.email", label: "Manual emails", description: "Allow super admin to send manual emails.", enabled: true, category: "manual", createdAt: new Date(), updatedAt: new Date() }
  ];
}

export type PlatformAppConfig = {
  supportEmail: string;
  salesEmail: string;
  footerText: string;
  copyrightText: string;
  companyAddress: string;
  dashboardNotice: string;
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
  supportEmail: "bilalshah.dev@gmail.com",
  salesEmail: "bilalshah.dev@gmail.com",
  footerText: "Clean websites for photographers, built to showcase visual work.",
  copyrightText: "Copyright (c) {year} PhotoFolio. All rights reserved.",
  companyAddress: "Lahore, Pakistan",
  dashboardNotice: "",
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
    copyrightText: savedConfig.copyrightText ?? defaultPlatformAppConfig.copyrightText,
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
    code: "ur",
    label: "Urdu",
    nativeLabel: "اردو",
    direction: "rtl",
    enabled: true,
    priceCents: 500,
    billingNote: "Optional translated public site language"
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
