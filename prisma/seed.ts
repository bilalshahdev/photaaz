import { PrismaClient } from "@prisma/client";
import { benefitFeatures, pricingPlans, themeShowcases } from "../src/data/marketing";
import { managedPhotographyTypes, supportRequests } from "../src/data/platform-admin";

const prisma = new PrismaClient();

const features = [
  {
    key: "blogs",
    name: "Blogs",
    description: "Publish SEO-friendly articles and stories."
  },
  {
    key: "customDomains",
    name: "Custom domains",
    description: "Connect verified custom domains on paid plans."
  },
  {
    key: "premiumThemes",
    name: "Premium themes",
    description: "Unlock paid code-based portfolio themes."
  },
  {
    key: "watermarks",
    name: "Watermarks",
    description: "Apply future watermark workflows to media."
  },
  {
    key: "clientProofing",
    name: "Client proofing",
    description: "Future client selection and favorites workflows."
  }
];

const plans = [
  {
    key: "free",
    name: "Free",
    monthlyPrice: 0,
    annualPrice: 0,
    enabledFeatures: {
      blogs: { enabled: true, limit: 3 },
      customDomains: { enabled: false },
      premiumThemes: { enabled: false },
      watermarks: { enabled: false },
      clientProofing: { enabled: false }
    }
  },
  {
    key: "pro",
    name: "Pro",
    monthlyPrice: 1900,
    annualPrice: 19000,
    enabledFeatures: {
      blogs: { enabled: true },
      customDomains: { enabled: true, limit: 3 },
      premiumThemes: { enabled: true },
      watermarks: { enabled: false },
      clientProofing: { enabled: false }
    }
  },
  {
    key: "studio",
    name: "Studio",
    monthlyPrice: 4900,
    annualPrice: 49000,
    enabledFeatures: {
      blogs: { enabled: true },
      customDomains: { enabled: true, limit: 10 },
      premiumThemes: { enabled: true },
      watermarks: { enabled: true },
      clientProofing: { enabled: true }
    }
  }
] as const;

async function seedFeaturesAndPlans() {
  const featureRecords = new Map<string, { id: string }>();

  for (const feature of features) {
    const record = await prisma.feature.upsert({
      where: { key: feature.key },
      update: {
        name: feature.name,
        description: feature.description
      },
      create: feature
    });

    featureRecords.set(feature.key, record);
  }

  for (const plan of plans) {
    const planRecord = await prisma.plan.upsert({
      where: { key: plan.key },
      update: {
        name: plan.name,
        monthlyPrice: plan.monthlyPrice,
        annualPrice: plan.annualPrice,
        enabled: true
      },
      create: {
        key: plan.key,
        name: plan.name,
        monthlyPrice: plan.monthlyPrice,
        annualPrice: plan.annualPrice,
        enabled: true
      }
    });

    for (const [featureKey, access] of Object.entries(plan.enabledFeatures)) {
      const feature = featureRecords.get(featureKey);

      if (!feature) {
        continue;
      }

      await prisma.planFeature.upsert({
        where: {
          planId_featureId: {
            planId: planRecord.id,
            featureId: feature.id
          }
        },
        update: {
          enabled: access.enabled,
          limit: "limit" in access ? access.limit : null
        },
        create: {
          planId: planRecord.id,
          featureId: feature.id,
          enabled: access.enabled,
          limit: "limit" in access ? access.limit : null
        }
      });
    }
  }
}

