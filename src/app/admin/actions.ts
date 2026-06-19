"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/db/prisma";
import { createTenantForOwner } from "@/services/tenant/create-tenant";
import { predefinedTranslationLocales } from "@/services/admin/admin-data";
import type { PlatformAnnouncementView, PlatformLandingSettings, PlatformPhotographyTypeView, PlatformPricingPlanView, PlatformThemeView } from "@/services/platform/platform-data";

const localizedStringSchema = z.union([
  z.string().min(2),
  z.object({
    en: z.string().min(2),
    ur: z.string().min(2)
  })
]);

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
      title: z.string().min(2),
      body: z.string().min(10),
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
  )
});

const themeSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  image: z.string().url(),
  description: z.string().min(10),
  features: z.array(z.string().min(1)),
  iconKey: z.string().min(1),
  enabled: z.boolean(),
  premium: z.boolean(),
  demoPath: z.string().min(2),
  displayOrder: z.number().int().min(1),
  seoTitle: z.string().nullable().optional(),
  seoDescription: z.string().nullable().optional()
});

const photographyTypeSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  parentSlug: z.string().nullable().optional(),
  enabled: z.boolean(),
  categorySeed: z.boolean(),
  displayOrder: z.number().int().min(1),
  children: z.array(z.unknown()).optional()
});

const pricingPlanSchema = z.object({
  key: z.string().min(2),
  name: z.string().min(2),
  price: z.string().min(1),
  description: z.string().min(10),
  features: z.array(z.string().min(1)),
  enabled: z.boolean(),
  featured: z.boolean(),
  displayOrder: z.number().int().min(1)
});

const announcementSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(2),
  body: z.string().min(5),
  linkLabel: z.string().nullable().optional(),
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

const registerCustomerSchema = z.object({
  studioName: z.string().min(2),
  slug: z.string().min(3).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  email: z.string().email(),
  planId: z.string().optional()
});

const planSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(2),
  monthlyPrice: z.coerce.number().int().min(0).nullable(),
  annualPrice: z.coerce.number().int().min(0).nullable(),
  lifetimePrice: z.coerce.number().int().min(0).nullable(),
  enabled: z.boolean()
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

const notificationSchema = z.object({
  tenantId: z.string().min(1),
  title: z.string().min(2),
  body: z.string().min(5),
  channel: z.string().default("dashboard")
});

const appConfigSchema = z.object({
  supportEmail: z.string().email(),
  salesEmail: z.string().email(),
  footerText: z.string().min(2),
  copyrightText: z.string().min(2),
  companyAddress: z.string().min(2),
  dashboardNotice: z.string().optional(),
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

const translationLocaleSchema = z.array(
  z.object({
    code: z.enum(["en", "ur"]),
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

export async function saveLandingSettings(settings: PlatformLandingSettings) {
  const value = landingSchema.parse(settings);

  await prisma.platformSetting.upsert({
    where: { key: "landing" },
    update: { value },
    create: { key: "landing", value }
  });

  revalidatePlatform();
}

export async function savePlatformThemes(themes: PlatformThemeView[]) {
  const parsedThemes = z.array(themeSchema).parse(themes);

  await prisma.$transaction(
    parsedThemes.map((theme) =>
      prisma.platformTheme.upsert({
        where: { slug: theme.slug },
        update: theme,
        create: theme
      })
    )
  );

  revalidatePlatform();
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
          name: type.name,
          parentId: null,
          enabled: type.enabled,
          categorySeed: type.categorySeed,
          displayOrder: type.displayOrder
        },
        create: {
          name: type.name,
          slug: type.slug,
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
          name: type.name,
          parentId: parent.id,
          enabled: type.enabled,
          categorySeed: type.categorySeed,
          displayOrder: type.displayOrder
        },
        create: {
          name: type.name,
          slug: type.slug,
          parentId: parent.id,
          enabled: type.enabled,
          categorySeed: type.categorySeed,
          displayOrder: type.displayOrder
        }
      });
    }
  });

  revalidatePlatform();
}

export async function savePricingPlans(plans: PlatformPricingPlanView[]) {
  const parsedPlans = z.array(pricingPlanSchema).parse(plans);

  await prisma.$transaction(
    parsedPlans.map((plan) =>
      prisma.platformPricingPlan.upsert({
        where: { key: plan.key },
        update: plan,
        create: plan
      })
    )
  );

  revalidatePlatform();
}

export async function savePlatformAnnouncements(announcements: PlatformAnnouncementView[]) {
  const parsedAnnouncements = z.array(announcementSchema).parse(announcements);

  await prisma.$transaction(
    parsedAnnouncements.map((announcement) =>
      prisma.announcement.upsert({
        where: { id: announcement.id },
        update: announcement,
        create: announcement
      })
    )
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

  await prisma.plan.update({
    where: { id: parsed.id },
    data: {
      name: parsed.name,
      monthlyPrice: parsed.monthlyPrice,
      annualPrice: parsed.annualPrice,
      lifetimePrice: parsed.lifetimePrice,
      enabled: parsed.enabled
    }
  });

  revalidatePath("/admin/packages");
  revalidatePath("/admin");
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

export async function saveEmailSetting(input: z.input<typeof emailSettingSchema>) {
  const parsed = emailSettingSchema.parse(input);

  await prisma.emailSetting.upsert({
    where: { key: parsed.key },
    update: parsed,
    create: parsed
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
  const allowedCodes = new Set(predefinedTranslationLocales.map((locale) => locale.code));
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
