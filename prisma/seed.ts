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
    key: "clientProofing",
    name: "Client proofing",
    description: "Future client selection and favorites workflows."
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
      clientProofing: { enabled: false },
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
      clientProofing: { enabled: false },
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
      clientProofing: { enabled: true },
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
      clientProofing: { enabled: true },
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
        city: "Islamabad",
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

  const sampleBlogs = [
    {
      title: "How I Plan a Golden Hour Wedding Story",
      slug: "golden-hour-wedding-story",
      blogCategorySlug: "shoot-stories",
      excerpt: "A simple look at how timing, location, and quiet direction shape a warm wedding gallery.",
      featuredImage: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=85",
      html:
        "<h2>Start with the light</h2><p>Golden hour gives wedding portraits a soft direction and a calmer pace. I usually plan the couple session around the last clean light of the day, then keep the poses simple so the gallery feels natural.</p><p>The goal is not to create a heavy production. It is to give the couple room to breathe while still building a polished visual story.</p>"
    },
    {
      title: "What Makes a Portfolio Gallery Feel Complete",
      slug: "complete-portfolio-gallery",
      blogCategorySlug: "shoot-stories",
      excerpt: "A strong gallery needs rhythm: wide frames, details, portraits, and a few quiet transitions.",
      featuredImage: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1400&q=85",
      html:
        "<h2>Think in sequences</h2><p>A finished gallery should not feel like a random collection of good photos. It should move through the day with rhythm: context, people, detail, emotion, and closing frames.</p><p>That structure helps visitors understand the work quickly and makes the portfolio feel more intentional.</p>"
    },
    {
      title: "Preparing Photos Before Publishing Your Website",
      slug: "prepare-photos-before-publishing",
      blogCategorySlug: "portfolio-tips",
      excerpt: "A quick checklist for image selection, naming, alt text, and keeping your website fast.",
      featuredImage: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1400&q=85",
      html:
        "<h2>Curate before you upload</h2><p>Before publishing, select fewer but stronger images. Keep file names readable, write useful alt text, and avoid uploading multiple near-duplicates from the same moment.</p><p>A clean selection makes the site faster and gives every image more space to matter.</p>"
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
        categoryId: category.id,
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
        categoryId: category.id,
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
      metaDescription: "A sample portfolio website powered by Photaaz.",
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
