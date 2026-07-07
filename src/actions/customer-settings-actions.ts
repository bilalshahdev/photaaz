"use server";

import { z } from "zod";
import { revalidateTenantDashboard, revalidateTenantPublic } from "@/lib/cache";
import { prisma } from "@/lib/db/prisma";
import { canPlanUseThemeWithLimit, themes, themeKeys } from "@/config/themes";
import { defaultPlatformAppConfig, type PlatformAppConfig } from "@/services/admin/admin-data";
import { saveTenantImageUpload } from "@/services/storage/local-upload";
import { normalizeTenantWatermark } from "@/services/platform/media-policy";
import { getTenantPlanAccess, hasFeatureInAccess, planLimitKeys } from "@/services/subscription/plan-limits";

const sectionKeys = ["hero", "featuredPhotos", "categories", "galleries", "contact", "footer"] as const;
const socialLinkKeys = ["instagram", "facebook", "youtube", "linkedin", "snapchat", "pinterest", "behance", "tiktok"] as const;
const pageHeaderKeys = ["gallery", "categories", "blog", "about"] as const;

const customerSiteSettingsSchema = z.object({
  tenantSlug: z.string().min(1),
  heroTitle: z.string().trim().min(2).max(120),
  specialty: z.string().trim().min(2).max(80),
  tagline: z.string().trim().min(2).max(220),
  currentHeroImage: z.string().trim().max(2048).optional(),
  currentHeroImages: z.string().trim().max(12000).optional(),
  pageHeaders: z.record(
    z.enum(pageHeaderKeys),
    z.object({
      image: z.string().trim().max(2048).optional(),
      description: z.string().trim().max(220).optional()
    })
  ),
  featuredPhotos: z.boolean(),
  categories: z.boolean(),
  galleries: z.boolean(),
  hero: z.boolean(),
  contact: z.boolean(),
  footer: z.boolean(),
  featuredSource: z.enum(["selected", "all", "category", "subcategory", "gallery"]),
  featuredSourceId: z.string().trim().max(120).optional(),
  featuredPhotoIds: z.array(z.string().trim().min(1)).default([]),
  featuredLimit: z.coerce.number().int().min(3).max(60),
  featuredColumns: z.enum(["1", "2", "3", "4", "masonry"]),
  featuredGridStyle: z.enum(["square", "portrait", "landscape", "tiles", "mixed"]),
  watermark: z.object({
    enabled: z.boolean(),
    text: z.string().trim().max(40).optional(),
    position: z.enum(["bottom-left", "bottom-center", "bottom-right", "center"]),
    size: z.enum(["small", "medium", "large"]),
    opacity: z.coerce.number().min(0.1).max(1),
    backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    backgroundOpacity: z.coerce.number().min(0).max(1),
    textColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    borderColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    borderOpacity: z.coerce.number().min(0).max(1)
  }),
  socialLinks: z.record(
    z.enum(socialLinkKeys),
    z.object({
      href: z.string().trim().max(2048).optional(),
      enabled: z.boolean()
    })
  )
});

const customerThemeSchema = z.object({
  tenantSlug: z.string().min(1),
  themeKey: z.enum(themeKeys)
});

const customerProfileSchema = z.object({
  tenantSlug: z.string().min(1),
  displayName: z.string().trim().min(2).max(80),
  headline: z.string().trim().min(2).max(140),
  email: z.string().trim().email(),
  phone: z.string().trim().max(40).optional(),
  location: z.string().trim().min(2).max(100),
  bio: z.string().trim().max(1800).optional()
});

export type CustomerSettingsActionState = {
  status: "idle" | "success" | "error";
  message: string;
};

export async function updateCustomerSiteSettingsWithFeedback(_state: CustomerSettingsActionState, formData: FormData): Promise<CustomerSettingsActionState> {
  try {
    await updateCustomerSiteSettings(formData);

    return {
      status: "success",
      message: "Site settings saved successfully."
    };
  } catch (error) {
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Site settings could not be saved."
    };
  }
}

