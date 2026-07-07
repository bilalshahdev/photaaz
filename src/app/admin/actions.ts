"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/db/prisma";
import { revalidateTenantDashboard } from "@/lib/cache";
import { createTenantForOwner } from "@/services/tenant/create-tenant";
import { defaultPlatformAppConfig, predefinedTranslationLocales } from "@/services/admin/admin-data";
import { defaultPlatformMediaPolicy } from "@/services/platform/media-policy";
import { themeCustomizationKeys } from "@/config/theme-customization";
import { fallbackLandingSettings } from "@/services/platform/platform-data";
import { emailDeliverySettingKey, getEmailDeliverySettings } from "@/services/email/email-service";
import type { LocalizedString, PlatformAnnouncementView, PlatformLandingSettings, PlatformPhotographyTypeView, PlatformThemeView } from "@/services/platform/platform-data";

const localizedStringSchema = z.union([
  z.string().min(2),
  z.record(z.string().min(1), z.string().min(1))
]);

const localizedStringListSchema = z.union([
  z.array(z.string().min(1)),
  z.record(z.string().min(1), z.array(z.string().min(1)))
]);

const optionalLocalizedStringSchema = z.union([
  z.string(),
  z.record(z.string().min(1), z.string())
]).nullable().optional();

const landingSchema = z.object({
  sections: z.object({
    hero: z.object({ enabled: z.boolean(), displayOrder: z.number().int().min(1) }),
    themes: z.object({ enabled: z.boolean(), displayOrder: z.number().int().min(1) }),
    features: z.object({ enabled: z.boolean(), displayOrder: z.number().int().min(1) }),
    pricing: z.object({ enabled: z.boolean(), displayOrder: z.number().int().min(1) }),
    faq: z.object({ enabled: z.boolean(), displayOrder: z.number().int().min(1) }),
    contact: z.object({ enabled: z.boolean(), displayOrder: z.number().int().min(1) }),
    finalCta: z.object({ enabled: z.boolean(), displayOrder: z.number().int().min(1) })
  }),
  hero: z.object({
    eyebrow: localizedStringSchema,
    headline: localizedStringSchema,
    subheadline: localizedStringSchema,
    primaryCta: localizedStringSchema,
    secondaryCta: localizedStringSchema
  }),
  seo: z.object({
    title: localizedStringSchema,
    description: localizedStringSchema
  }),
  contact: z.object({
    eyebrow: localizedStringSchema,
    title: localizedStringSchema,
    body: localizedStringSchema,
    submitLabel: localizedStringSchema
  }),
  features: z.array(
    z.object({
      title: localizedStringSchema,
      body: localizedStringSchema,
      iconKey: z.string().min(1),
      enabled: z.boolean(),
      displayOrder: z.number().int().min(1)
    })
  ),
  faqs: z.array(
    z.object({
      question: localizedStringSchema,
      answer: localizedStringSchema,
      enabled: z.boolean(),
      displayOrder: z.number().int().min(1)
    })
  ),
  faqDisplayLimit: z.number().int().min(1).max(20)
});

const themeSchema = z.object({
  name: localizedStringSchema,
  slug: z.string().min(2),
  image: z.string().url(),
  description: localizedStringSchema,
  features: z.array(localizedStringSchema),
  iconKey: z.string().min(1),
  enabled: z.boolean(),
  premium: z.boolean(),
  demoPath: z.string().min(2),
  displayOrder: z.number().int().min(1),
  customization: z.object({
    allowed: z.object(Object.fromEntries(themeCustomizationKeys.map((key) => [key, z.boolean()])) as Record<(typeof themeCustomizationKeys)[number], z.ZodBoolean>),
    minPlan: z.object(Object.fromEntries(themeCustomizationKeys.map((key) => [key, z.string().min(2)])) as Record<(typeof themeCustomizationKeys)[number], z.ZodString>)
  }),
  seoTitle: optionalLocalizedStringSchema,
  seoDescription: optionalLocalizedStringSchema
});

const photographyTypeSchema = z.object({
  name: localizedStringSchema,
  slug: z.string().min(2),
  image: z.string().url().or(z.literal("")),
  parentSlug: z.string().nullable().optional(),
  enabled: z.boolean(),
  categorySeed: z.boolean(),
  displayOrder: z.number().int().min(1),
  children: z.array(z.unknown()).optional()
});

const categoryRequestReviewSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["APPROVED", "REJECTED"]),
  adminNote: z.string().optional()
});

const announcementSchema = z.object({
  id: z.string().min(1),
  title: localizedStringSchema,
  body: localizedStringSchema,
  linkLabel: optionalLocalizedStringSchema,
  linkHref: z.string().nullable().optional(),
  enabled: z.boolean(),
  marquee: z.boolean(),
  displayOrder: z.number().int().min(1)
});

