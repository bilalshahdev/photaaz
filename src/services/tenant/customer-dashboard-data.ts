import { prisma } from "@/lib/db/prisma";
import { getEffectivePlanKey, getSubscriptionLifecycle, syncSubscriptionLifecycle } from "@/services/subscription/lifecycle";
import { getTenantPlanAccess, hasFeatureInAccess, planLimitKeys } from "@/services/subscription/plan-limits";
import { getClientVisiblePlanFeatures } from "@/services/subscription/plan-presentation";
import { normalizeTenantWatermark } from "@/services/platform/media-policy";

const homeSectionKeys = ["hero", "featuredPhotos", "categories", "galleries", "contact", "footer"] as const;
type HomeSectionKey = (typeof homeSectionKeys)[number];

export type CustomerDashboardView = {
  name: string;
  slug: string;
  themeKey: string;
  categoryCount: number;
  subcategoryCount: number;
  albumCount: number;
  photoCount: number;
  approvedPhotoCount: number;
  pendingPhotoCount: number;
  unreadNotificationCount: number;
  domain: {
    hostname: string;
    status: string;
  } | null;
  planKey: string;
  planName: string;
  themeChangedAt: Date | null;
  subscriptionStatus: string;
  packageEndsAt: Date | null;
  packageLabel: string;
  packageTone: "neutral" | "success" | "warning" | "danger";
  packageIsUsable: boolean;
  heroImage: string;
  notifications: Array<{
    id: string;
    title: string;
    body: string;
    status: "UNREAD" | "READ";
  }>;
};

export async function getCustomerDashboardView(slug: string): Promise<CustomerDashboardView | null> {
  await syncSubscriptionLifecycle();

  const tenant = await prisma.tenant.findUnique({
    where: {
      slug
    },
    include: {
      settings: true,
      subscription: {
        include: {
          plan: true
        }
      },
      _count: {
        select: {
          categories: true,
          albums: true,
          photos: true,
          notifications: {
            where: {
              status: "UNREAD"
            }
          }
        }
      },
      domains: {
        orderBy: {
          createdAt: "asc"
        },
        take: 1
      },
      photos: {
        orderBy: {
          createdAt: "asc"
        },
        take: 1
      },
      notifications: {
        orderBy: {
          createdAt: "desc"
        },
        take: 5
      }
    }
  });

  if (!tenant) {
    return null;
  }

  const lifecycle = getSubscriptionLifecycle(tenant.subscription);
  const [subcategoryCount, approvedPhotoCount, pendingPhotoCount] = await Promise.all([
    prisma.category.count({
      where: {
        tenantId: tenant.id,
        parentId: {
          not: null
        }
      }
    }),
    prisma.photo.count({
      where: {
        tenantId: tenant.id,
        moderationStatus: "APPROVED"
      }
    }),
    prisma.photo.count({
      where: {
        tenantId: tenant.id,
        moderationStatus: "PENDING"
      }
    })
  ]);

  return {
    name: tenant.name,
    slug: tenant.slug,
    themeKey: tenant.settings?.themeKey ?? "minimal",
    categoryCount: tenant._count.categories,
    subcategoryCount,
    albumCount: tenant._count.albums,
    photoCount: tenant._count.photos,
    approvedPhotoCount,
    pendingPhotoCount,
    unreadNotificationCount: tenant._count.notifications,
    domain: tenant.domains[0]
      ? {
          hostname: tenant.domains[0].hostname,
          status: tenant.domains[0].status
        }
      : null,
    planKey: getEffectivePlanKey(tenant.subscription),
    planName: tenant.subscription?.plan.name ?? "Free",
    themeChangedAt: tenant.settings?.themeChangedAt ?? null,
    subscriptionStatus: tenant.subscription?.status ?? "NONE",
    packageEndsAt: tenant.subscription?.currentPeriodEnds ?? null,
    packageLabel: lifecycle.label,
    packageTone: lifecycle.tone,
    packageIsUsable: lifecycle.isUsable,
    heroImage: tenant.photos[0]?.secureUrl ?? "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=85",
    notifications: tenant.notifications
  };
}