export async function applyCustomerTheme(formData: FormData) {
  const parsed = customerThemeSchema.parse({
    tenantSlug: String(formData.get("tenantSlug") ?? ""),
    themeKey: String(formData.get("themeKey") ?? "")
  });

  const tenant = await prisma.tenant.findUnique({
    where: { slug: parsed.tenantSlug },
    include: {
      settings: true,
      subscription: {
        include: {
          plan: true
        }
      }
    }
  });

  if (!tenant) {
    throw new Error("Tenant not found.");
  }

  const theme = themes.find((item) => item.key === parsed.themeKey);

  if (!theme) {
    throw new Error("Theme not found.");
  }

  const planAccess = await getTenantPlanAccess(parsed.tenantSlug);

  if (!canPlanUseThemeWithLimit(planAccess?.planKey ?? "free", theme, planAccess?.limits[planLimitKeys.premiumThemesLimit])) {
    throw new Error("This theme is not available on the current plan.");
  }

  const cooldownDays = await getThemeSwitchCooldownDays();
  const currentThemeKey = tenant.settings?.themeKey ?? "minimal";
  const isSwitchingTheme = currentThemeKey !== parsed.themeKey;

  if (isSwitchingTheme && cooldownDays > 0 && tenant.settings?.themeChangedAt) {
    const nextAllowedAt = addDays(tenant.settings.themeChangedAt, cooldownDays);

    if (nextAllowedAt.getTime() > Date.now()) {
      throw new Error(`You can switch themes again on ${formatDate(nextAllowedAt)}.`);
    }
  }

  await prisma.tenantSetting.upsert({
    where: { tenantId: tenant.id },
    create: {
      tenantId: tenant.id,
      themeKey: parsed.themeKey,
      themeChangedAt: isSwitchingTheme ? new Date() : tenant.settings?.themeChangedAt ?? null,
      businessDetails: {}
    },
    update: {
      themeKey: parsed.themeKey,
      ...(isSwitchingTheme ? { themeChangedAt: new Date() } : {})
    }
  });

  revalidateTenantPublic(parsed.tenantSlug);
  revalidateTenantDashboard(parsed.tenantSlug);
}

async function getThemeSwitchCooldownDays() {
  const setting = await prisma.platformSetting.findUnique({
    where: { key: "app_config" },
    select: { value: true }
  });
  const savedConfig = setting?.value && typeof setting.value === "object" ? (setting.value as Partial<PlatformAppConfig>) : {};
  const value = savedConfig.themeSwitchCooldownDays;

  return typeof value === "number" && Number.isFinite(value) ? value : defaultPlatformAppConfig.themeSwitchCooldownDays;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium"
  }).format(date);
}