const supportStatusSchema = z.object({
  id: z.string().min(1),
  status: z.string().min(2)
});

const tenantStatusSchema = z.object({
  tenantId: z.string().min(1),
  status: z.enum(["ACTIVE", "SUSPENDED", "DELETED"])
});

const tenantPlanSchema = z.object({
  tenantId: z.string().min(1),
  planId: z.string().min(1),
  status: z.enum(["TRIALING", "ACTIVE", "PAST_DUE", "CANCELED", "EXPIRED"]),
  currentPeriodEnds: z.string().optional(),
  adminNote: z.string().optional()
});

const tenantPackageExtensionSchema = z.object({
  tenantId: z.string().min(1),
  days: z.coerce.number().int().min(1).max(730),
  adminNote: z.string().optional()
});

const tenantThemeCooldownResetSchema = z.object({
  tenantId: z.string().min(1)
});

const photoModerationSchema = z.object({
  photoId: z.string().min(1),
  status: z.enum(["PENDING", "APPROVED", "REJECTED", "FLAGGED"]),
  moderationNote: z.string().optional()
});

const blogModerationSchema = z.object({
  blogId: z.string().min(1),
  status: z.enum(["APPROVED", "REJECTED"]),
  moderationNote: z.string().optional()
});

const registerCustomerSchema = z.object({
  studioName: z.string().min(2),
  slug: z.string().min(3).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  email: z.string().email(),
  planId: z.string().optional()
});

const planSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(2),
  description: z.string().optional(),
  monthlyPrice: z.coerce.number().int().min(0).nullable(),
  annualPrice: z.coerce.number().int().min(0).nullable(),
  lifetimePrice: z.coerce.number().int().min(0).nullable(),
  gracePeriodDays: z.coerce.number().int().min(0).max(90),
  enabled: z.boolean(),
  featured: z.boolean(),
  displayOrder: z.number().int().min(1),
  features: z.array(
    z.object({
      featureId: z.string().min(1),
      enabled: z.boolean(),
      limit: z.coerce.number().int().min(0).nullable()
    })
  )
});

const createPlanSchema = planSchema.omit({ id: true });

const featureSchema = z.object({
  id: z.string().optional(),
  key: z.string().min(2).regex(/^[a-z0-9]+(?:[.-][a-z0-9]+)*$/),
  name: z.string().min(2),
  description: z.string().optional()
});

const couponSchema = z.object({
  id: z.string().optional(),
  code: z.string().min(2).transform((value) => value.trim().toUpperCase()),
  type: z.enum(["PERCENT", "FIXED"]),
  amount: z.coerce.number().int().min(1),
  enabled: z.boolean(),
  maxRedemptions: z.coerce.number().int().min(1).nullable().optional(),
  expiresAt: z.string().optional(),
  notes: z.string().optional()
});

const emailSettingSchema = z.object({
  key: z.string().min(2),
  label: z.string().min(2),
  description: z.string().optional(),
  category: z.string().min(2),
  enabled: z.boolean()
});

const emailDeliverySchema = z.object({
  enabled: z.boolean(),
  provider: z.enum(["disabled", "resend", "smtp"]),
  fromName: z.string().trim().min(2).max(80),
  fromEmail: z.string().trim().email(),
  resendApiKey: z.string().trim().optional(),
  smtpHost: z.string().trim().optional(),
  smtpPort: z.coerce.number().int().positive().max(65535).optional(),
  smtpUsername: z.string().trim().optional(),
  smtpPassword: z.string().trim().optional(),
  smtpEncryption: z.enum(["none", "starttls", "ssl"])
});

const notificationSchema = z.object({
  tenantId: z.string().min(1),
  title: z.string().min(2),
  body: z.string().min(5),
  channel: z.string().default("dashboard")
});

const appConfigSchema = z.object({
  brandName: z.string().min(2),
  signatureColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  faviconUrl: z.string().min(1),
  appleTouchIconUrl: z.string().min(1),
  socialPreviewImageUrl: z.string().min(1),
  seoKeywords: localizedStringListSchema,
  supportEmail: z.string().email(),
  salesEmail: z.string().email(),
  footerText: z.string().min(2),
  copyrightText: z.string().min(2),
  companyAddress: z.string().min(2),
  dashboardNotice: z.string().optional(),
  themeSwitchCooldownDays: z.coerce.number().int().min(0).max(365),
  media: z.object({
    maxImageUploadMb: z.coerce.number().int().min(1).max(50),
    platformBranding: z.object({
      enabled: z.boolean(),
      text: z.string().trim().min(1).max(40),
      position: z.enum(["bottom-left", "bottom-center", "bottom-right", "center"]),
      size: z.enum(["small", "medium", "large"]),
      opacity: z.coerce.number().min(0.1).max(1),
      backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
      backgroundOpacity: z.coerce.number().min(0).max(1),
      textColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
      borderColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
      borderOpacity: z.coerce.number().min(0).max(1)
    })
  }),
  phone: z.object({
    label: z.string().min(2),
    value: z.string().optional(),
    enabled: z.boolean()
  }),
  creatorLink: z.object({
    label: z.string().min(2),
    href: z.string().optional(),
    enabled: z.boolean()
  }),
  socialLinks: z.object({
    instagram: z.object({ label: z.string().min(2), href: z.string().optional(), enabled: z.boolean() }),
    facebook: z.object({ label: z.string().min(2), href: z.string().optional(), enabled: z.boolean() }),
    youtube: z.object({ label: z.string().min(2), href: z.string().optional(), enabled: z.boolean() }),
    linkedin: z.object({ label: z.string().min(2), href: z.string().optional(), enabled: z.boolean() }),
    snapchat: z.object({ label: z.string().min(2), href: z.string().optional(), enabled: z.boolean() })
  })
});