async function seedDemoTenant() {
  const proPlan = await prisma.plan.findUniqueOrThrow({
    where: { key: "pro" }
  });

  const tenant = await prisma.tenant.upsert({
    where: { slug: "demo" },
    update: {
      name: "Demo Photography",
      status: "ACTIVE",
      defaultLocale: "en"
    },
    create: {
      name: "Demo Photography",
      slug: "demo",
      status: "ACTIVE",
      defaultLocale: "en"
    }
  });

  await prisma.tenantSetting.upsert({
    where: { tenantId: tenant.id },
    update: {
      themeKey: "editorial",
      primaryColor: "#207567",
      accentColor: "#E86845",
      navbarStyle: "floating",
      galleryStyle: "masonry",
      cardStyle: "modern",
      footerStyle: "expanded"
    },
    create: {
      tenantId: tenant.id,
      themeKey: "editorial",
      primaryColor: "#207567",
      accentColor: "#E86845",
      navbarStyle: "floating",
      galleryStyle: "masonry",
      cardStyle: "modern",
      footerStyle: "expanded",
      businessDetails: {
        city: "Lahore",
        specialty: "Wedding and editorial photography"
      },
      socialLinks: {
        instagram: "https://instagram.com/demo"
      }
    }
  });

  await prisma.subscription.upsert({
    where: { tenantId: tenant.id },
    update: {
      planId: proPlan.id,
      status: "ACTIVE"
    },
    create: {
      tenantId: tenant.id,
      planId: proPlan.id,
      status: "ACTIVE"
    }
  });

  await prisma.domain.upsert({
    where: { hostname: "demo.localhost:3000" },
    update: {
      tenantId: tenant.id,
      status: "VERIFIED"
    },
    create: {
      tenantId: tenant.id,
      hostname: "demo.localhost:3000",
      status: "VERIFIED"
    }
  });

  const category = await prisma.category.upsert({
    where: {
      tenantId_slug: {
        tenantId: tenant.id,
        slug: "weddings"
      }
    },
    update: {
      name: "Weddings"
    },
    create: {
      tenantId: tenant.id,
      name: "Weddings",
      slug: "weddings"
    }
  });

  const wildlifeCategory = await prisma.category.upsert({
    where: {
      tenantId_slug: {
        tenantId: tenant.id,
        slug: "wildlife"
      }
    },
    update: {
      name: "Wildlife",
      parentId: null
    },
    create: {
      tenantId: tenant.id,
      name: "Wildlife",
      slug: "wildlife"
    }
  });

  for (const subcategory of [
    { name: "Birds", slug: "wildlife-birds" },
    { name: "Insects", slug: "wildlife-insects" },
    { name: "Mammals", slug: "wildlife-mammals" }
  ]) {
    await prisma.category.upsert({
      where: {
        tenantId_slug: {
          tenantId: tenant.id,
          slug: subcategory.slug
        }
      },
      update: {
        name: subcategory.name,
        parentId: wildlifeCategory.id
      },
      create: {
        tenantId: tenant.id,
        parentId: wildlifeCategory.id,
        name: subcategory.name,
        slug: subcategory.slug
      }
    });
  }

  const album = await prisma.album.upsert({
    where: {
      tenantId_slug: {
        tenantId: tenant.id,
        slug: "summer-wedding"
      }
    },
    update: {
      title: "Summer Wedding",
      description: "A warm outdoor wedding gallery used to validate public portfolio rendering.",
      categoryId: category.id,
      featured: true,
      published: true
    },
    create: {
      tenantId: tenant.id,
      categoryId: category.id,
      title: "Summer Wedding",
      slug: "summer-wedding",
      description: "A warm outdoor wedding gallery used to validate public portfolio rendering.",
      featured: true,
      published: true
    }
  });

  await prisma.photo.upsert({
    where: { id: "demo-photo-hero" },
    update: {
      tenantId: tenant.id,
      albumId: album.id,
      categoryId: category.id,
      title: "Golden hour portrait",
      alt: "Bride and groom photographed during golden hour",
      secureUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=85",
      cloudinaryId: "demo/golden-hour-portrait"
    },
    create: {
      id: "demo-photo-hero",
      tenantId: tenant.id,
      albumId: album.id,
      categoryId: category.id,
      title: "Golden hour portrait",
      alt: "Bride and groom photographed during golden hour",
      secureUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=85",
      cloudinaryId: "demo/golden-hour-portrait",
      width: 1600,
      height: 1067,
      dominantColor: "#8f6d4c"
    }
  });

  await prisma.page.upsert({
    where: {
      tenantId_slug: {
        tenantId: tenant.id,
        slug: "home"
      }
    },
    update: {
      title: "Demo Photography",
      published: true
    },
    create: {
      tenantId: tenant.id,
      type: "HOME",
      title: "Demo Photography",
      slug: "home",
      published: true,
      metaTitle: "Demo Photography Portfolio",
      metaDescription: "A sample portfolio website powered by PhotoFolio.",
      sections: [
        {
          type: "hero",
          enabled: true,
          heading: "Wedding stories with editorial warmth"
        },
        {
          type: "featuredGalleries",
          enabled: true
        }
      ]
    }
  });
}