export async function updateCustomerSiteSettings(formData: FormData) {
  const parsed = customerSiteSettingsSchema.parse({
    tenantSlug: String(formData.get("tenantSlug") ?? ""),
    heroTitle: String(formData.get("heroTitle") ?? ""),
    specialty: String(formData.get("specialty") ?? ""),
    tagline: String(formData.get("tagline") ?? ""),
    currentHeroImage: String(formData.get("currentHeroImage") ?? ""),
    currentHeroImages: String(formData.get("currentHeroImages") ?? ""),
    featuredSource: String(formData.get("featuredSource") ?? "selected"),
    featuredSourceId: String(formData.get("featuredSourceId") ?? ""),
    featuredPhotoIds: parseDelimitedList(String(formData.get("featuredPhotoIds") ?? "")),
    featuredLimit: String(formData.get("featuredLimit") ?? "12"),
    featuredColumns: String(formData.get("featuredColumns") ?? "3"),
    featuredGridStyle: String(formData.get("featuredGridStyle") ?? "mixed"),
    watermark: {
      enabled: formData.get("watermarkEnabled") === "on",
      text: String(formData.get("watermarkText") ?? ""),
      position: String(formData.get("watermarkPosition") ?? "bottom-right"),
      size: String(formData.get("watermarkSize") ?? "small"),
      opacity: String(formData.get("watermarkOpacity") ?? "0.9"),
      backgroundColor: String(formData.get("watermarkBackgroundColor") ?? "#000000"),
      backgroundOpacity: String(formData.get("watermarkBackgroundOpacity") ?? "0.35"),
      textColor: String(formData.get("watermarkTextColor") ?? "#ffffff"),
      borderColor: String(formData.get("watermarkBorderColor") ?? "#ffffff"),
      borderOpacity: String(formData.get("watermarkBorderOpacity") ?? "0.18")
    },
    socialLinks: Object.fromEntries(
      socialLinkKeys.map((key) => [
        key,
        {
          href: String(formData.get(`${key}Href`) ?? ""),
          enabled: formData.get(`${key}Enabled`) === "on"
        }
      ])
    ),
    pageHeaders: Object.fromEntries(
      pageHeaderKeys.map((key) => [
        key,
        {
          image: String(formData.get(`${key}HeaderImage`) ?? ""),
          description: String(formData.get(`${key}HeaderDescription`) ?? "")
        }
      ])
    ),
    ...Object.fromEntries(sectionKeys.map((key) => [key, readFormBoolean(formData, `${key}Enabled`, formData.get(key) === "on")]))
  });

  const tenant = await prisma.tenant.findUnique({
    where: { slug: parsed.tenantSlug },
    include: {
      settings: true,
      subscription: {
        include: {
          plan: true
        }
      }
    }
  });

  if (!tenant) {
    throw new Error("Tenant not found.");
  }

  const currentBusinessDetails = normalizeRecord(tenant.settings?.businessDetails);
  const currentHero = normalizeRecord(currentBusinessDetails.hero);
  const currentPageHeaders = normalizeRecord(currentBusinessDetails.pageHeaders);
  const currentWatermark = normalizeTenantWatermark(currentBusinessDetails.watermark);
  const planAccess = await getTenantPlanAccess(parsed.tenantSlug);
  const planKey = planAccess?.planKey ?? "free";
  const canHideFooter = !["basic", "free", "plus"].includes(planKey);
  const canUseCustomWatermark = hasFeatureInAccess(planAccess, "watermarks");
  const nextWatermark = canUseCustomWatermark
    ? {
        ...currentWatermark,
        ...parsed.watermark,
        text: parsed.watermark.text ?? ""
      }
    : currentWatermark;
  const heroImageLimit = planAccess?.limits[planLimitKeys.heroImagesTotal] ?? 1;
  const heroImageFiles = formData.getAll("heroImageFiles").filter((file): file is File => file instanceof File && file.size > 0);
  const existingHeroImages = trimToLimit(parseHeroImages(parsed.currentHeroImages, parsed.currentHeroImage, currentHero), heroImageLimit);

  if (heroImageLimit !== null && existingHeroImages.length + heroImageFiles.length > heroImageLimit) {
    throw new Error(`Your plan allows ${heroImageLimit} hero image${heroImageLimit === 1 ? "" : "s"}. Remove one before uploading more.`);
  }

  const uploadedHeroImages = await Promise.all(
    heroImageFiles.map((file) => saveTenantImageUpload(file, parsed.tenantSlug, { area: "others", folder: "hero" }))
  );
  const heroImages = [...existingHeroImages, ...uploadedHeroImages.map((upload) => upload.publicPath)];
  const heroImage = heroImages[0] ?? "";
  const pageHeaderFiles = Object.fromEntries(
    pageHeaderKeys.map((key) => {
      const file = formData.get(`${key}HeaderFile`);
      return [key, file instanceof File && file.size > 0 ? file : null];
    })
  ) as Record<(typeof pageHeaderKeys)[number], File | null>;
  const canUsePageHeaderImages = hasFeatureInAccess(planAccess, "pageHeaderImages");
  const uploadedPageHeaders = canUsePageHeaderImages
    ? Object.fromEntries(
        await Promise.all(
          pageHeaderKeys.map(async (key) => {
            const file = pageHeaderFiles[key];
            const currentHeader = normalizePageHeader(currentPageHeaders[key]);
            const existingImage = parsed.pageHeaders[key]?.image || currentHeader.image || "";
            const description = parsed.pageHeaders[key]?.description || currentHeader.description || "";

            if (!file) {
              return [key, { image: existingImage, title: currentHeader.title || "", description }];
            }

            const upload = await saveTenantImageUpload(file, parsed.tenantSlug, { area: "others", folder: "page-headers", fileLabel: key });
            return [key, { image: upload.publicPath, title: currentHeader.title || "", description }];
          })
        )
      )
    : Object.fromEntries(pageHeaderKeys.map((key) => [key, normalizePageHeader(currentPageHeaders[key])]));

  if (!heroImage) {
    throw new Error("Upload a hero image before saving settings.");
  }

  await prisma.tenantSetting.upsert({
    where: { tenantId: tenant.id },
    create: {
      tenantId: tenant.id,
      businessDetails: {
        ...currentBusinessDetails,
        hero: {
          title: parsed.heroTitle,
          specialty: parsed.specialty,
          tagline: parsed.tagline,
          image: heroImage,
          images: heroImages
        },
        pageHeaders: uploadedPageHeaders,
        socialLinks: parsed.socialLinks,
        watermark: nextWatermark,
        sections: buildHomeSections(formData, parsed, {
          footer: canHideFooter ? parsed.footer : true
        }),
        homepage: {
          featuredPhotos: {
            source: parsed.featuredSource,
            sourceId: parsed.featuredSourceId,
            selectedPhotoIds: parsed.featuredPhotoIds,
            limit: parsed.featuredLimit,
            columns: parsed.featuredColumns,
            gridStyle: parsed.featuredGridStyle,
            pagination: "infinite"
          }
        }
      }
    },
    update: {
      businessDetails: {
        ...currentBusinessDetails,
        hero: {
          title: parsed.heroTitle,
          specialty: parsed.specialty,
          tagline: parsed.tagline,
          image: heroImage,
          images: heroImages
        },
        pageHeaders: uploadedPageHeaders,
        socialLinks: parsed.socialLinks,
        watermark: nextWatermark,
        sections: buildHomeSections(formData, parsed, {
          footer: canHideFooter ? parsed.footer : true
        }),
        homepage: {
          featuredPhotos: {
            source: parsed.featuredSource,
            sourceId: parsed.featuredSourceId,
            selectedPhotoIds: parsed.featuredPhotoIds,
            limit: parsed.featuredLimit,
            columns: parsed.featuredColumns,
            gridStyle: parsed.featuredGridStyle,
            pagination: "infinite"
          }
        }
      }
    }
  });

  revalidateTenantPublic(parsed.tenantSlug);
  revalidateTenantDashboard(parsed.tenantSlug);
}