const platformSeoSchema = z.object({
  seo: z.object({
    title: localizedStringSchema,
    description: localizedStringSchema,
    keywords: localizedStringListSchema
  }),
  seoKeywords: localizedStringListSchema,
  signatureColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  faviconUrl: z.string().min(1),
  appleTouchIconUrl: z.string().min(1),
  socialPreviewImageUrl: z.string().min(1)
});

const translationLocaleSchema = z.array(
  z.object({
    code: z.string().min(2),
    label: z.string().min(2),
    nativeLabel: z.string().min(1),
    direction: z.enum(["ltr", "rtl"]),
    enabled: z.boolean(),
    priceCents: z.coerce.number().int().min(0),
    billingNote: z.string().optional()
  })
);

function revalidatePlatform() {
  revalidatePath("/");
  revalidatePath("/ur");
  revalidatePath("/themes");
  revalidatePath("/ur/themes");
  revalidatePath("/get-started");
  revalidatePath("/ur/get-started");
  revalidatePath("/sitemap.xml");
  revalidatePath("/admin");
}

function defaultLocalizedText(value: LocalizedString | null | undefined) {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  return value.en ?? Object.values(value).find(Boolean) ?? "";
}

function localizedJson(value: LocalizedString | null | undefined) {
  if (!value) {
    return undefined;
  }

  return typeof value === "string" ? { en: value } : value;
}

function localizedListJson(values: LocalizedString[]) {
  return values.map((value) => localizedJson(value) ?? {});
}

export async function saveLandingSettings(settings: PlatformLandingSettings) {
  const value = landingSchema.parse(settings);

  await prisma.platformSetting.upsert({
    where: { key: "landing" },
    update: { value },
    create: { key: "landing", value }
  });

  revalidatePlatform();
}

export async function savePlatformSeoSettings(input: z.input<typeof platformSeoSchema>) {
  const parsed = platformSeoSchema.parse(input);
  const [landingSetting, appConfigSetting] = await Promise.all([
    prisma.platformSetting.findUnique({ where: { key: "landing" } }),
    prisma.platformSetting.findUnique({ where: { key: "app_config" } })
  ]);

  const currentLanding = landingSetting?.value && typeof landingSetting.value === "object" ? (landingSetting.value as PlatformLandingSettings) : fallbackLandingSettings;
  const savedAppConfig = appConfigSetting?.value && typeof appConfigSetting.value === "object" ? (appConfigSetting.value as Partial<typeof defaultPlatformAppConfig>) : {};
  const currentAppConfig = {
    ...defaultPlatformAppConfig,
    ...savedAppConfig,
    phone: {
      ...defaultPlatformAppConfig.phone,
      ...(savedAppConfig.phone ?? {})
    },
    creatorLink: {
      ...defaultPlatformAppConfig.creatorLink,
      ...(savedAppConfig.creatorLink ?? {})
    },
    media: {
      ...defaultPlatformMediaPolicy,
      ...(savedAppConfig.media ?? {}),
      platformBranding: {
        ...defaultPlatformMediaPolicy.platformBranding,
        ...(savedAppConfig.media?.platformBranding ?? {})
      }
    },
    socialLinks: {
      instagram: { ...defaultPlatformAppConfig.socialLinks.instagram, ...(savedAppConfig.socialLinks?.instagram ?? {}) },
      facebook: { ...defaultPlatformAppConfig.socialLinks.facebook, ...(savedAppConfig.socialLinks?.facebook ?? {}) },
      youtube: { ...defaultPlatformAppConfig.socialLinks.youtube, ...(savedAppConfig.socialLinks?.youtube ?? {}) },
      linkedin: { ...defaultPlatformAppConfig.socialLinks.linkedin, ...(savedAppConfig.socialLinks?.linkedin ?? {}) },
      snapchat: { ...defaultPlatformAppConfig.socialLinks.snapchat, ...(savedAppConfig.socialLinks?.snapchat ?? {}) }
    }
  };
  const landingValue = landingSchema.parse({
    ...fallbackLandingSettings,
    ...currentLanding,
    seo: parsed.seo
  });
  const appConfigValue = appConfigSchema.parse({
    ...defaultPlatformAppConfig,
    ...currentAppConfig,
    signatureColor: parsed.signatureColor,
    faviconUrl: parsed.faviconUrl,
    appleTouchIconUrl: parsed.appleTouchIconUrl,
    socialPreviewImageUrl: parsed.socialPreviewImageUrl,
    seoKeywords: parsed.seoKeywords
  });

  await prisma.$transaction([
    prisma.platformSetting.upsert({
      where: { key: "landing" },
      update: { value: landingValue },
      create: { key: "landing", value: landingValue }
    }),
    prisma.platformSetting.upsert({
      where: { key: "app_config" },
      update: { value: appConfigValue },
      create: { key: "app_config", value: appConfigValue }
    })
  ]);

  revalidatePlatform();
  revalidatePath("/admin/seo");
  revalidatePath("/admin/settings");
  revalidatePath("/robots.txt");
}