async function seedPlatformSettings() {
  await prisma.platformSetting.upsert({
    where: { key: "app_config" },
    update: {
      value: {
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
      }
    },
    create: {
      key: "app_config",
      value: {
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
      }
    }
  });

  await prisma.platformSetting.upsert({
    where: { key: "landing" },
    update: {
      value: {
        hero: {
          eyebrow: "Portfolio SaaS for photographers",
          headline: "Create a professional photography website in minutes.",
          subheadline: "Pick a design, upload your photos, and publish a portfolio that makes clients want to book you.",
          primaryCta: "Start free",
          secondaryCta: "View themes"
        },
        seo: {
          title: "PhotoFolio - Professional Photography Websites in Minutes",
          description:
            "Create a professional photography website in minutes. Pick a design, upload photos, and publish a polished portfolio with themes, SEO, blogs, and custom domains."
        },
        features: benefitFeatures.map((feature, index) => ({
          title: feature.title,
          body: feature.body,
          iconKey: feature.icon.displayName ?? "feature",
          enabled: true,
          displayOrder: index + 1
        }))
      }
    },
    create: {
      key: "landing",
      value: {
        hero: {
          eyebrow: "Portfolio SaaS for photographers",
          headline: "Create a professional photography website in minutes.",
          subheadline: "Pick a design, upload your photos, and publish a portfolio that makes clients want to book you.",
          primaryCta: "Start free",
          secondaryCta: "View themes"
        },
        seo: {
          title: "PhotoFolio - Professional Photography Websites in Minutes",
          description:
            "Create a professional photography website in minutes. Pick a design, upload photos, and publish a polished portfolio with themes, SEO, blogs, and custom domains."
        },
        features: benefitFeatures.map((feature, index) => ({
          title: feature.title,
          body: feature.body,
          iconKey: feature.icon.displayName ?? "feature",
          enabled: true,
          displayOrder: index + 1
        }))
      }
    }
  });

  for (const [index, theme] of themeShowcases.entries()) {
    await prisma.platformTheme.upsert({
      where: { slug: theme.slug },
      update: {
        name: theme.name,
        description: theme.description,
        image: theme.image,
        features: theme.features,
        iconKey: theme.slug,
        enabled: true,
        premium: index > 1,
        demoPath: `/themes/${theme.slug}/demo`,
        displayOrder: index + 1,
        seoTitle: `${theme.name} Photography Website Theme - PhotoFolio`,
        seoDescription: theme.description
      },
      create: {
        name: theme.name,
        slug: theme.slug,
        description: theme.description,
        image: theme.image,
        features: theme.features,
        iconKey: theme.slug,
        enabled: true,
        premium: index > 1,
        demoPath: `/themes/${theme.slug}/demo`,
        displayOrder: index + 1,
        seoTitle: `${theme.name} Photography Website Theme - PhotoFolio`,
        seoDescription: theme.description
      }
    });
  }

  const parentPhotographyTypes = managedPhotographyTypes.filter((type) => !type.parentSlug);
  const childPhotographyTypes = managedPhotographyTypes.filter((type) => type.parentSlug);

  for (const [index, type] of parentPhotographyTypes.entries()) {
    await prisma.platformPhotographyType.upsert({
      where: { slug: type.slug },
      update: {
        name: type.name,
        parentId: null,
        enabled: type.enabled,
        categorySeed: type.categorySeed,
        displayOrder: index + 1
      },
      create: {
        name: type.name,
        slug: type.slug,
        enabled: type.enabled,
        categorySeed: type.categorySeed,
        displayOrder: index + 1
      }
    });
  }

  for (const [index, type] of childPhotographyTypes.entries()) {
    const parent = await prisma.platformPhotographyType.findUnique({
      where: { slug: type.parentSlug ?? "" },
      select: { id: true }
    });

    if (!parent) {
      continue;
    }

    await prisma.platformPhotographyType.upsert({
      where: { slug: type.slug },
      update: {
        name: type.name,
        parentId: parent.id,
        enabled: type.enabled,
        categorySeed: type.categorySeed,
        displayOrder: index + 1
      },
      create: {
        name: type.name,
        slug: type.slug,
        parentId: parent.id,
        enabled: type.enabled,
        categorySeed: type.categorySeed,
        displayOrder: index + 1
      }
    });
  }

  for (const [index, plan] of pricingPlans.entries()) {
    await prisma.platformPricingPlan.upsert({
      where: { key: plan.name.toLowerCase() },
      update: {
        name: plan.name,
        price: plan.price,
        description: plan.description,
        features: plan.features,
        enabled: true,
        featured: Boolean(plan.featured),
        displayOrder: index + 1
      },
      create: {
        key: plan.name.toLowerCase(),
        name: plan.name,
        price: plan.price,
        description: plan.description,
        features: plan.features,
        enabled: true,
        featured: Boolean(plan.featured),
        displayOrder: index + 1
      }
    });
  }

  for (const request of supportRequests) {
    await prisma.platformSupportRequest.upsert({
      where: { id: request.id },
      update: {
        name: request.name,
        email: request.email,
        topic: request.topic,
        status: request.status,
        message: request.message
      },
      create: request
    });
  }
}

async function main() {
  await seedPlatformSettings();
  await seedFeaturesAndPlans();
  await seedDemoTenant();

  await prisma.announcement.upsert({
    where: { id: "welcome-announcement" },
    update: {
      title: "PhotoFolio MVP",
      body: "Your photography SaaS foundation is ready for onboarding and upload flows.",
      enabled: true,
      marquee: true
    },
    create: {
      id: "welcome-announcement",
      title: "PhotoFolio MVP",
      body: "Your photography SaaS foundation is ready for onboarding and upload flows.",
      enabled: true,
      marquee: true
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