export async function getCustomerCategoriesView(slug: string) {
  const data = await getCustomerGalleriesView(slug);

  if (!data) {
    return null;
  }

  return {
    name: data.name,
    categories: data.categories,
    availableCategories: data.availableCategories,
    parentCategoryOptions: data.parentCategoryOptions,
    canRequestCustomCategories: data.canRequestCustomCategories,
    categoryRequestLimit: data.categoryRequestLimit,
    categoryRequests: data.categoryRequests
  };
}

export async function getCustomerGalleryDetailView(slug: string, albumSlug: string) {
  const tenant = await prisma.tenant.findUnique({
    where: {
      slug
    },
    select: {
      id: true,
      name: true
    }
  });

  if (!tenant) {
    return null;
  }

  const album = await prisma.album.findFirst({
    where: {
      tenantId: tenant.id,
      slug: albumSlug
    },
    include: {
      category: {
        include: {
          parent: true
        }
      },
      photos: {
        orderBy: {
          createdAt: "desc"
        }
      }
    }
  });

  if (!album) {
    return null;
  }

  return {
    tenantName: tenant.name,
    album: {
      id: album.id,
      title: album.title,
      slug: album.slug,
      description: album.description,
      featured: album.featured,
      published: album.published,
      category: album.category?.parent ? `${album.category.parent.name} / ${album.category.name}` : album.category?.name ?? "Uncategorized",
      photos: album.photos.map((photo) => ({
        id: photo.id,
        title: photo.title ?? photo.alt,
        alt: photo.alt,
        image: photo.secureUrl,
        status: photo.moderationStatus,
        createdAt: photo.createdAt
      }))
    }
  };
}