export async function savePlatformThemes(themes: PlatformThemeView[]) {
  const parsedThemes = z.array(themeSchema).parse(themes);

  await prisma.$transaction(
    parsedThemes.map((theme) =>
      prisma.platformTheme.upsert({
        where: { slug: theme.slug },
        update: themeData(theme),
        create: themeData(theme)
      })
    )
  );

  revalidatePlatform();
}

export async function savePlatformTheme(theme: PlatformThemeView) {
  const parsedTheme = themeSchema.parse(theme);
  const data = themeData(parsedTheme);

  await prisma.platformTheme.upsert({
    where: { slug: parsedTheme.slug },
    update: data,
    create: data
  });

  revalidatePlatform();
  revalidatePath("/admin/themes");
  revalidatePath(`/admin/themes/${parsedTheme.slug}`);
}

function themeData(theme: z.infer<typeof themeSchema>) {
  return {
    slug: theme.slug,
    name: defaultLocalizedText(theme.name),
    nameI18n: localizedJson(theme.name),
    image: theme.image,
    description: defaultLocalizedText(theme.description),
    descriptionI18n: localizedJson(theme.description),
    features: theme.features.map(defaultLocalizedText),
    featuresI18n: localizedListJson(theme.features),
    iconKey: theme.iconKey,
    enabled: theme.enabled,
    premium: theme.premium,
    demoPath: theme.demoPath,
    displayOrder: theme.displayOrder,
    customization: theme.customization,
    seoTitle: defaultLocalizedText(theme.seoTitle),
    seoTitleI18n: localizedJson(theme.seoTitle),
    seoDescription: defaultLocalizedText(theme.seoDescription),
    seoDescriptionI18n: localizedJson(theme.seoDescription)
  };
}

export async function savePhotographyTypes(types: PlatformPhotographyTypeView[]) {
  const parsedTypes = z.array(photographyTypeSchema).parse(types);
  const parentTypes = parsedTypes.filter((type) => !type.parentSlug);
  const childTypes = parsedTypes.filter((type) => type.parentSlug);

  await prisma.$transaction(async (tx) => {
    for (const type of parentTypes) {
      await tx.platformPhotographyType.upsert({
        where: { slug: type.slug },
        update: {
          name: defaultLocalizedText(type.name),
          nameI18n: localizedJson(type.name),
          image: type.image,
          parentId: null,
          enabled: type.enabled,
          categorySeed: type.categorySeed,
          displayOrder: type.displayOrder
        },
        create: {
          name: defaultLocalizedText(type.name),
          nameI18n: localizedJson(type.name),
          slug: type.slug,
          image: type.image,
          enabled: type.enabled,
          categorySeed: type.categorySeed,
          displayOrder: type.displayOrder
        }
      });
    }

    for (const type of childTypes) {
      const parent = await tx.platformPhotographyType.findUnique({
        where: { slug: type.parentSlug ?? "" },
        select: { id: true }
      });

      if (!parent) {
        continue;
      }

      await tx.platformPhotographyType.upsert({
        where: { slug: type.slug },
        update: {
          name: defaultLocalizedText(type.name),
          nameI18n: localizedJson(type.name),
          image: type.image,
          parentId: parent.id,
          enabled: type.enabled,
          categorySeed: type.categorySeed,
          displayOrder: type.displayOrder
        },
        create: {
          name: defaultLocalizedText(type.name),
          nameI18n: localizedJson(type.name),
          slug: type.slug,
          image: type.image,
          parentId: parent.id,
          enabled: type.enabled,
          categorySeed: type.categorySeed,
          displayOrder: type.displayOrder
        }
      });
    }

    const keepSlugs = parsedTypes.map((type) => type.slug);

    await tx.platformPhotographyType.deleteMany({
      where: {
        slug: {
          notIn: keepSlugs
        }
      }
    });
  });

  revalidatePlatform();
}

