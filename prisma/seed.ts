import { PrismaClient } from "@prisma/client";
import { benefitFeatures, themeShowcases } from "../src/data/marketing";
import { managedPhotographyTypes, supportRequests } from "../src/data/platform-admin";
import { defaultThemeCustomizationPolicy } from "../src/config/theme-customization";

const prisma = new PrismaClient();

const features = [
  {
    key: "blogs",
    name: "Blogs",
    description: "Publish SEO-friendly articles and stories."
  },
  {
    key: "customDomains",
    name: "Custom domain",
    description: "Connect one verified custom domain on supported plans."
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
    key: "photos.total",
    name: "Total photos",
    description: "Maximum photos a tenant can upload overall."
  },
  {
    key: "heroImages.total",
    name: "Hero images",
    description: "Maximum homepage hero images a tenant can use."
  },
  {
    key: "pageHeaderImages",
    name: "Page header images",
    description: "Set custom cover images for public portfolio pages such as gallery, categories, blog, and about."
  },
  {
    key: "photos.perCategory",
    name: "Photos per category",
    description: "Maximum photos a tenant can upload to one category or subcategory."
  },
  {
    key: "categories.total",
    name: "Categories",
    description: "Maximum parent categories a tenant can organize."
  },
  {
    key: "subcategories.perCategory",
    name: "Subcategories per category",
    description: "Maximum subcategories allowed inside each parent category."
  },
  {
    key: "galleries.total",
    name: "Galleries",
    description: "Maximum curated galleries a tenant can publish."
  },
  {
    key: "photos.perGallery",
    name: "Photos per gallery",
    description: "Maximum photos allowed inside each gallery."
  },
  {
    key: "premiumThemes.limit",
    name: "Premium themes",
    description: "Number of premium themes available on this package."
  },
  {
    key: "themeComponents",
    name: "Custom theme components",
    description: "Access configurable theme components such as navigation and card styles."
  },
  {
    key: "advancedCustomization",
    name: "More customization",
    description: "Extended customization options beyond standard theme controls."
  },
  {
    key: "anyLanguageLocalization",
    name: "Any language localization",
    description: "Localization support for any language required by the customer."
  },
  {
    key: "freeMaintenance.months",
    name: "Free maintenance",
    description: "Included maintenance period after ownership purchase."
  },
  {
    key: "adminDashboard",
    name: "Admin dashboard",
    description: "Manage portfolio content from the customer dashboard."
  },
  {
    key: "responsiveDesign",
    name: "Responsive design",
    description: "Portfolio layouts adapt for mobile, tablet, and desktop screens."
  },
  {
    key: "categoryRequests.total",
    name: "Category requests",
    description: "Number of custom category or subcategory requests a tenant can submit."
  }
];