export async function getCustomerCategoryDetailView(slug: string, categorySlug: string) {
  const tenant = await prisma.tenant.findUnique({
    where: {
      slug
    },
    select: {
      id: true,
      name: true
    }
  });

  if (!tenant) {
    return null;
  }

  const category = await prisma.category.findFirst({
    where: {
      tenantId: tenant.id,
      slug: categorySlug
    },
    include: {
      parent: true,
      children: {
        include: {
          _count: {
            select: {
              photos: true,
              albums: true
            }
          }
        },
        orderBy: {
          createdAt: "asc"
        }
      },
      albums: {
        include: {
          _count: {
            select: {
              photos: true
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        }
      },
      photos: {
        include: {
          album: true
        },
        orderBy: {
          createdAt: "desc"
        },
        take: 60
      }
    }
  });

  if (!category) {
    return null;
  }

  return {
    tenantName: tenant.name,
    category: {
      id: category.id,
      name: category.name,
      slug: category.slug,
      parentName: category.parent?.name,
      children: category.children.map((child) => ({
        id: child.id,
        name: child.name,
        slug: child.slug,
        photoCount: child._count.photos,
        albumCount: child._count.albums
      })),
      albums: category.albums.map((album) => ({
        id: album.id,
        title: album.title,
        slug: album.slug,
        published: album.published,
        photoCount: album._count.photos
      })),
      photos: category.photos.map((photo) => ({
        id: photo.id,
        title: photo.title ?? photo.alt,
        alt: photo.alt,
        image: photo.secureUrl,
        status: photo.moderationStatus,
        gallery: photo.album?.title ?? "Not in gallery",
        createdAt: photo.createdAt
      }))
    }
  };
}

export async function getCustomerCommunicationView(slug: string) {
  const tenant = await prisma.tenant.findUnique({
    where: {
      slug
    },
    select: {
      id: true,
      name: true,
      conversations: {
        orderBy: {
          updatedAt: "desc"
        },
        include: {
          messages: {
            orderBy: {
              createdAt: "asc"
            }
          }
        }
      }
    }
  });

  if (!tenant) {
    return null;
  }

  return {
    tenantId: tenant.id,
    name: tenant.name,
    threads: tenant.conversations.map((thread) => ({
      id: thread.id,
      subject: thread.subject,
      status: thread.status,
      updatedAt: thread.updatedAt,
      messages: thread.messages.map((message) => ({
        id: message.id,
        senderRole: message.senderRole,
        body: message.body,
        createdAt: message.createdAt
      }))
    }))
  };
}

export async function getCustomerVisitorSupportView(slug: string) {
  const tenant = await prisma.tenant.findUnique({
    where: {
      slug
    },
    select: {
      id: true,
      name: true,
      visitorInquiries: {
        orderBy: {
          createdAt: "desc"
        }
      }
    }
  });

  if (!tenant) {
    return null;
  }

  return {
    tenantId: tenant.id,
    name: tenant.name,
    inquiries: tenant.visitorInquiries.map((inquiry) => ({
      id: inquiry.id,
      name: inquiry.name,
      email: inquiry.email,
      phone: inquiry.phone,
      subject: inquiry.subject,
      message: inquiry.message,
      status: inquiry.status,
      createdAt: inquiry.createdAt
    }))
  };
}

export async function getCustomerPhotosView(slug: string) {
  const tenant = await prisma.tenant.findUnique({
    where: {
      slug
    },
    include: {
      categories: {
        where: {
          parentId: null
        },
        include: {
          children: {
            orderBy: {
              createdAt: "asc"
            }
          }
        },
        orderBy: {
          createdAt: "asc"
        }
      },
      blogCategories: {
        orderBy: [
          {
            displayOrder: "asc"
          },
          {
            name: "asc"
          }
        ]
      },
      albums: {
        orderBy: {
          title: "asc"
        },
        select: {
          id: true,
          title: true
        }
      },
      photos: {
        include: {
          category: {
            include: {
              parent: true
            }
          },
          album: true
        },
        orderBy: {
          createdAt: "desc"
        },
        take: 60
      }
    }
  });

  if (!tenant) {
    return null;
  }

  return {
    name: tenant.name,
    uploadCategories: tenant.categories.map((category) => ({
      id: category.id,
      name: category.name,
      children: category.children.map((child) => ({
        id: child.id,
        name: child.name
      }))
    })),
    galleryOptions: tenant.albums.map((album) => ({
      id: album.id,
      label: album.title
    })),
    photos: tenant.photos.map((photo) => ({
      id: photo.id,
      title: photo.title ?? photo.alt,
      alt: photo.alt,
      image: photo.secureUrl,
      status: photo.moderationStatus,
      categoryId: photo.categoryId,
      albumId: photo.albumId,
      category: photo.category?.parent ? `${photo.category.parent.name} / ${photo.category.name}` : photo.category?.name ?? "Uncategorized",
      gallery: photo.album?.title ?? "Not in gallery",
      createdAt: photo.createdAt
    }))
  };
}

export async function getCustomerGalleriesView(slug: string) {
  await syncSubscriptionLifecycle();

  const [tenant, platformParentTypes] = await Promise.all([
    prisma.tenant.findUnique({
    where: {
      slug
    },
    include: {
      categories: {
        where: {
          parentId: null
        },
        include: {
          _count: {
            select: {
              albums: true,
              photos: true
            }
          },
          children: {
            include: {
              _count: {
                select: {
                  albums: true,
                  photos: true
                }
              }
            },
            orderBy: {
              createdAt: "asc"
            }
          }
        },
        orderBy: {
          createdAt: "asc"
        }
      },
      albums: {
        include: {
          category: {
            include: {
              parent: true
            }
          },
          _count: {
            select: {
              photos: true
            }
          },
          photos: {
            orderBy: {
              createdAt: "asc"
            },
            take: 1
          }
        },
        orderBy: {
          createdAt: "asc"
        }
      },
      categoryRequests: {
        orderBy: {
          createdAt: "desc"
        },
        take: 6,
        include: {
          parentType: true
        }
      },
      subscription: {
        include: {
          plan: true
        }
      }
    }
  }),
    prisma.platformPhotographyType.findMany({
      where: {
        enabled: true,
        parentId: null
      },
      include: {
        children: {
          where: {
            enabled: true
          },
          orderBy: [{ displayOrder: "asc" }, { name: "asc" }]
        }
      },
      orderBy: [{ displayOrder: "asc" }, { name: "asc" }]
    })
  ]);

  if (!tenant) {
    return null;
  }

  const planAccess = await getTenantPlanAccess(slug);
  const categoryRequestLimit = planAccess?.limits[planLimitKeys.categoryRequestsTotal];

  return {
    name: tenant.name,
    categories: tenant.categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      image: category.image,
      albumCount: category._count.albums,
      photoCount: category._count.photos,
      children: category.children.map((child) => ({
        id: child.id,
        name: child.name,
        slug: child.slug,
        image: child.image,
        albumCount: child._count.albums,
        photoCount: child._count.photos
      }))
    })),
    uploadCategories: tenant.categories.flatMap((category) =>
      category.children.length
        ? category.children.map((child) => ({
            id: child.id,
            label: `${category.name} / ${child.name}`
          }))
        : [
            {
              id: category.id,
              label: category.name
            }
          ]
    ),
    albums: tenant.albums.map((album) => ({
      id: album.id,
      title: album.title,
      slug: album.slug,
      description: album.description,
      category: album.category?.parent ? `${album.category.parent.name} / ${album.category.name}` : album.category?.name,
      categoryId: album.categoryId,
      featured: album.featured,
      published: album.published,
      photoCount: album._count.photos,
      coverImage: album.photos[0]?.secureUrl
    })),
    parentCategoryOptions: platformParentTypes.map((type) => ({
      slug: type.slug,
      name: type.name
    })),
    availableCategories: platformParentTypes.map((type) => ({
      slug: type.slug,
      name: type.name,
      image: type.image,
      linked: tenant.categories.some((category) => category.slug === type.slug),
      children: type.children.map((child) => ({
        slug: child.slug,
        name: child.name,
        image: child.image,
        linked: tenant.categories.some((category) => category.slug === child.slug)
      }))
    })),
    canRequestCustomCategories: categoryRequestLimit == null || categoryRequestLimit > 0,
    categoryRequestLimit: categoryRequestLimit ?? null,
    categoryRequests: tenant.categoryRequests.map((request) => ({
      id: request.id,
      name: request.name,
      status: request.status,
      image: request.image,
      parentName: request.parentType?.name,
      adminNote: request.adminNote
    }))
  };
}