export async function reviewCategoryRequest(input: z.input<typeof categoryRequestReviewSchema>) {
  const parsed = categoryRequestReviewSchema.parse(input);
  const request = await prisma.platformCategoryRequest.findUnique({
    where: { id: parsed.id },
    include: {
      parentType: true,
      tenant: true
    }
  });

  if (!request) {
    throw new Error("Category request was not found.");
  }

  await prisma.$transaction(async (tx) => {
    if (parsed.status === "APPROVED") {
      const slug = await uniquePlatformTypeSlug(tx, request.slug);
      const displayOrder = await tx.platformPhotographyType.count({
        where: { parentId: request.parentTypeId ?? null }
      });

      await tx.platformPhotographyType.create({
        data: {
          name: request.name,
          nameI18n: localizedJson(request.name),
          slug,
          image: request.image,
          parentId: request.parentTypeId,
          enabled: true,
          categorySeed: true,
          displayOrder: displayOrder + 1
        }
      });
    }

    await tx.platformCategoryRequest.update({
      where: { id: request.id },
      data: {
        status: parsed.status,
        adminNote: parsed.adminNote
      }
    });

    await tx.clientNotification.create({
      data: {
        tenantId: request.tenantId,
        title: parsed.status === "APPROVED" ? "Category request approved" : "Category request rejected",
        body:
          parsed.status === "APPROVED"
            ? `${request.name} has been approved and added to the global category library.`
            : `${request.name} was not approved.${parsed.adminNote ? ` Note: ${parsed.adminNote}` : ""}`,
        channel: "dashboard"
      }
    });
  });

  revalidatePlatform();
  revalidatePath("/admin/categories");
  revalidatePath(`/admin/customers/${request.tenantId}`);
}

async function uniquePlatformTypeSlug(tx: Parameters<Parameters<typeof prisma.$transaction>[0]>[0], baseSlug: string) {
  let slug = baseSlug;
  let index = 2;

  while (await tx.platformPhotographyType.findUnique({ where: { slug }, select: { id: true } })) {
    slug = `${baseSlug}-${index}`;
    index += 1;
  }

  return slug;
}

export async function savePlatformAnnouncements(announcements: PlatformAnnouncementView[]) {
  const parsedAnnouncements = z.array(announcementSchema).parse(announcements);

  await prisma.$transaction(
    parsedAnnouncements.map((announcement) => {
      const data = {
        id: announcement.id,
        title: defaultLocalizedText(announcement.title),
        titleI18n: localizedJson(announcement.title),
        body: defaultLocalizedText(announcement.body),
        bodyI18n: localizedJson(announcement.body),
        linkLabel: defaultLocalizedText(announcement.linkLabel) || null,
        linkLabelI18n: localizedJson(announcement.linkLabel),
        linkHref: announcement.linkHref,
        enabled: announcement.enabled,
        marquee: announcement.marquee,
        displayOrder: announcement.displayOrder
      };

      return prisma.announcement.upsert({
        where: { id: announcement.id },
        update: data,
        create: data
      });
    })
  );

  revalidatePlatform();
  revalidatePath("/admin/announcements");
}

export async function updateSupportRequestStatus(input: { id: string; status: string }) {
  const parsedInput = supportStatusSchema.parse(input);

  await prisma.platformSupportRequest.update({
    where: { id: parsedInput.id },
    data: { status: parsedInput.status }
  });

  revalidatePath("/admin/support");
  revalidatePath("/admin");
}

export async function updateTenantStatus(input: z.input<typeof tenantStatusSchema>) {
  const parsed = tenantStatusSchema.parse(input);

  await prisma.tenant.update({
    where: { id: parsed.tenantId },
    data: { status: parsed.status }
  });

  revalidatePath("/admin/customers");
  revalidatePath(`/admin/customers/${parsed.tenantId}`);
  revalidatePath("/admin");
}

export async function updateTenantPlan(input: z.input<typeof tenantPlanSchema>) {
  const parsed = tenantPlanSchema.parse(input);
  const endsAt = parsed.currentPeriodEnds ? new Date(parsed.currentPeriodEnds) : null;

  await prisma.subscription.upsert({
    where: { tenantId: parsed.tenantId },
    update: {
      planId: parsed.planId,
      status: parsed.status,
      currentPeriodEnds: endsAt,
      adminNote: parsed.adminNote
    },
    create: {
      tenantId: parsed.tenantId,
      planId: parsed.planId,
      status: parsed.status,
      currentPeriodEnds: endsAt,
      adminNote: parsed.adminNote
    }
  });

  revalidatePath("/admin/customers");
  revalidatePath(`/admin/customers/${parsed.tenantId}`);
  revalidatePath("/admin");
}