const plans = [
  {
    key: "free",
    name: "Free",
    description: "For starting a simple public portfolio.",
    monthlyPrice: 0,
    annualPrice: 0,
    lifetimePrice: null,
    gracePeriodDays: 0,
    featured: false,
    enabledFeatures: {
      blogs: { enabled: true, limit: 3 },
      customDomains: { enabled: false },
      premiumThemes: { enabled: false },
      watermarks: { enabled: false },
      "photos.total": { enabled: true, limit: 50 },
      "heroImages.total": { enabled: true, limit: 1 },
      pageHeaderImages: { enabled: false },
      "photos.perCategory": { enabled: true, limit: 20 },
      "categories.total": { enabled: true, limit: 3 },
      "subcategories.perCategory": { enabled: true, limit: 3 },
      "galleries.total": { enabled: true, limit: 3 },
      "photos.perGallery": { enabled: true, limit: 20 },
      "premiumThemes.limit": { enabled: false, limit: 0 },
      themeComponents: { enabled: false },
      adminDashboard: { enabled: true },
      responsiveDesign: { enabled: true },
      "categoryRequests.total": { enabled: false, limit: 0 }
    }
  },
  {
    key: "plus",
    name: "Plus",
    description: "For photographers who need a custom domain, more content, and richer presentation controls.",
    monthlyPrice: 1900,
    annualPrice: 19000,
    lifetimePrice: null,
    gracePeriodDays: 7,
    featured: true,
    enabledFeatures: {
      blogs: { enabled: true, limit: 10 },
      customDomains: { enabled: true },
      premiumThemes: { enabled: true },
      watermarks: { enabled: false },
      "photos.total": { enabled: true, limit: 300 },
      "heroImages.total": { enabled: true, limit: 3 },
      pageHeaderImages: { enabled: true },
      "photos.perCategory": { enabled: true, limit: 50 },
      "categories.total": { enabled: true, limit: 10 },
      "subcategories.perCategory": { enabled: true, limit: 5 },
      "galleries.total": { enabled: true, limit: 10 },
      "photos.perGallery": { enabled: true, limit: 50 },
      "premiumThemes.limit": { enabled: true, limit: 2 },
      themeComponents: { enabled: true },
      adminDashboard: { enabled: true },
      responsiveDesign: { enabled: true },
      "categoryRequests.total": { enabled: true, limit: 5 }
    }
  },
  {
    key: "pro",
    name: "Pro",
    description: "For professional photographers who need large libraries, premium themes, and advanced portfolio capacity.",
    monthlyPrice: 4900,
    annualPrice: 49000,
    lifetimePrice: null,
    gracePeriodDays: 14,
    featured: false,
    enabledFeatures: {
      blogs: { enabled: true, limit: 50 },
      customDomains: { enabled: true },
      premiumThemes: { enabled: true },
      watermarks: { enabled: true },
      "photos.total": { enabled: true, limit: 5000 },
      "heroImages.total": { enabled: true, limit: 5 },
      pageHeaderImages: { enabled: true },
      "photos.perCategory": { enabled: true, limit: 500 },
      "categories.total": { enabled: true, limit: 20 },
      "subcategories.perCategory": { enabled: true, limit: 10 },
      "galleries.total": { enabled: true, limit: 50 },
      "photos.perGallery": { enabled: true, limit: 500 },
      "premiumThemes.limit": { enabled: true, limit: 5 },
      themeComponents: { enabled: true },
      adminDashboard: { enabled: true },
      responsiveDesign: { enabled: true },
      "categoryRequests.total": { enabled: true, limit: 20 }
    }
  },
  {
    key: "ownership",
    name: "Ownership",
    description: "For customers who want to own their portfolio app permanently with larger freedom and setup support.",
    monthlyPrice: null,
    annualPrice: null,
    lifetimePrice: 149000,
    gracePeriodDays: 0,
    featured: false,
    enabledFeatures: {
      blogs: { enabled: true },
      customDomains: { enabled: true },
      premiumThemes: { enabled: true },
      watermarks: { enabled: true },
      "photos.total": { enabled: true },
      "heroImages.total": { enabled: true },
      pageHeaderImages: { enabled: true },
      "photos.perCategory": { enabled: true },
      "categories.total": { enabled: true },
      "subcategories.perCategory": { enabled: true },
      "galleries.total": { enabled: true },
      "photos.perGallery": { enabled: true },
      "premiumThemes.limit": { enabled: true },
      themeComponents: { enabled: true },
      advancedCustomization: { enabled: true },
      anyLanguageLocalization: { enabled: true },
      "freeMaintenance.months": { enabled: true, limit: 2 },
      adminDashboard: { enabled: true },
      responsiveDesign: { enabled: true },
      "categoryRequests.total": { enabled: true }
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

  for (const [index, plan] of plans.entries()) {
    const planRecord = await prisma.plan.upsert({
      where: { key: plan.key },
      update: {
        name: plan.name,
        description: plan.description,
        monthlyPrice: plan.monthlyPrice,
        annualPrice: plan.annualPrice,
        lifetimePrice: plan.lifetimePrice,
        gracePeriodDays: plan.gracePeriodDays,
        featured: plan.featured,
        displayOrder: index + 1,
        enabled: true
      },
      create: {
        key: plan.key,
        name: plan.name,
        description: plan.description,
        monthlyPrice: plan.monthlyPrice,
        annualPrice: plan.annualPrice,
        lifetimePrice: plan.lifetimePrice,
        gracePeriodDays: plan.gracePeriodDays,
        featured: plan.featured,
        displayOrder: index + 1,
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

  await prisma.plan.updateMany({
    where: {
      key: {
        notIn: plans.map((plan) => plan.key)
      }
    },
    data: {
      enabled: false
    }
  });

  const oldMonthlyCategoryRequestFeature = await prisma.feature.findUnique({
    where: { key: "categoryRequests.monthly" },
    select: { id: true }
  });

  if (oldMonthlyCategoryRequestFeature) {
    await prisma.planFeature.updateMany({
      where: {
        featureId: oldMonthlyCategoryRequestFeature.id
      },
      data: {
        enabled: false,
        limit: null
      }
    });
  }
}

async function seedDemoTenant() {
  const plusPlan = await prisma.plan.findUniqueOrThrow({
    where: { key: "plus" }
  });

  const tenant = await prisma.tenant.upsert({
    where: { slug: "demo" },
    update: {
      name: "Noor Frames",
      status: "ACTIVE",
      defaultLocale: "en"
    },
    create: {
      name: "Noor Frames",
      slug: "demo",
      status: "ACTIVE",
      defaultLocale: "en"
    }
  });

  await prisma.tenantSetting.upsert({
    where: { tenantId: tenant.id },
    update: {
      themeKey: "cinematic",
      primaryColor: "#207567",
      accentColor: "#E86845",
      navbarStyle: "floating",
      galleryStyle: "masonry",
      cardStyle: "modern",
      footerStyle: "expanded"
    },
    create: {
      tenantId: tenant.id,
      themeKey: "cinematic",
      primaryColor: "#207567",
      accentColor: "#E86845",
      navbarStyle: "floating",
      galleryStyle: "masonry",
      cardStyle: "modern",
      footerStyle: "expanded",
      businessDetails: {
        city: "Islamabad",
        specialty: "Wedding and portrait photography"
      },
      socialLinks: {
        instagram: "https://instagram.com/noorframes"
      }
    }
  });

  await prisma.subscription.upsert({
    where: { tenantId: tenant.id },
    update: {
      planId: plusPlan.id,
      status: "ACTIVE"
    },
    create: {
      tenantId: tenant.id,
      planId: plusPlan.id,
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

  // --- Categories ---

  const eventsCategory = await prisma.category.upsert({
    where: {
      tenantId_slug: {
        tenantId: tenant.id,
        slug: "events"
      }
    },
    update: {
      name: "Events",
      parentId: null
    },
    create: {
      tenantId: tenant.id,
      name: "Events",
      slug: "events"
    }
  });

  // Wedding is a subcategory of Events
  const weddingsCategory = await prisma.category.upsert({
    where: {
      tenantId_slug: {
        tenantId: tenant.id,
        slug: "weddings"
      }
    },
    update: {
      name: "Weddings",
      parentId: eventsCategory.id
    },
    create: {
      tenantId: tenant.id,
      parentId: eventsCategory.id,
      name: "Weddings",
      slug: "weddings"
    }
  });

  for (const subcategory of [
    { name: "Corporate", slug: "events-corporate" },
    { name: "Birthday", slug: "events-birthday" },
    { name: "Concert", slug: "events-concert" }
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
        parentId: eventsCategory.id
      },
      create: {
        tenantId: tenant.id,
        parentId: eventsCategory.id,
        name: subcategory.name,
        slug: subcategory.slug
      }
    });
  }

  const portraitsCategory = await prisma.category.upsert({
    where: {
      tenantId_slug: {
        tenantId: tenant.id,
        slug: "portraits"
      }
    },
    update: {
      name: "Portraits",
      parentId: null
    },
    create: {
      tenantId: tenant.id,
      name: "Portraits",
      slug: "portraits"
    }
  });

  for (const subcategory of [
    { name: "Family", slug: "portraits-family" },
    { name: "Headshots", slug: "portraits-headshots" }
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
        parentId: portraitsCategory.id
      },
      create: {
        tenantId: tenant.id,
        parentId: portraitsCategory.id,
        name: subcategory.name,
        slug: subcategory.slug
      }
    });
  }

  const natureCategory = await prisma.category.upsert({
    where: {
      tenantId_slug: {
        tenantId: tenant.id,
        slug: "nature"
      }
    },
    update: {
      name: "Nature",
      parentId: null
    },
    create: {
      tenantId: tenant.id,
      name: "Nature",
      slug: "nature"
    }
  });

  for (const subcategory of [
    { name: "Landscapes", slug: "nature-landscapes" },
    { name: "Wildlife", slug: "nature-wildlife" },
    { name: "Macro", slug: "nature-macro" }
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
        parentId: natureCategory.id
      },
      create: {
        tenantId: tenant.id,
        parentId: natureCategory.id,
        name: subcategory.name,
        slug: subcategory.slug
      }
    });
  }

  const streetCategory = await prisma.category.upsert({
    where: {
      tenantId_slug: {
        tenantId: tenant.id,
        slug: "street"
      }
    },
    update: {
      name: "Street",
      parentId: null
    },
    create: {
      tenantId: tenant.id,
      name: "Street",
      slug: "street"
    }
  });

  const fashionCategory = await prisma.category.upsert({
    where: {
      tenantId_slug: {
        tenantId: tenant.id,
        slug: "fashion"
      }
    },
    update: {
      name: "Fashion",
      parentId: null
    },
    create: {
      tenantId: tenant.id,
      name: "Fashion",
      slug: "fashion"
    }
  });

  // --- Albums ---

  const featuredWorkAlbum = await prisma.album.upsert({
    where: {
      tenantId_slug: {
        tenantId: tenant.id,
        slug: "featured-work"
      }
    },
    update: {
      title: "Featured Work",
      description: "A curated selection of our finest moments across weddings, portraits, and creative sessions.",
      categoryId: weddingsCategory.id,
      featured: true,
      published: true
    },
    create: {
      tenantId: tenant.id,
      categoryId: weddingsCategory.id,
      title: "Featured Work",
      slug: "featured-work",
      description: "A curated selection of our finest moments across weddings, portraits, and creative sessions.",
      featured: true,
      published: true
    }
  });

  const sarahAhmedAlbum = await prisma.album.upsert({
    where: {
      tenantId_slug: {
        tenantId: tenant.id,
        slug: "sarah-ahmed-wedding"
      }
    },
    update: {
      title: "Sarah & Ahmed — Garden Wedding",
      description: "An intimate garden ceremony captured in soft afternoon light.",
      categoryId: weddingsCategory.id,
      featured: false,
      published: true
    },
    create: {
      tenantId: tenant.id,
      categoryId: weddingsCategory.id,
      title: "Sarah & Ahmed — Garden Wedding",
      slug: "sarah-ahmed-wedding",
      description: "An intimate garden ceremony captured in soft afternoon light.",
      featured: false,
      published: true
    }
  });

  const urbanPortraitsAlbum = await prisma.album.upsert({
    where: {
      tenantId_slug: {
        tenantId: tenant.id,
        slug: "urban-portraits"
      }
    },
    update: {
      title: "Urban Portraits",
      description: "Bold portraits shot against the raw textures of the city.",
      categoryId: portraitsCategory.id,
      featured: false,
      published: true
    },
    create: {
      tenantId: tenant.id,
      categoryId: portraitsCategory.id,
      title: "Urban Portraits",
      slug: "urban-portraits",
      description: "Bold portraits shot against the raw textures of the city.",
      featured: false,
      published: true
    }
  });

  const mountainSunriseAlbum = await prisma.album.upsert({
    where: {
      tenantId_slug: {
        tenantId: tenant.id,
        slug: "mountain-sunrise"
      }
    },
    update: {
      title: "Mountain Sunrise",
      description: "First light over the northern peaks — a personal landscape project.",
      categoryId: natureCategory.id,
      featured: false,
      published: true
    },
    create: {
      tenantId: tenant.id,
      categoryId: natureCategory.id,
      title: "Mountain Sunrise",
      slug: "mountain-sunrise",
      description: "First light over the northern peaks — a personal landscape project.",
      featured: false,
      published: true
    }
  });

  const grandGalaAlbum = await prisma.album.upsert({
    where: {
      tenantId_slug: {
        tenantId: tenant.id,
        slug: "grand-gala"
      }
    },
    update: {
      title: "The Grand Gala",
      description: "Corporate event coverage with candid moments and stage highlights.",
      categoryId: eventsCategory.id,
      featured: false,
      published: true
    },
    create: {
      tenantId: tenant.id,
      categoryId: eventsCategory.id,
      title: "The Grand Gala",
      slug: "grand-gala",
      description: "Corporate event coverage with candid moments and stage highlights.",
      featured: false,
      published: true
    }
  });

  // --- Photos ---

  const photoSeedData = [
    // Wedding photos (1-12)
    { id: "demo-photo-1", albumId: featuredWorkAlbum.id, categoryId: weddingsCategory.id, title: "Golden hour portrait", alt: "Bride and groom photographed during golden hour", photoId: "photo-1519741497674-611481863552", cloudinaryId: "demo/golden-hour-portrait", dominantColor: "#8f6d4c" },
    { id: "demo-photo-2", albumId: sarahAhmedAlbum.id, categoryId: weddingsCategory.id, title: "Ceremony arch", alt: "Floral ceremony arch in a garden setting", photoId: "photo-1465495976277-4387d4b0b4c6", cloudinaryId: "demo/ceremony-arch", dominantColor: "#7a8b6e" },
    { id: "demo-photo-3", albumId: sarahAhmedAlbum.id, categoryId: weddingsCategory.id, title: "Reception dance", alt: "Couple sharing their first dance at the reception", photoId: "photo-1519225421980-715cb0215aed", cloudinaryId: "demo/reception-dance", dominantColor: "#4a3f35" },
    { id: "demo-photo-4", albumId: sarahAhmedAlbum.id, categoryId: weddingsCategory.id, title: "Couple in garden", alt: "Bride and groom walking through a sunlit garden", photoId: "photo-1537907510278-7709f15909a7", cloudinaryId: "demo/couple-in-garden", dominantColor: "#6b8e5a" },
    { id: "demo-photo-5", albumId: featuredWorkAlbum.id, categoryId: weddingsCategory.id, title: "Bridal preparation", alt: "Bride getting ready before the ceremony", photoId: "photo-1522673607200-164d1b6ce486", cloudinaryId: "demo/bridal-preparation", dominantColor: "#c4a882" },
    { id: "demo-photo-6", albumId: sarahAhmedAlbum.id, categoryId: weddingsCategory.id, title: "First dance", alt: "Couple dancing under warm string lights", photoId: "photo-1511285560929-80b456fea0bc", cloudinaryId: "demo/first-dance", dominantColor: "#3d3027" },
    { id: "demo-photo-7", albumId: sarahAhmedAlbum.id, categoryId: weddingsCategory.id, title: "Ring exchange", alt: "Close-up of the ring exchange during the ceremony", photoId: "photo-1591604466107-ec97de577aff", cloudinaryId: "demo/ring-exchange", dominantColor: "#b8a089" },
    { id: "demo-photo-8", albumId: sarahAhmedAlbum.id, categoryId: weddingsCategory.id, title: "Wedding party", alt: "Wedding party group portrait in a park", photoId: "photo-1583939003579-730e3918a45a", cloudinaryId: "demo/wedding-party", dominantColor: "#8a7b6b" },
    { id: "demo-photo-9", albumId: sarahAhmedAlbum.id, categoryId: weddingsCategory.id, title: "Bride portrait", alt: "Elegant bridal portrait with natural light", photoId: "photo-1520854221256-17451cc331bf", cloudinaryId: "demo/bride-portrait", dominantColor: "#c8b8a0" },
    { id: "demo-photo-10", albumId: sarahAhmedAlbum.id, categoryId: weddingsCategory.id, title: "Sunset couple walk", alt: "Couple walking hand in hand during sunset", photoId: "photo-1606800052052-a08af7148866", cloudinaryId: "demo/sunset-couple-walk", dominantColor: "#d4956b" },
    { id: "demo-photo-11", albumId: sarahAhmedAlbum.id, categoryId: weddingsCategory.id, title: "Bouquet toss", alt: "Bride tossing the bouquet to wedding guests", photoId: "photo-1519741497674-611481863552", cloudinaryId: "demo/bouquet-toss", dominantColor: "#8f6d4c" },
    { id: "demo-photo-12", albumId: sarahAhmedAlbum.id, categoryId: weddingsCategory.id, title: "Table details", alt: "Elegant table setting with floral centerpiece", photoId: "photo-1544078751-58fee2d8a03b", cloudinaryId: "demo/table-details", dominantColor: "#c9b896" },

    // Portrait photos (13-22)
    { id: "demo-photo-13", albumId: featuredWorkAlbum.id, categoryId: portraitsCategory.id, title: "Studio portrait", alt: "Dramatic studio portrait with controlled lighting", photoId: "photo-1531746020798-e6953c6e8e04", cloudinaryId: "demo/studio-portrait", dominantColor: "#d4b896" },
    { id: "demo-photo-14", albumId: urbanPortraitsAlbum.id, categoryId: portraitsCategory.id, title: "Professional headshot", alt: "Clean professional headshot on neutral background", photoId: "photo-1507003211169-0a1dd7228f2d", cloudinaryId: "demo/professional-headshot", dominantColor: "#6b7b8b" },
    { id: "demo-photo-15", albumId: urbanPortraitsAlbum.id, categoryId: portraitsCategory.id, title: "Natural light portrait", alt: "Portrait shot in soft natural window light", photoId: "photo-1494790108377-be9c29b29330", cloudinaryId: "demo/natural-light-portrait", dominantColor: "#b8956e" },
    { id: "demo-photo-16", albumId: urbanPortraitsAlbum.id, categoryId: portraitsCategory.id, title: "Fashion portrait", alt: "Fashion-forward portrait with urban backdrop", photoId: "photo-1534528741775-53994a69daeb", cloudinaryId: "demo/fashion-portrait", dominantColor: "#8b9ba5" },
    { id: "demo-photo-17", albumId: urbanPortraitsAlbum.id, categoryId: portraitsCategory.id, title: "Street portrait", alt: "Candid portrait on a busy city street", photoId: "photo-1544005313-94ddf0286df2", cloudinaryId: "demo/street-portrait", dominantColor: "#7a6b5a" },
    { id: "demo-photo-18", albumId: urbanPortraitsAlbum.id, categoryId: portraitsCategory.id, title: "Environmental portrait", alt: "Subject photographed in their natural environment", photoId: "photo-1517841905240-472988babdf9", cloudinaryId: "demo/environmental-portrait", dominantColor: "#a89880" },
    { id: "demo-photo-19", albumId: urbanPortraitsAlbum.id, categoryId: portraitsCategory.id, title: "Dramatic lighting", alt: "Portrait with dramatic side lighting and deep shadows", photoId: "photo-1521119989659-a83eee488004", cloudinaryId: "demo/dramatic-lighting", dominantColor: "#3a3a3a" },
    { id: "demo-photo-20", albumId: urbanPortraitsAlbum.id, categoryId: portraitsCategory.id, title: "Male headshot", alt: "Professional male headshot with clean background", photoId: "photo-1506794778202-cad84cf45f1d", cloudinaryId: "demo/male-headshot", dominantColor: "#8a7a6a" },
    { id: "demo-photo-21", albumId: urbanPortraitsAlbum.id, categoryId: portraitsCategory.id, title: "Couple portrait", alt: "Intimate couple portrait in urban setting", photoId: "photo-1524504388940-b1c1722653e1", cloudinaryId: "demo/couple-portrait", dominantColor: "#9a8a7a" },
    { id: "demo-photo-22", albumId: urbanPortraitsAlbum.id, categoryId: portraitsCategory.id, title: "Lifestyle portrait", alt: "Relaxed lifestyle portrait in natural setting", photoId: "photo-1488426862026-3ee34a7d66df", cloudinaryId: "demo/lifestyle-portrait", dominantColor: "#c4a478" },

    // Nature photos (23-32)
    { id: "demo-photo-23", albumId: featuredWorkAlbum.id, categoryId: natureCategory.id, title: "Alpine sunrise", alt: "Sun rising over snow-capped alpine peaks", photoId: "photo-1506905925346-21bda4d32df4", cloudinaryId: "demo/alpine-sunrise", dominantColor: "#6a8ca5" },
    { id: "demo-photo-24", albumId: mountainSunriseAlbum.id, categoryId: natureCategory.id, title: "Mountain lake", alt: "Still mountain lake reflecting surrounding peaks", photoId: "photo-1470770841072-f978cf4d019e", cloudinaryId: "demo/mountain-lake", dominantColor: "#4a6a3e" },
    { id: "demo-photo-25", albumId: mountainSunriseAlbum.id, categoryId: natureCategory.id, title: "Tropical beach", alt: "Crystal clear water on a tropical shoreline", photoId: "photo-1500530855697-b586d89ba3ee", cloudinaryId: "demo/tropical-beach", dominantColor: "#5ea0b8" },
    { id: "demo-photo-26", albumId: mountainSunriseAlbum.id, categoryId: natureCategory.id, title: "Forest path", alt: "Sunlight filtering through a dense forest canopy", photoId: "photo-1441974231531-c6227db76b6e", cloudinaryId: "demo/forest-path", dominantColor: "#3a5a2e" },
    { id: "demo-photo-27", albumId: mountainSunriseAlbum.id, categoryId: natureCategory.id, title: "Valley view", alt: "Expansive valley view from a mountain ridge", photoId: "photo-1472214103451-9374bd1c798e", cloudinaryId: "demo/valley-view", dominantColor: "#7a9a5e" },
    { id: "demo-photo-28", albumId: mountainSunriseAlbum.id, categoryId: natureCategory.id, title: "Waterfall", alt: "Cascading waterfall surrounded by mossy rocks", photoId: "photo-1433086966358-54859d0ed716", cloudinaryId: "demo/waterfall", dominantColor: "#4a6a5a" },
    { id: "demo-photo-29", albumId: mountainSunriseAlbum.id, categoryId: natureCategory.id, title: "Desert dunes", alt: "Wind-sculpted sand dunes at golden hour", photoId: "photo-1518173946687-a252ee9a267c", cloudinaryId: "demo/desert-dunes", dominantColor: "#c8a878" },
    { id: "demo-photo-30", albumId: mountainSunriseAlbum.id, categoryId: natureCategory.id, title: "Coastal cliffs", alt: "Dramatic coastal cliffs meeting the ocean", photoId: "photo-1505765050516-f72dcac9c60e", cloudinaryId: "demo/coastal-cliffs", dominantColor: "#5a7a8a" },
    { id: "demo-photo-31", albumId: mountainSunriseAlbum.id, categoryId: natureCategory.id, title: "Snow peaks", alt: "Pristine snow-covered mountain peaks at dawn", photoId: "photo-1486870591958-9b9d0d1dda99", cloudinaryId: "demo/snow-peaks", dominantColor: "#8aaabe" },
    { id: "demo-photo-32", albumId: mountainSunriseAlbum.id, categoryId: natureCategory.id, title: "Misty forest", alt: "Ethereal mist drifting through an ancient forest", photoId: "photo-1501854140801-50d01698950b", cloudinaryId: "demo/misty-forest", dominantColor: "#5a6a4a" },

    // Event photos (33-40)
    { id: "demo-photo-33", albumId: featuredWorkAlbum.id, categoryId: eventsCategory.id, title: "Conference stage", alt: "Speaker on stage at a corporate conference", photoId: "photo-1540575467063-178a50c2df87", cloudinaryId: "demo/conference-stage", dominantColor: "#2a3a4a" },
    { id: "demo-photo-34", albumId: grandGalaAlbum.id, categoryId: eventsCategory.id, title: "Gala dinner", alt: "Elegant gala dinner with ambient lighting", photoId: "photo-1511795409834-ef04bbd61622", cloudinaryId: "demo/gala-dinner", dominantColor: "#4a3a2a" },
    { id: "demo-photo-35", albumId: grandGalaAlbum.id, categoryId: eventsCategory.id, title: "Birthday celebration", alt: "Joyful birthday celebration with colorful decorations", photoId: "photo-1530103862676-de8c9debad1d", cloudinaryId: "demo/birthday-celebration", dominantColor: "#c8a060" },
    { id: "demo-photo-36", albumId: grandGalaAlbum.id, categoryId: eventsCategory.id, title: "Graduation ceremony", alt: "Graduates celebrating at a commencement ceremony", photoId: "photo-1523050854058-8df90110c9f1", cloudinaryId: "demo/graduation-ceremony", dominantColor: "#3a4a5a" },
    { id: "demo-photo-37", albumId: grandGalaAlbum.id, categoryId: eventsCategory.id, title: "Live performance", alt: "Musician performing on stage under colored lights", photoId: "photo-1492684223f8-5a77a9e38a44", cloudinaryId: "demo/live-performance", dominantColor: "#5a3a6a" },
    { id: "demo-photo-38", albumId: grandGalaAlbum.id, categoryId: eventsCategory.id, title: "Team meeting", alt: "Corporate team collaborating in a modern workspace", photoId: "photo-1505373877841-8d25f7d46678", cloudinaryId: "demo/team-meeting", dominantColor: "#8a9aaa" },
    { id: "demo-photo-39", albumId: grandGalaAlbum.id, categoryId: eventsCategory.id, title: "Award ceremony", alt: "Award presentation at a formal ceremony", photoId: "photo-1504384764586-bb4cdc1707b0", cloudinaryId: "demo/award-ceremony", dominantColor: "#3a2a1a" },
    { id: "demo-photo-40", albumId: grandGalaAlbum.id, categoryId: eventsCategory.id, title: "Networking event", alt: "Professionals networking at a business event", photoId: "photo-1556761175-5973dc0f32e7", cloudinaryId: "demo/networking-event", dominantColor: "#7a8a9a" },

    // Street photos (41-45) — no album
    { id: "demo-photo-41", albumId: null, categoryId: streetCategory.id, title: "Night market", alt: "Vibrant night market with neon signs and crowds", photoId: "photo-1519608487953-e999c86e7455", cloudinaryId: "demo/night-market", dominantColor: "#2a2a3a" },
    { id: "demo-photo-42", albumId: null, categoryId: streetCategory.id, title: "Rain reflection", alt: "City street reflections on rain-soaked pavement", photoId: "photo-1517732306149-e8f829eb588a", cloudinaryId: "demo/rain-reflection", dominantColor: "#4a5a6a" },
    { id: "demo-photo-43", albumId: null, categoryId: streetCategory.id, title: "City lights", alt: "Blurred city lights creating a bokeh effect at night", photoId: "photo-1477959858617-67f85cf4f1df", cloudinaryId: "demo/city-lights", dominantColor: "#1a2a3a" },
    { id: "demo-photo-44", albumId: null, categoryId: streetCategory.id, title: "Urban geometry", alt: "Geometric patterns in modern urban architecture", photoId: "photo-1480714378408-67cf0d13bc1b", cloudinaryId: "demo/urban-geometry", dominantColor: "#8a8a8a" },
    { id: "demo-photo-45", albumId: null, categoryId: streetCategory.id, title: "Street vendor", alt: "Street food vendor preparing dishes at a stall", photoId: "photo-1514565131-fce0801e5785", cloudinaryId: "demo/street-vendor", dominantColor: "#6a5a4a" },

    // Fashion photos (46-50) — 46 in featured album, 47 no album, 48-50 no album
    { id: "demo-photo-46", albumId: featuredWorkAlbum.id, categoryId: fashionCategory.id, title: "Editorial fashion", alt: "High-fashion editorial shot with dramatic pose", photoId: "photo-1509631179647-0177331693ae", cloudinaryId: "demo/editorial-fashion", dominantColor: "#d4c4b4" },
    { id: "demo-photo-47", albumId: null, categoryId: fashionCategory.id, title: "Runway moment", alt: "Model walking the runway under spotlights", photoId: "photo-1515886657613-9f3515b0c78f", cloudinaryId: "demo/runway-moment", dominantColor: "#3a3a3a" },
    { id: "demo-photo-48", albumId: null, categoryId: fashionCategory.id, title: "Street style", alt: "Street style fashion captured on a city sidewalk", photoId: "photo-1469334031218-e382a71b716b", cloudinaryId: "demo/street-style", dominantColor: "#c4b4a4" },
    { id: "demo-photo-49", albumId: null, categoryId: fashionCategory.id, title: "Beauty editorial", alt: "Close-up beauty editorial with soft lighting", photoId: "photo-1558618666-fcd25c85f7f7", cloudinaryId: "demo/beauty-editorial", dominantColor: "#e4d4c4" },
    { id: "demo-photo-50", albumId: null, categoryId: fashionCategory.id, title: "Fashion outdoor", alt: "Outdoor fashion shoot in natural golden light", photoId: "photo-1496747611176-843222e1e57c", cloudinaryId: "demo/fashion-outdoor", dominantColor: "#b4c4d4" }
  ];

  for (const photo of photoSeedData) {
    await prisma.photo.upsert({
      where: { id: photo.id },
      update: {
        tenantId: tenant.id,
        albumId: photo.albumId,
        categoryId: photo.categoryId,
        title: photo.title,
        alt: photo.alt,
        secureUrl: `https://images.unsplash.com/${photo.photoId}?auto=format&fit=crop&w=1600&q=85`,
        cloudinaryId: photo.cloudinaryId
      },
      create: {
        id: photo.id,
        tenantId: tenant.id,
        albumId: photo.albumId,
        categoryId: photo.categoryId,
        title: photo.title,
        alt: photo.alt,
        secureUrl: `https://images.unsplash.com/${photo.photoId}?auto=format&fit=crop&w=1600&q=85`,
        cloudinaryId: photo.cloudinaryId,
        width: 1600,
        height: 1067,
        dominantColor: photo.dominantColor
      }
    });
  }

  // --- Blog categories & posts ---

  const blogCategories = new Map<string, { id: string }>();

  for (const [index, blogCategory] of [
    {
      name: "Shoot Stories",
      slug: "shoot-stories",
      description: "Stories behind recent sessions, galleries, and visual decisions."
    },
    {
      name: "Portfolio Tips",
      slug: "portfolio-tips",
      description: "Guides for selecting, preparing, and publishing portfolio work."
    },
    {
      name: "Behind the Scenes",
      slug: "behind-the-scenes",
      description: "Notes on process, light, locations, and preparation."
    }
  ].entries()) {
    const record = await prisma.blogCategory.upsert({
      where: {
        tenantId_slug: {
          tenantId: tenant.id,
          slug: blogCategory.slug
        }
      },
      update: {
        name: blogCategory.name,
        description: blogCategory.description,
        displayOrder: index + 1
      },
      create: {
        tenantId: tenant.id,
        name: blogCategory.name,
        slug: blogCategory.slug,
        description: blogCategory.description,
        displayOrder: index + 1
      },
      select: {
        id: true
      }
    });

    blogCategories.set(blogCategory.slug, record);
  }

  const sampleBlogs = [
    {
      title: "How We Capture Golden Hour Weddings",
      slug: "golden-hour-wedding-story",
      blogCategorySlug: "shoot-stories",
      excerpt: "A look at timing, scouting, and gentle direction that turns the last hour of daylight into the most memorable frames of the day.",
      featuredImage: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=85",
      html:
        '<h2>Why golden hour matters</h2><p>The last hour before sunset wraps everything in warm, directional light that flatters skin tones and softens harsh shadows. For wedding portraits, it is the single best window of the day — but it lasts barely forty minutes, so preparation is everything.</p><h2>Scouting the location</h2><p>We always visit the venue beforehand to find two or three spots where the light will land cleanly. A garden path with western exposure, a stone wall that catches side light, or even a simple open field — the key is eliminating surprises on the day itself.</p><h2>Keeping direction simple</h2><p>Couples are not professional models, so we limit poses to three or four natural prompts: walk together, pause and look at each other, share a quiet laugh. The best expressions come from real moments, not choreography. We let the light do the heavy lifting and focus on capturing honest reactions.</p><p>The result is a set of images that feel calm, warm, and genuinely connected — exactly the kind of work that resonates when a future client opens your portfolio.</p>'
    },
    {
      title: "Building a Portfolio That Books Clients",
      slug: "portfolio-that-books-clients",
      blogCategorySlug: "portfolio-tips",
      excerpt: "Your portfolio is not a gallery of every photo you have ever taken. It is a sales tool. Here is how to shape it so visitors become inquiries.",
      featuredImage: null,
      html:
        '<h2>Less is more — always</h2><p>The most common portfolio mistake is including too many images. A visitor who lands on your site will spend sixty to ninety seconds before deciding whether to reach out. In that window, twenty strong images tell a clearer story than two hundred average ones.</p><h2>Lead with your best category</h2><p>If you want to book weddings, your homepage hero and your first gallery should be wedding work. Mixing genres equally sends the signal that you are a generalist — which makes it harder for a potential client to picture you at their event.</p><h2>Show variety within your niche</h2><p>Within your primary category, show range: different venues, different light conditions, candid moments alongside composed portraits. This proves you can handle the unexpected, which is exactly what clients worry about.</p><h2>Write real captions</h2><p>Short, honest captions add context that images alone cannot provide. A line like "Rooftop ceremony, overcast afternoon, natural light only" tells a prospective client more about your skill than a dozen hashtags ever could.</p><p>Treat your portfolio as a living document. Revisit it every quarter, remove anything that no longer represents your current level, and keep it tight.</p>'
    },
    {
      title: "Behind the Scenes: Mountain Sunrise Shoot",
      slug: "mountain-sunrise-behind-scenes",
      blogCategorySlug: "behind-the-scenes",
      excerpt: "What it takes to haul gear up a ridge at 3 AM for first light — and why landscape work keeps us creatively sharp.",
      featuredImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1400&q=85",
      html:
        '<h2>The alarm rings at 2:30 AM</h2><p>Landscape photography sounds romantic until you are pulling on boots in the dark and loading a pack with a tripod, two bodies, and three lenses. The northern ridge trail we chose for this project is a steep ninety-minute climb, which means starting well before civil twilight.</p><h2>Waiting for the light</h2><p>We reached the summit with about twenty minutes to spare. The temperature was near freezing and the valley below was buried in fog. For ten minutes nothing happened — just grey sky and silence. Then the horizon cracked open with a thin band of amber that climbed fast, painting the snow peaks in shades of rose and copper.</p><h2>Working quickly</h2><p>Once first light hits, the best color window lasts roughly eight minutes. We shot wide compositions on a 16-35mm, then swapped to a 70-200mm for compressed peak details. Bracketed exposures ensured we held highlight and shadow detail for later processing.</p><h2>Why we keep doing personal projects</h2><p>Client work pays the bills, but personal landscape shoots keep our eye trained for light, composition, and patience. The discipline of waking up early, hiking in the dark, and waiting for a moment that may not come translates directly into sharper instincts on a wedding day or a portrait session.</p>'
    }
  ];

  for (const [index, blog] of sampleBlogs.entries()) {
    await prisma.blogPost.upsert({
      where: {
        tenantId_slug: {
          tenantId: tenant.id,
          slug: blog.slug
        }
      },
      update: {
        categoryId: weddingsCategory.id,
        blogCategoryId: blogCategories.get(blog.blogCategorySlug)?.id,
        title: blog.title,
        excerpt: blog.excerpt,
        featuredImage: blog.featuredImage,
        metaTitle: blog.title,
        metaDescription: blog.excerpt,
        content: {
          type: "html",
          html: blog.html
        },
        moderationStatus: "APPROVED",
        moderationNote: null,
        publishedAt: new Date(Date.UTC(2026, 0, index + 8))
      },
      create: {
        tenantId: tenant.id,
        categoryId: weddingsCategory.id,
        blogCategoryId: blogCategories.get(blog.blogCategorySlug)?.id,
        title: blog.title,
        slug: blog.slug,
        excerpt: blog.excerpt,
        featuredImage: blog.featuredImage,
        metaTitle: blog.title,
        metaDescription: blog.excerpt,
        content: {
          type: "html",
          html: blog.html
        },
        moderationStatus: "APPROVED",
        publishedAt: new Date(Date.UTC(2026, 0, index + 8))
      }
    });
  }

  await prisma.page.upsert({
    where: {
      tenantId_slug: {
        tenantId: tenant.id,
        slug: "home"
      }
    },
    update: {
      title: "Noor Frames",
      published: true
    },
    create: {
      tenantId: tenant.id,
      type: "HOME",
      title: "Noor Frames",
      slug: "home",
      published: true,
      metaTitle: "Noor Frames — Wedding & Portrait Photography",
      metaDescription: "A photography portfolio powered by Photaaz.",
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
        copyrightText: "Copyright (c) {year} Photaaz. All rights reserved.",
        companyAddress: "Islamabad, Pakistan",
        dashboardNotice: "",
        themeSwitchCooldownDays: 14,
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
        copyrightText: "Copyright (c) {year} Photaaz. All rights reserved.",
        companyAddress: "Islamabad, Pakistan",
        dashboardNotice: "",
        themeSwitchCooldownDays: 14,
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
          title: "Photaaz - Professional Photography Websites in Minutes",
          description:
            "Create a professional photography website in minutes. Pick a design, upload photos, and publish a polished portfolio with themes, SEO, blogs, and a custom domain."
        },
        features: benefitFeatures.map((feature, index) => ({
          title: feature.title,
          body: feature.body,
          iconKey: feature.icon.displayName ?? "feature",
          enabled: true,
          displayOrder: index + 1
        })),
        faqDisplayLimit: 4
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
          title: "Photaaz - Professional Photography Websites in Minutes",
          description:
            "Create a professional photography website in minutes. Pick a design, upload photos, and publish a polished portfolio with themes, SEO, blogs, and a custom domain."
        },
        features: benefitFeatures.map((feature, index) => ({
          title: feature.title,
          body: feature.body,
          iconKey: feature.icon.displayName ?? "feature",
          enabled: true,
          displayOrder: index + 1
        })),
        faqDisplayLimit: 4
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
        customization: defaultThemeCustomizationPolicy,
        seoTitle: `${theme.name} Photography Website Theme - Photaaz`,
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
        customization: defaultThemeCustomizationPolicy,
        seoTitle: `${theme.name} Photography Website Theme - Photaaz`,
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
        image: type.image,
        parentId: null,
        enabled: type.enabled,
        categorySeed: type.categorySeed,
        displayOrder: index + 1
      },
      create: {
        name: type.name,
        slug: type.slug,
        image: type.image,
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
        image: type.image,
        parentId: parent.id,
        enabled: type.enabled,
        categorySeed: type.categorySeed,
        displayOrder: index + 1
      },
      create: {
        name: type.name,
        slug: type.slug,
        image: type.image,
        parentId: parent.id,
        enabled: type.enabled,
        categorySeed: type.categorySeed,
        displayOrder: index + 1
      }
    });
  }

  // Remove old photography types no longer in the managed list
  const keepSlugs = managedPhotographyTypes.map((t) => t.slug);
  await prisma.platformPhotographyType.deleteMany({
    where: { slug: { notIn: keepSlugs } }
  });

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
      title: "Photaaz MVP",
      body: "Your photography SaaS foundation is ready for onboarding and upload flows.",
      enabled: true,
      marquee: true
    },
    create: {
      id: "welcome-announcement",
      title: "Photaaz MVP",
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