export async function getCustomerContentView(slug: string) {
  const tenant = await prisma.tenant.findUnique({
    where: {
      slug
    },
    include: {
      pages: {
        orderBy: {
          createdAt: "asc"
        }
      },
      blogs: {
        orderBy: {
          createdAt: "desc"
        }
      }
    }
  });

  if (!tenant) {
    return null;
  }

  return {
    name: tenant.name,
    pages: tenant.pages,
    blogs: tenant.blogs
  };
}

export async function getCustomerBlogEditorView(slug: string) {
  const tenant = await prisma.tenant.findUnique({
    where: {
      slug
    },
    include: {
      categories: {
        where: {
          parentId: null
        },
        include: {
          children: {
            orderBy: {
              createdAt: "asc"
            }
          }
        },
        orderBy: {
          createdAt: "asc"
        }
      },
      blogCategories: {
        orderBy: [
          {
            displayOrder: "asc"
          },
          {
            name: "asc"
          }
        ]
      },
      photos: {
        where: {
          moderationStatus: "APPROVED"
        },
        orderBy: {
          createdAt: "desc"
        },
        take: 24,
        select: {
          id: true,
          title: true,
          alt: true,
          secureUrl: true
        }
      }
    }
  });

  if (!tenant) {
    return null;
  }

  return {
    name: tenant.name,
    blogCategories: tenant.blogCategories.map((category) => ({
      id: category.id,
      label: category.name
    })),
    relatedCategories: tenant.categories.flatMap((category) =>
      category.children.length
        ? category.children.map((child) => ({
            id: child.id,
            label: `${category.name} / ${child.name}`
          }))
        : [
            {
              id: category.id,
              label: category.name
            }
          ]
    ),
    photos: tenant.photos.map((photo) => ({
      id: photo.id,
      title: photo.title ?? photo.alt,
      image: photo.secureUrl
    }))
  };
}