export async function extendTenantPackage(input: z.input<typeof tenantPackageExtensionSchema>) {
  const parsed = tenantPackageExtensionSchema.parse(input);
  const tenant = await prisma.tenant.findUnique({
    where: { id: parsed.tenantId },
    include: { subscription: { include: { plan: true } } }
  });

  if (!tenant) {
    throw new Error("Customer was not found.");
  }

  if (!tenant.subscription) {
    throw new Error("Assign a package before extending access.");
  }

  const now = new Date();
  const currentEnd = tenant.subscription.currentPeriodEnds;
  const baseDate = currentEnd && currentEnd > now ? currentEnd : now;
  const nextEnd = new Date(baseDate);
  nextEnd.setDate(nextEnd.getDate() + parsed.days);

  const note = parsed.adminNote?.trim();
  const extensionNote = `${parsed.days} day${parsed.days === 1 ? "" : "s"} extension${note ? ` - ${note}` : ""}`;
  const existingNote = tenant.subscription.adminNote?.trim();

  await prisma.$transaction([
    prisma.subscription.update({
      where: { tenantId: tenant.id },
      data: {
        status: "ACTIVE",
        currentPeriodEnds: nextEnd,
        adminNote: existingNote ? `${existingNote}\n${extensionNote}` : extensionNote
      }
    }),
    prisma.clientNotification.create({
      data: {
        tenantId: tenant.id,
        title: "Package access extended",
        body: `Your ${tenant.subscription.plan.name} package has been extended by ${parsed.days} day${parsed.days === 1 ? "" : "s"}. New end date: ${nextEnd.toLocaleDateString("en-US")}.`,
        channel: "dashboard"
      }
    })
  ]);

  revalidatePath("/admin/customers");
  revalidatePath(`/admin/customers/${tenant.id}`);
  revalidatePath("/admin");
  revalidateTenantDashboard(tenant.slug);
}

export async function resetTenantThemeSwitchCooldown(input: z.input<typeof tenantThemeCooldownResetSchema>) {
  const parsed = tenantThemeCooldownResetSchema.parse(input);
  const tenant = await prisma.tenant.findUnique({
    where: { id: parsed.tenantId },
    include: { settings: true }
  });

  if (!tenant) {
    throw new Error("Customer was not found.");
  }

  await prisma.$transaction([
    prisma.tenantSetting.upsert({
      where: { tenantId: tenant.id },
      update: { themeChangedAt: null },
      create: {
        tenantId: tenant.id,
        themeKey: tenant.settings?.themeKey ?? "minimal",
        themeChangedAt: null
      }
    }),
    prisma.clientNotification.create({
      data: {
        tenantId: tenant.id,
        title: "Theme switch unlocked",
        body: "Your theme switch wait has been reset. You can apply another available theme now.",
        channel: "dashboard"
      }
    })
  ]);

  revalidatePath("/admin/customers");
  revalidatePath(`/admin/customers/${tenant.id}`);
  revalidatePath("/admin");
  revalidateTenantDashboard(tenant.slug);
}

export async function registerCustomerFromAdmin(input: z.input<typeof registerCustomerSchema>) {
  const parsed = registerCustomerSchema.parse(input);
  const existingTenant = await prisma.tenant.findUnique({ where: { slug: parsed.slug } });

  if (existingTenant) {
    throw new Error("This slug is already taken.");
  }

  const owner = await prisma.user.upsert({
    where: { email: parsed.email },
    update: { name: parsed.studioName },
    create: {
      id: randomUUID(),
      name: parsed.studioName,
      email: parsed.email
    }
  });

  const tenant = await createTenantForOwner({
    ownerUserId: owner.id,
    studioName: parsed.studioName,
    slug: parsed.slug,
    themeKey: "minimal",
    categories: ["wedding"],
    primaryType: "wedding",
    photoMode: "sample"
  });

  if (parsed.planId) {
    await prisma.subscription.upsert({
      where: { tenantId: tenant.id },
      update: { planId: parsed.planId, status: "ACTIVE" },
      create: { tenantId: tenant.id, planId: parsed.planId, status: "ACTIVE" }
    });
  }

  revalidatePath("/admin/customers");
  revalidatePath("/admin");
}