export async function updateCustomerProfile(formData: FormData) {
  const parsed = customerProfileSchema.parse({
    tenantSlug: String(formData.get("tenantSlug") ?? ""),
    displayName: String(formData.get("displayName") ?? ""),
    headline: String(formData.get("headline") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    location: String(formData.get("location") ?? ""),
    bio: String(formData.get("bio") ?? "")
  });

  const tenant = await prisma.tenant.findUnique({
    where: { slug: parsed.tenantSlug },
    include: { settings: true }
  });

  if (!tenant) {
    throw new Error("Tenant not found.");
  }

  const currentBusinessDetails = normalizeRecord(tenant.settings?.businessDetails);
  const currentProfile = normalizeRecord(currentBusinessDetails.profile);
  const avatarFile = formData.get("avatarFile");
  let avatarUrl = readString(currentProfile.avatarUrl) ?? "";

  if (avatarFile instanceof File && avatarFile.size > 0) {
    const upload = await saveTenantImageUpload(avatarFile, parsed.tenantSlug, { area: "others", folder: "profile", fileLabel: "avatar" });
    avatarUrl = upload.publicPath;
  }

  await prisma.tenantSetting.upsert({
    where: { tenantId: tenant.id },
    create: {
      tenantId: tenant.id,
      businessDetails: {
        ...currentBusinessDetails,
        profile: {
          displayName: parsed.displayName,
          headline: parsed.headline,
          avatarUrl,
          email: parsed.email,
          phone: parsed.phone,
          location: parsed.location,
          bio: parsed.bio
        }
      }
    },
    update: {
      businessDetails: {
        ...currentBusinessDetails,
        profile: {
          displayName: parsed.displayName,
          headline: parsed.headline,
          avatarUrl,
          email: parsed.email,
          phone: parsed.phone,
          location: parsed.location,
          bio: parsed.bio
        }
      }
    }
  });

  revalidateTenantPublic(parsed.tenantSlug);
  revalidateTenantDashboard(parsed.tenantSlug);
}

function normalizeRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function readFormBoolean(formData: FormData, key: string, fallback: boolean) {
  const value = formData.get(key);

  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  return fallback;
}

function readSectionOrder(formData: FormData, key: (typeof sectionKeys)[number], fallback: number) {
  const value = Number(formData.get(`${key}Order`));
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function buildHomeSections(
  formData: FormData,
  parsed: z.infer<typeof customerSiteSettingsSchema>,
  overrides: Partial<Record<(typeof sectionKeys)[number], boolean>> = {}
) {
  return Object.fromEntries(
    sectionKeys.map((key, index) => [
      key,
      {
        enabled: overrides[key] ?? parsed[key],
        displayOrder: readSectionOrder(formData, key, index + 1)
      }
    ])
  );
}

function readString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function normalizePageHeader(value: unknown) {
  if (typeof value === "string") {
    return {
      image: readString(value) ?? "",
      title: "",
      description: ""
    };
  }

  const header = normalizeRecord(value);

  return {
    image: readString(header.image) ?? "",
    title: readString(header.title) ?? "",
    description: readString(header.description) ?? ""
  };
}

function parseHeroImages(currentHeroImages: string | undefined, currentHeroImage: string | undefined, currentHero: Record<string, unknown>) {
  const parsedImages = safeJsonArray(currentHeroImages);
  const submittedCurrentImages = typeof currentHeroImages === "string" && currentHeroImages.trim().startsWith("[");
  const storedImages = Array.isArray(currentHero.images) ? currentHero.images.filter((value): value is string => typeof value === "string" && Boolean(value.trim())) : [];
  const fallbackImage = readString(currentHeroImage) ?? readString(currentHero.image);
  const images = submittedCurrentImages ? parsedImages : storedImages.length ? storedImages : fallbackImage ? [fallbackImage] : [];

  return Array.from(new Set(images.map((image) => image.trim()).filter(Boolean)));
}

function safeJsonArray(value: string | undefined) {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string" && Boolean(item.trim())) : [];
  } catch {
    return [];
  }
}

function trimToLimit(values: string[], limit: number | null | undefined) {
  return limit == null ? values : values.slice(0, limit);
}

function parseDelimitedList(value: string) {
  return Array.from(
    new Set(
      value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    )
  );
}