export async function getCustomerBlogPostEditorView(slug: string, blogId: string) {
  const tenant = await prisma.tenant.findUnique({
    where: {
      slug
    },
    include: {
      categories: {
        where: {
          parentId: null
        },
        include: {
          children: {
            orderBy: {
              createdAt: "asc"
            }
          }
        },
        orderBy: {
          createdAt: "asc"
        }
      },
      blogCategories: {
        orderBy: [
          {
            displayOrder: "asc"
          },
          {
            name: "asc"
          }
        ]
      },
      photos: {
        where: {
          moderationStatus: "APPROVED"
        },
        orderBy: {
          createdAt: "desc"
        },
        take: 24,
        select: {
          id: true,
          title: true,
          alt: true,
          secureUrl: true
        }
      },
      blogs: {
        where: {
          id: blogId
        },
        take: 1
      }
    }
  });

  const blog = tenant?.blogs[0];

  if (!tenant || !blog) {
    return null;
  }

  return {
    name: tenant.name,
    blogCategories: tenant.blogCategories.map((category) => ({
      id: category.id,
      label: category.name
    })),
    relatedCategories: tenant.categories.flatMap((category) =>
      category.children.length
        ? category.children.map((child) => ({
            id: child.id,
            label: `${category.name} / ${child.name}`
          }))
        : [
            {
              id: category.id,
              label: category.name
            }
          ]
    ),
    photos: tenant.photos.map((photo) => ({
      id: photo.id,
      title: photo.title ?? photo.alt,
      image: photo.secureUrl
    })),
    blog: {
      id: blog.id,
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt ?? "",
      blogCategoryId: blog.blogCategoryId,
      relatedCategoryId: blog.categoryId,
      featuredImage: blog.featuredImage,
      tags: blog.tags,
      contentHtml: readBlogHtml(blog.content)
    }
  };
}

export async function getCustomerBlogCategoriesView(slug: string) {
  const tenant = await prisma.tenant.findUnique({
    where: {
      slug
    },
    include: {
      blogCategories: {
        orderBy: [
          {
            displayOrder: "asc"
          },
          {
            name: "asc"
          }
        ],
        include: {
          _count: {
            select: {
              posts: true
            }
          }
        }
      }
    }
  });

  if (!tenant) {
    return null;
  }

  return {
    name: tenant.name,
    categories: tenant.blogCategories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description ?? "",
      postCount: category._count.posts
    }))
  };
}