export async function savePlanPackage(input: z.input<typeof planSchema>) {
  const parsed = planSchema.parse(input);

  await prisma.$transaction(async (tx) => {
    await tx.plan.update({
      where: { id: parsed.id },
      data: {
        name: parsed.name,
        description: parsed.description ?? "",
        monthlyPrice: parsed.monthlyPrice,
        annualPrice: parsed.annualPrice,
        lifetimePrice: parsed.lifetimePrice,
        gracePeriodDays: parsed.gracePeriodDays,
        enabled: parsed.enabled,
        featured: parsed.featured,
        displayOrder: parsed.displayOrder
      }
    });

    for (const feature of parsed.features) {
      await tx.planFeature.upsert({
        where: {
          planId_featureId: {
            planId: parsed.id,
            featureId: feature.featureId
          }
        },
        update: {
          enabled: feature.enabled,
          limit: feature.limit
        },
        create: {
          planId: parsed.id,
          featureId: feature.featureId,
          enabled: feature.enabled,
          limit: feature.limit
        }
      });
    }
  });

  revalidatePath("/admin/packages");
  revalidatePath("/");
  revalidatePath("/ur");
  revalidatePath("/admin");
}

export async function createPlanPackage(input: z.input<typeof createPlanSchema>) {
  const parsed = createPlanSchema.parse(input);
  const key = await uniquePlanKey(slugifyKey(parsed.name));

  await prisma.$transaction(async (tx) => {
    const plan = await tx.plan.create({
      data: {
        key,
        name: parsed.name,
        description: parsed.description ?? "",
        monthlyPrice: parsed.monthlyPrice,
        annualPrice: parsed.annualPrice,
        lifetimePrice: parsed.lifetimePrice,
        gracePeriodDays: parsed.gracePeriodDays,
        enabled: parsed.enabled,
        featured: parsed.featured,
        displayOrder: parsed.displayOrder
      }
    });

    await tx.planFeature.createMany({
      data: parsed.features.map((feature) => ({
        planId: plan.id,
        featureId: feature.featureId,
        enabled: feature.enabled,
        limit: feature.limit
      })),
      skipDuplicates: true
    });
  });

  revalidatePath("/admin/packages");
  revalidatePath("/");
  revalidatePath("/ur");
  revalidatePath("/admin");
}

export async function deletePlanPackage(id: string) {
  const parsedId = z.string().min(1).parse(id);
  const subscriptions = await prisma.subscription.count({
    where: { planId: parsedId }
  });

  if (subscriptions > 0) {
    throw new Error("Packages with active subscription history cannot be deleted. Disable the package instead.");
  }

  await prisma.plan.delete({
    where: { id: parsedId }
  });

  revalidatePath("/admin/packages");
  revalidatePath("/");
  revalidatePath("/ur");
  revalidatePath("/admin");
}

export async function saveFeature(input: z.input<typeof featureSchema>) {
  const parsed = featureSchema.parse(input);

  if (parsed.id) {
    await prisma.feature.update({
      where: { id: parsed.id },
      data: {
        key: parsed.key,
        name: parsed.name,
        description: parsed.description
      }
    });
  } else {
    await prisma.feature.create({
      data: {
        key: parsed.key,
        name: parsed.name,
        description: parsed.description
      }
    });
  }

  revalidatePath("/admin/features");
  revalidatePath("/admin/packages");
  revalidatePath("/");
  revalidatePath("/ur");
}

export async function deleteFeature(id: string) {
  const parsedId = z.string().min(1).parse(id);

  await prisma.feature.delete({
    where: { id: parsedId }
  });

  revalidatePath("/admin/features");
  revalidatePath("/admin/packages");
  revalidatePath("/");
  revalidatePath("/ur");
}

function slugifyKey(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "plan";
}

async function uniquePlanKey(baseKey: string) {
  let key = baseKey;
  let index = 2;

  while (await prisma.plan.findUnique({ where: { key }, select: { id: true } })) {
    key = `${baseKey}-${index}`;
    index += 1;
  }

  return key;
}

export async function saveCoupon(input: z.input<typeof couponSchema>) {
  const parsed = couponSchema.parse(input);

  await prisma.coupon.upsert({
    where: { id: parsed.id ?? "" },
    update: {
      code: parsed.code,
      type: parsed.type,
      amount: parsed.amount,
      enabled: parsed.enabled,
      maxRedemptions: parsed.maxRedemptions,
      expiresAt: parsed.expiresAt ? new Date(parsed.expiresAt) : null,
      notes: parsed.notes
    },
    create: {
      code: parsed.code,
      type: parsed.type,
      amount: parsed.amount,
      enabled: parsed.enabled,
      maxRedemptions: parsed.maxRedemptions,
      expiresAt: parsed.expiresAt ? new Date(parsed.expiresAt) : null,
      notes: parsed.notes
    }
  });

  revalidatePath("/admin/coupons");
  revalidatePath("/admin");
}

export async function deleteCoupon(id: string) {
  const parsedId = z.string().min(1).parse(id);
  const coupon = await prisma.coupon.findUnique({
    where: { id: parsedId },
    select: { redeemedCount: true }
  });

  if (!coupon) {
    throw new Error("Coupon was not found.");
  }

  if (coupon.redeemedCount > 0) {
    throw new Error("Redeemed coupons cannot be deleted. Disable the coupon instead.");
  }

  await prisma.coupon.delete({
    where: { id: parsedId }
  });

  revalidatePath("/admin/coupons");
  revalidatePath("/admin");
}

export async function saveEmailSetting(input: z.input<typeof emailSettingSchema>) {
  const parsed = emailSettingSchema.parse(input);

  await prisma.emailSetting.upsert({
    where: { key: parsed.key },
    update: parsed,
    create: parsed
  });

  revalidatePath("/admin/emails");
}

export async function saveEmailDeliverySettings(input: z.input<typeof emailDeliverySchema>) {
  const parsed = emailDeliverySchema.parse(input);
  const current = await getEmailDeliverySettings();
  const next = {
    ...current,
    ...parsed,
    resendApiKey: parsed.resendApiKey || current.resendApiKey,
    smtpHost: parsed.smtpHost || undefined,
    smtpUsername: parsed.smtpUsername || undefined,
    smtpPassword: parsed.smtpPassword || current.smtpPassword,
    smtpPort: parsed.smtpPort || undefined
  };

  await prisma.platformSetting.upsert({
    where: { key: emailDeliverySettingKey },
    update: { value: JSON.parse(JSON.stringify(next)) },
    create: {
      key: emailDeliverySettingKey,
      value: JSON.parse(JSON.stringify(next))
    }
  });

  revalidatePath("/admin/emails");
}

export async function sendClientNotification(input: z.input<typeof notificationSchema>) {
  const parsed = notificationSchema.parse(input);

  await prisma.clientNotification.create({
    data: parsed
  });

  revalidatePath(`/admin/customers/${parsed.tenantId}`);
  revalidatePath("/admin");
}

export async function updatePhotoModeration(input: z.input<typeof photoModerationSchema>) {
  const parsed = photoModerationSchema.parse(input);
  const photo = await prisma.photo.update({
    where: {
      id: parsed.photoId
    },
    data: {
      moderationStatus: parsed.status,
      moderationNote: parsed.moderationNote?.trim() || null
    },
    include: {
      tenant: {
        select: {
          slug: true
        }
      }
    }
  });

  revalidatePath("/admin/moderation");
  revalidatePath("/admin");
  revalidatePath(`/site/${photo.tenant.slug}`);
  revalidatePath(`/site/${photo.tenant.slug}/gallery`);
  revalidatePath(`/site/${photo.tenant.slug}/categories`);
}

export async function updateBlogModeration(input: z.input<typeof blogModerationSchema>) {
  const parsed = blogModerationSchema.parse(input);
  const blog = await prisma.blogPost.update({
    where: {
      id: parsed.blogId
    },
    data: {
      moderationStatus: parsed.status,
      moderationNote: parsed.moderationNote?.trim() || null,
      publishedAt: parsed.status === "APPROVED" ? new Date() : null
    },
    include: {
      tenant: {
        select: {
          slug: true
        }
      }
    }
  });

  revalidatePath("/admin/moderation");
  revalidatePath("/admin");
  revalidatePath(`/site/${blog.tenant.slug}`);
  revalidatePath(`/site/${blog.tenant.slug}/blog`);
  revalidatePath(`/site/${blog.tenant.slug}/blog/${blog.slug}`);
  revalidateTenantDashboard(blog.tenant.slug);
}

export async function savePlatformAppConfig(input: z.input<typeof appConfigSchema>) {
  const value = appConfigSchema.parse(input);

  await prisma.platformSetting.upsert({
    where: { key: "app_config" },
    update: { value },
    create: { key: "app_config", value }
  });

  revalidatePath("/admin/settings");
  revalidatePath("/");
  revalidatePath("/ur");
}

export async function saveTranslationLocaleConfig(input: z.input<typeof translationLocaleSchema>) {
  const parsed = translationLocaleSchema.parse(input);
  const allowedCodes = new Set<string>(predefinedTranslationLocales.map((locale) => locale.code));
  const value = parsed
    .filter((locale) => allowedCodes.has(locale.code))
    .map((locale) => ({
      ...locale,
      billingNote: locale.billingNote ?? ""
    }));

  if (!value.some((locale) => locale.code === "en" && locale.enabled)) {
    value.push({
      code: "en",
      label: "English",
      nativeLabel: "English",
      direction: "ltr",
      enabled: true,
      priceCents: 0,
      billingNote: "Default platform language"
    });
  }

  await prisma.platformSetting.upsert({
    where: { key: "translation_locales" },
    update: { value },
    create: { key: "translation_locales", value }
  });

  revalidatePath("/");
  revalidatePath("/ur");
  revalidatePath("/themes");
  revalidatePath("/ur/themes");
  revalidatePath("/admin/translations");
}