export async function getCustomerSettingsView(slug: string) {
  await syncSubscriptionLifecycle();

  const tenant = await prisma.tenant.findUnique({
    where: {
      slug
    },
    include: {
      settings: true,
      domains: {
        orderBy: {
          createdAt: "asc"
        }
      },
      subscription: {
        include: {
          plan: true
        }
      },
      photos: {
        where: {
          moderationStatus: "APPROVED"
        },
        include: {
          category: {
            include: {
              parent: true
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        },
        take: 120
      }
    }
  });

  if (!tenant) {
    return null;
  }
  const businessDetails = normalizeRecord(tenant.settings?.businessDetails);
  const hero = normalizeRecord(businessDetails.hero);
  const pageHeaders = normalizeRecord(businessDetails.pageHeaders);
  const contact = normalizeRecord(businessDetails.contact);
  const socialLinks = normalizeSocialLinks(businessDetails.socialLinks);
  const watermark = normalizeTenantWatermark(businessDetails.watermark);
  const sections = normalizeRecord(businessDetails.sections);
  const homepage = normalizeRecord(businessDetails.homepage);
  const homepageFeaturedPhotos = normalizeRecord(homepage.featuredPhotos);
  const fallbackHeroImage = "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=85";
  const planAccess = await getTenantPlanAccess(slug);
  const planKey = planAccess?.planKey ?? getEffectivePlanKey(tenant.subscription);
  const canHideFooter = !["basic", "free", "plus"].includes(planKey);
  const heroImages = normalizeStringList(hero.images);
  const heroImage = readString(hero.image) ?? heroImages[0] ?? fallbackHeroImage;

  return {
    name: tenant.name,
    slug: tenant.slug,
    status: tenant.status,
    defaultLocale: tenant.defaultLocale,
    themeKey: tenant.settings?.themeKey ?? "minimal",
    planKey,
    site: {
      heroTitle: readString(hero.title) ?? tenant.name,
      specialty: readString(hero.specialty) ?? "Photography",
      tagline: readString(hero.tagline) ?? `Selected work, stories, and visual collections by ${tenant.name}.`,
      heroImage,
      heroImages: heroImages.length ? heroImages : [heroImage],
      heroImageLimit: planAccess?.limits[planLimitKeys.heroImagesTotal] ?? 1,
      canUsePageHeaderImages: hasFeatureInAccess(planAccess, "pageHeaderImages"),
      pageHeaders: {
        gallery: normalizePageHeader(pageHeaders.gallery),
        categories: normalizePageHeader(pageHeaders.categories),
        blog: normalizePageHeader(pageHeaders.blog),
        about: normalizePageHeader(pageHeaders.about)
      },
      canUseCustomWatermark: hasFeatureInAccess(planAccess, "watermarks"),
      contactEmail: readString(contact.email) ?? `${tenant.slug}@example.com`,
      contactPhone: readString(contact.phone) ?? "",
      location: readString(contact.location) ?? "Islamabad, Pakistan",
      socialLinks,
      watermark,
      sections: {
        hero: readSectionEnabled(sections.hero, true),
        featuredPhotos: readSectionEnabled(sections.featuredPhotos, true),
        categories: readSectionEnabled(sections.categories, true),
        galleries: readSectionEnabled(sections.galleries, true),
        contact: readSectionEnabled(sections.contact, true),
        footer: canHideFooter ? readSectionEnabled(sections.footer, true) : true
      },
      sectionOrder: getSectionOrder(sections),
      homepage: {
        featuredPhotos: {
          source: readEnum(homepageFeaturedPhotos.source, ["selected", "all", "category", "subcategory", "gallery"], "selected"),
          sourceId: readString(homepageFeaturedPhotos.sourceId) ?? "",
          selectedPhotoIds: normalizeStringList(homepageFeaturedPhotos.selectedPhotoIds),
          limit: readNumber(homepageFeaturedPhotos.limit, 12),
          columns: readEnum(homepageFeaturedPhotos.columns, ["1", "2", "3", "4", "masonry"], "3"),
          gridStyle: readEnum(homepageFeaturedPhotos.gridStyle, ["square", "portrait", "landscape", "tiles", "mixed"], "mixed"),
          pagination: "infinite"
        }
      },
      photoOptions: tenant.photos.map((photo) => ({
        id: photo.id,
        title: photo.title ?? photo.alt,
        image: photo.secureUrl,
        category: photo.category?.parent ? `${photo.category.parent.name} / ${photo.category.name}` : photo.category?.name ?? "Uncategorized"
      }))
    },
    domain: tenant.domains[0] ?? null,
    canUseCustomDomain: hasFeatureInAccess(planAccess, "customDomains")
  };
}

export async function getCustomerPackageView(slug: string) {
  await syncSubscriptionLifecycle();

  const [tenant, access, availablePlans] = await Promise.all([
    prisma.tenant.findUnique({
      where: {
        slug
      },
      include: {
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
        }
      }
    }),
    getTenantPlanAccess(slug),
    prisma.plan.findMany({
      where: {
        enabled: true
      },
      include: {
        features: {
          include: {
            feature: true
          },
          orderBy: {
            createdAt: "asc"
          }
        }
      },
      orderBy: [
        {
          displayOrder: "asc"
        },
        {
          name: "asc"
        }
      ]
    })
  ]);

  if (!tenant) {
    return null;
  }

  const lifecycle = getSubscriptionLifecycle(tenant.subscription);
  const plan = tenant.subscription?.plan;

  return {
    name: tenant.name,
    slug: tenant.slug,
    current: {
      key: access?.planKey ?? getEffectivePlanKey(tenant.subscription),
      name: plan?.name ?? "Free",
      description: plan?.description ?? "Starter plan for publishing a simple portfolio.",
      status: tenant.subscription?.status ?? "NONE",
      label: lifecycle.label,
      tone: lifecycle.tone,
      isUsable: lifecycle.isUsable,
      endsAt: tenant.subscription?.currentPeriodEnds ?? null,
      adminNote: tenant.subscription?.adminNote ?? "",
      monthlyPrice: plan?.monthlyPrice ?? null,
      annualPrice: plan?.annualPrice ?? null,
      lifetimePrice: plan?.lifetimePrice ?? null,
      gracePeriodDays: plan?.gracePeriodDays ?? 0
    },
    limits: {
      photosTotal: access?.limits[planLimitKeys.photosTotal] ?? null,
      photosPerCategory: access?.limits[planLimitKeys.photosPerCategory] ?? null,
      categoriesTotal: access?.limits[planLimitKeys.categoriesTotal] ?? null,
      subcategoriesPerCategory: access?.limits[planLimitKeys.subcategoriesPerCategory] ?? null,
      galleriesTotal: access?.limits[planLimitKeys.galleriesTotal] ?? null,
      photosPerGallery: access?.limits[planLimitKeys.photosPerGallery] ?? null,
      categoryRequestsTotal: access?.limits[planLimitKeys.categoryRequestsTotal] ?? null
    },
    features: visibleCustomerPlanFeatures(access?.features ?? []),
    availablePlans: availablePlans.map((item) => ({
      id: item.id,
      key: item.key,
      name: item.name,
      description: item.description,
      featured: item.featured,
      monthlyPrice: item.monthlyPrice,
      annualPrice: item.annualPrice,
      lifetimePrice: item.lifetimePrice,
      gracePeriodDays: item.gracePeriodDays,
      features: visibleCustomerPlanFeatures(item.features
        .filter((featureAccess) => featureAccess.enabled)
        .map((featureAccess) => ({
          key: featureAccess.feature.key,
          name: featureAccess.feature.name,
          description: featureAccess.feature.description,
          limit: featureAccess.limit
        })))
    }))
  };
}

function visibleCustomerPlanFeatures<T extends { key: string; name: string; description: string | null; limit: number | null }>(features: T[]) {
  return getClientVisiblePlanFeatures(features);
}

export async function getCustomerProfileView(slug: string) {
  const tenant = await prisma.tenant.findUnique({
    where: {
      slug
    },
    include: {
      settings: true,
      owner: {
        select: {
          name: true,
          email: true,
          image: true
        }
      }
    }
  });

  if (!tenant) {
    return null;
  }

  const businessDetails = normalizeRecord(tenant.settings?.businessDetails);
  const profile = normalizeRecord(businessDetails.profile);
  const contact = normalizeRecord(businessDetails.contact);

  return {
    name: tenant.name,
    slug: tenant.slug,
    accountEmail: tenant.owner?.email ?? readString(profile.email) ?? readString(contact.email) ?? `${tenant.slug}@example.com`,
    profile: {
      displayName: readString(profile.displayName) ?? tenant.owner?.name ?? tenant.name,
      headline: readString(profile.headline) ?? `The photographer behind ${tenant.name}.`,
      avatarUrl: readString(profile.avatarUrl) ?? tenant.owner?.image ?? "",
      email: readString(profile.email) ?? tenant.owner?.email ?? readString(contact.email) ?? `${tenant.slug}@example.com`,
      phone: readString(profile.phone) ?? "",
      location: readString(profile.location) ?? readString(contact.location) ?? "Islamabad, Pakistan",
      bio: readString(profile.bio) ?? ""
    }
  };
}

function normalizeRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
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

function normalizeSocialLinks(value: unknown) {
  const savedLinks = normalizeRecord(value);
  const keys = ["instagram", "facebook", "youtube", "linkedin", "snapchat", "pinterest", "behance", "tiktok"] as const;

  return Object.fromEntries(
    keys.map((key) => {
      const rawLink = savedLinks[key];
      const link = normalizeRecord(rawLink);
      const href = readString(link.href) ?? readString(rawLink);

      return [
        key,
        {
          href: href ?? "",
          enabled: readBoolean(link.enabled, Boolean(href))
        }
      ];
    })
  ) as Record<(typeof keys)[number], { href: string; enabled: boolean }>;
}

function normalizeStringList(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string" && Boolean(item.trim())) : [];
}

function readBlogHtml(value: unknown) {
  const content = normalizeRecord(value);
  const html = content.html;
  return typeof html === "string" && html.trim() ? html : "<p>Write the story behind this shoot...</p>";
}

function readString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function readBoolean(value: unknown, fallback: boolean) {
  return typeof value === "boolean" ? value : fallback;
}

function readSectionEnabled(value: unknown, fallback: boolean) {
  if (typeof value === "boolean") {
    return value;
  }

  const section = normalizeRecord(value);
  return readBoolean(section.enabled, fallback);
}

function readSectionOrder(value: unknown, fallback: number) {
  const section = normalizeRecord(value);
  return readNumber(section.displayOrder, fallback);
}

function getSectionOrder(sections: Record<string, unknown>): HomeSectionKey[] {
  return [...homeSectionKeys].sort((first, second) => {
    return readSectionOrder(sections[first], homeSectionKeys.indexOf(first) + 1) - readSectionOrder(sections[second], homeSectionKeys.indexOf(second) + 1);
  });
}

function readNumber(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function readEnum<T extends string>(value: unknown, options: readonly T[], fallback: T) {
  return typeof value === "string" && options.includes(value as T) ? (value as T) : fallback;
}
