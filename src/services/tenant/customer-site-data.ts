import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { customerDemos } from "@/data/customer-demos";
import { cacheDurations, cacheTags } from "@/lib/cache";
import { getPlatformAppConfig } from "@/services/admin/admin-data";
import { getEffectivePlanKey } from "@/services/subscription/lifecycle";
import {
  normalizeTenantWatermark,
  resolveEffectiveImageWatermark,
  type EffectiveImageWatermark,
} from "@/services/platform/media-policy";
import {
  getTenantPlanAccess,
  hasFeatureInAccess,
  planLimitKeys,
} from "@/services/subscription/plan-limits";
import {
  canPlanUseThemeWithLimit,
  themes,
  type ThemeKey,
} from "@/config/themes";
import { applyCloudinaryImageWatermark } from "@/services/storage/cloudinary-delivery";

const homeSectionKeys = [
  "hero",
  "featuredPhotos",
  "categories",
  "galleries",
  "contact",
  "footer",
] as const;
type HomeSectionKey = (typeof homeSectionKeys)[number];

export type CustomerSiteView = {
  studioName: string;
  themeKey?: string;
  specialty: string;
  tagline: string;
  heroTitle?: string;
  heroImage: string;
  heroImages?: string[];
  heroImageLinks?: string[];
  pageHeaders?: CustomerPageHeaders;
  contactEmail?: string;
  contactPhone?: string;
  location?: string;
  ownerProfile?: {
    displayName: string;
    headline: string;
    avatarUrl: string;
    bio: string;
    email: string;
    phone: string;
    location: string;
  };
  socialLinks?: Record<
    | "instagram"
    | "facebook"
    | "youtube"
    | "linkedin"
    | "snapchat"
    | "pinterest"
    | "behance"
    | "tiktok",
    { href: string; enabled: boolean }
  >;
  sections?: {
    hero: boolean;
    featuredPhotos: boolean;
    categories: boolean;
    galleries: boolean;
    contact: boolean;
    footer: boolean;
  };
  sectionOrder?: HomeSectionKey[];
  homepage?: {
    copy: {
      welcomeTitle: string;
      featuredTitle: string;
      galleriesTitle: string;
      contactTitle: string;
      contactBody: string;
    };
    featuredPhotos: {
      source: "selected" | "all" | "category" | "subcategory" | "gallery";
      sourceId: string;
      selectedPhotoIds: string[];
      limit: number;
      columns: "1" | "2" | "3" | "4" | "masonry";
      gridStyle: "square" | "portrait" | "landscape" | "tiles" | "mixed";
      pagination: "infinite";
    };
  };
  imageWatermark?: EffectiveImageWatermark | null;
  photos?: CustomerSitePhoto[];
  galleries: CustomerSiteGallery[];
  categories?: CustomerSiteCategory[];
  isDemo?: boolean;
};

export type CustomerPageKey = "gallery" | "categories" | "blog" | "about";

export type CustomerPageHeader = {
  image: string;
  title: string;
  description: string;
};

export type CustomerPageHeaders = Record<CustomerPageKey, CustomerPageHeader>;

export type CustomerSitePhoto = {
  id: string;
  title: string;
  location: string;
  image: string;
  watermarkApplied?: boolean;
  galleryTitle?: string | null;
  categoryName?: string | null;
  subcategoryName?: string | null;
};

export type CustomerSiteGallery = {
  id?: string;
  title: string;
  slug?: string;
  location: string;
  image: string;
  watermarkApplied?: boolean;
  photos?: CustomerSitePhoto[];
};

export type CustomerSiteCategory = {
  id: string;
  name: string;
  slug: string;
  image: string;
  subcategories: Array<{
    id: string;
    name: string;
    slug: string;
    image: string;
    photos: CustomerSitePhoto[];
  }>;
  photos: CustomerSitePhoto[];
};

export type CustomerPublicBlogPost = {
  title: string;
  slug: string;
  excerpt: string;
  featuredImage?: string | null;
  contentHtml: string;
  tags: string[];
  publishedAt?: Date | null;
};

async function getCustomerSiteViewFromDb(
  slug: string,
): Promise<CustomerSiteView | null> {
  const tenant = await prisma.tenant.findUnique({
    where: {
      slug,
    },
    include: {
      settings: true,
      subscription: {
        include: {
          plan: {
            include: {
              features: {
                include: {
                  feature: true,
                },
              },
            },
          },
        },
      },
      categories: {
        where: {
          parentId: null,
        },
        include: {
          photos: {
            where: {
              moderationStatus: "APPROVED",
            },
            include: {
              category: {
                include: {
                  parent: true,
                },
              },
            },
            orderBy: {
              createdAt: "asc",
            },
          },
          children: {
            include: {
              photos: {
                where: {
                  moderationStatus: "APPROVED",
                },
                include: {
                  category: {
                    include: {
                      parent: true,
                    },
                  },
                },
                orderBy: {
                  createdAt: "asc",
                },
              },
            },
            orderBy: {
              createdAt: "asc",
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
      albums: {
        where: {
          published: true,
        },
        include: {
          category: {
            include: {
              parent: true,
            },
          },
          photos: {
            where: {
              moderationStatus: "APPROVED",
            },
            include: {
              category: {
                include: {
                  parent: true,
                },
              },
            },
            orderBy: {
              createdAt: "asc",
            },
          },
        },
        orderBy: [
          {
            featured: "desc",
          },
          {
            createdAt: "asc",
          },
        ],
      },
    },
  });

  if (!tenant || tenant.status !== "ACTIVE") {
    return null;
  }

  const isSeededDemoTenant = tenant.slug === "demo";
  const primaryCategory = tenant.categories[0]?.name ?? "Photography";
  const firstAlbum = tenant.albums[0];
  const firstPhoto = firstAlbum?.photos[0];
  const fallback = customerDemos[slug] ?? customerDemos.demo;
  const businessDetails = normalizeRecord(tenant.settings?.businessDetails);
  const hero = normalizeRecord(businessDetails.hero);
  const pageHeaders = normalizePageHeaders(businessDetails.pageHeaders);
  const contact = normalizeRecord(businessDetails.contact);
  const profile = normalizeRecord(businessDetails.profile);
  const socialLinks = normalizeSocialLinks(businessDetails.socialLinks);
  const sections = normalizeRecord(businessDetails.sections);
  const homepage = normalizeRecord(businessDetails.homepage);
  const homepageCopy = normalizeRecord(homepage.copy);
  const homepageFeaturedPhotos = normalizeRecord(homepage.featuredPhotos);
  const [appConfig, planAccess] = await Promise.all([
    getPlatformAppConfig(),
    getTenantPlanAccess(slug),
  ]);
  const planKey =
    planAccess?.planKey ?? getEffectivePlanKey(tenant.subscription);
  const canHideFooter = !["basic", "free", "plus"].includes(planKey);
  const tenantWatermark = hasFeatureInAccess(planAccess, "watermarks")
    ? normalizeTenantWatermark(businessDetails.watermark)
    : normalizeTenantWatermark(undefined);
  const imageWatermark = resolveEffectiveImageWatermark({
    planKey,
    platformPolicy: appConfig.media,
    tenantWatermark,
  });
  const photosTotalLimit = planAccess?.limits[planLimitKeys.photosTotal];
  const photosPerCategoryLimit =
    planAccess?.limits[planLimitKeys.photosPerCategory];
  const galleriesTotalLimit = planAccess?.limits[planLimitKeys.galleriesTotal];
  const photosPerGalleryLimit =
    planAccess?.limits[planLimitKeys.photosPerGallery];
  const categoriesTotalLimit =
    planAccess?.limits[planLimitKeys.categoriesTotal];
  const subcategoriesPerCategoryLimit =
    planAccess?.limits[planLimitKeys.subcategoriesPerCategory];
  const premiumThemeLimit =
    planAccess?.limits[planLimitKeys.premiumThemesLimit];
  const savedThemeKey = (tenant.settings?.themeKey ?? "minimal") as ThemeKey;
  const savedTheme =
    themes.find((theme) => theme.key === savedThemeKey) ?? themes[0];
  const themeKey = canPlanUseThemeWithLimit(
    planKey,
    savedTheme,
    premiumThemeLimit,
  )
    ? savedTheme.key
    : "minimal";
  const storedHeroImages = normalizeStringList(hero.images);
  const storedHeroLinks = normalizeStringList(hero.links);
  const heroImage =
    readString(hero.image) ??
    storedHeroImages[0] ??
    firstPhoto?.secureUrl ??
    fallback.heroImage;
  const galleryItems = tenant.albums.map((album) => {
    const photos = limitList(
      album.photos.map((photo) => mapPhoto(photo, album.title, imageWatermark)),
      photosPerGalleryLimit,
    );

    const coverImage = photos[0]?.image ?? heroImage;
    const coverWatermarkApplied = photos[0]?.watermarkApplied ?? false;

    return {
      id: album.id,
      title: album.title,
      slug: album.slug,
      location: album.category?.parent
        ? `${album.category.parent.name} / ${album.category.name}`
        : (album.category?.name ?? album.description ?? "Featured"),
      image: coverImage,
      watermarkApplied: coverWatermarkApplied,
      photos,
    };
  });

  const categoryItems = tenant.categories.map((category) => {
    const directPhotos = limitList(
      category.photos.map((photo) =>
        mapPhoto(photo, undefined, imageWatermark),
      ),
      photosPerCategoryLimit,
    );
    const subcategories = limitList(
      category.children.map((child) => {
        const childPhotos = limitList(
          child.photos.map((photo) =>
            mapPhoto(photo, undefined, imageWatermark),
          ),
          photosPerCategoryLimit,
        );

        return {
          id: child.id,
          name: child.name,
          slug: child.slug,
          image: child.image || childPhotos[0]?.image || heroImage,
          photos: childPhotos,
        };
      }),
      subcategoriesPerCategoryLimit,
    );

    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      image:
        category.image ||
        directPhotos[0]?.image ||
        subcategories[0]?.image ||
        heroImage,
      photos: directPhotos,
      subcategories,
    };
  });

  const publicGalleries = isSeededDemoTenant
    ? buildDemoGalleries(galleryItems, fallback.galleries)
    : limitList(galleryItems, galleriesTotalLimit);
  const publicCategories = isSeededDemoTenant
    ? undefined
    : limitList(categoryItems, categoriesTotalLimit);
  const photosById = new Map<string, CustomerSitePhoto>();

  publicGalleries.forEach((gallery) => {
    gallery.photos?.forEach((photo) => photosById.set(photo.id, photo));
  });
  publicCategories?.forEach((category) => {
    category.photos.forEach((photo) => photosById.set(photo.id, photo));
    category.subcategories.forEach((subcategory) => {
      subcategory.photos.forEach((photo) => photosById.set(photo.id, photo));
    });
  });

  return {
    studioName: tenant.name,
    themeKey,
    specialty: readString(hero.specialty) ?? `${primaryCategory} photography`,
    tagline:
      readString(hero.tagline) ??
      `Selected work, stories, and visual collections by ${tenant.name}.`,
    heroTitle: readString(hero.title),
    heroImage,
    heroImages: storedHeroImages.length ? storedHeroImages : [heroImage],
    heroImageLinks: storedHeroLinks,
    pageHeaders,
    contactEmail: readString(profile.email) ?? readString(contact.email),
    contactPhone: readString(profile.phone) ?? readString(contact.phone),
    location: readString(profile.location) ?? readString(contact.location),
    ownerProfile: {
      displayName: readString(profile.displayName) ?? tenant.name,
      headline:
        readString(profile.headline) ??
        `The photographer behind ${tenant.name}.`,
      avatarUrl: readString(profile.avatarUrl) ?? "",
      bio: readString(profile.bio) ?? "",
      email: readString(profile.email) ?? readString(contact.email) ?? "",
      phone: readString(profile.phone) ?? readString(contact.phone) ?? "",
      location:
        readString(profile.location) ?? readString(contact.location) ?? "",
    },
    socialLinks,
    sections: {
      hero: readSectionEnabled(sections.hero, true),
      featuredPhotos: readSectionEnabled(sections.featuredPhotos, true),
      categories: readSectionEnabled(sections.categories, true),
      galleries: readSectionEnabled(sections.galleries, true),
      contact: readSectionEnabled(sections.contact, true),
      footer: canHideFooter ? readSectionEnabled(sections.footer, true) : true,
    },
    sectionOrder: getSectionOrder(sections),
    homepage: {
      copy: {
        welcomeTitle:
          readString(homepageCopy.welcomeTitle) ??
          "Images with history, energy and a point of view.",
        featuredTitle:
          readString(homepageCopy.featuredTitle) ?? "Featured photographs",
        galleriesTitle:
          readString(homepageCopy.galleriesTitle) ?? "Inside the work",
        contactTitle:
          readString(homepageCopy.contactTitle) ??
          "Bring the next story into focus.",
        contactBody:
          readString(homepageCopy.contactBody) ??
          "Available for editorial assignments, campaigns, portraits, events and image licensing.",
      },
      featuredPhotos: {
        source: readEnum(
          homepageFeaturedPhotos.source,
          ["selected", "all", "category", "subcategory", "gallery"],
          "selected",
        ),
        sourceId: readString(homepageFeaturedPhotos.sourceId) ?? "",
        selectedPhotoIds: normalizeStringList(
          homepageFeaturedPhotos.selectedPhotoIds,
        ),
        limit: readNumber(homepageFeaturedPhotos.limit, 12),
        columns: readEnum(
          homepageFeaturedPhotos.columns,
          ["1", "2", "3", "4", "masonry"],
          "3",
        ),
        gridStyle: readEnum(
          homepageFeaturedPhotos.gridStyle,
          ["square", "portrait", "landscape", "tiles", "mixed"],
          "mixed",
        ),
        pagination: "infinite",
      },
    },
    imageWatermark,
    photos: limitList(Array.from(photosById.values()), photosTotalLimit),
    galleries: publicGalleries,
    categories: publicCategories,
    isDemo: isSeededDemoTenant,
  };
}

function normalizePageHeaders(value: unknown): CustomerPageHeaders {
  const headers = normalizeRecord(value);

  return {
    gallery: normalizePageHeader(headers.gallery),
    categories: normalizePageHeader(headers.categories),
    blog: normalizePageHeader(headers.blog),
    about: normalizePageHeader(headers.about),
  };
}

function normalizePageHeader(value: unknown): CustomerPageHeader {
  if (typeof value === "string") {
    return {
      image: readString(value) ?? "",
      title: "",
      description: "",
    };
  }

  const header = normalizeRecord(value);

  return {
    image: readString(header.image) ?? "",
    title: readString(header.title) ?? "",
    description: readString(header.description) ?? "",
  };
}

function buildDemoGalleries(
  galleries: CustomerSiteGallery[],
  fallbackGalleries: CustomerSiteGallery[],
) {
  const merged = new Map<string, CustomerSiteGallery>();

  [...galleries, ...fallbackGalleries].forEach((gallery) => {
    const key = gallery.slug ?? gallery.title.toLowerCase();

    if (!merged.has(key)) {
      merged.set(key, gallery);
    }
  });

  return Array.from(merged.values());
}

export function getCustomerSiteView(
  slug: string,
): Promise<CustomerSiteView | null> {
  return unstable_cache(
    () => getCustomerSiteViewFromDb(slug),
    ["customer-site-view", slug],
    {
      revalidate: cacheDurations.tenantPublic,
      tags: [cacheTags.tenant(slug), cacheTags.tenantPublic(slug)],
    },
  )();
}

async function getCustomerPublicBlogsFromDb(
  slug: string,
): Promise<CustomerPublicBlogPost[]> {
  const planAccess = await getTenantPlanAccess(slug);
  const blogLimit = planAccess?.limits[planLimitKeys.blogsTotal];
  const tenant = await prisma.tenant.findUnique({
    where: {
      slug,
    },
    select: {
      id: true,
      status: true,
      blogs: {
        where: {
          moderationStatus: "APPROVED",
          publishedAt: {
            not: null,
          },
        },
        orderBy: {
          publishedAt: "desc",
        },
        take: blogLimit == null ? undefined : Math.max(blogLimit, 0),
      },
    },
  });

  if (!tenant || tenant.status !== "ACTIVE") {
    return [];
  }

  return tenant.blogs.map((blog) => ({
    title: blog.title,
    slug: blog.slug,
    excerpt: blog.excerpt ?? "",
    featuredImage: blog.featuredImage,
    contentHtml: readBlogHtml(blog.content),
    tags: blog.tags,
    publishedAt: blog.publishedAt,
  }));
}

export function getCustomerPublicBlogs(
  slug: string,
): Promise<CustomerPublicBlogPost[]> {
  return unstable_cache(
    () => getCustomerPublicBlogsFromDb(slug),
    ["customer-public-blogs", slug],
    {
      revalidate: cacheDurations.tenantPublic,
      tags: [cacheTags.tenant(slug), cacheTags.tenantPublic(slug)],
    },
  )();
}

function normalizeRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function normalizeSocialLinks(value: unknown) {
  const savedLinks = normalizeRecord(value);
  const keys = [
    "instagram",
    "facebook",
    "youtube",
    "linkedin",
    "snapchat",
    "pinterest",
    "behance",
    "tiktok",
  ] as const;

  return Object.fromEntries(
    keys.map((key) => {
      const rawLink = savedLinks[key];
      const link = normalizeRecord(rawLink);
      const href = readString(link.href) ?? readString(rawLink);

      return [
        key,
        {
          href: href ?? "",
          enabled: readBoolean(link.enabled, Boolean(href)),
        },
      ];
    }),
  ) as Record<(typeof keys)[number], { href: string; enabled: boolean }>;
}

function normalizeStringList(value: unknown) {
  return Array.isArray(value)
    ? value.filter(
        (item): item is string =>
          typeof item === "string" && Boolean(item.trim()),
      )
    : [];
}

function limitList<T>(items: T[], limit: number | null | undefined) {
  if (limit == null) {
    return items;
  }

  return items.slice(0, Math.max(limit, 0));
}

function readBlogHtml(value: unknown) {
  const content = normalizeRecord(value);
  const html = content.html;
  return typeof html === "string" && html.trim() ? html : "";
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
    return (
      readSectionOrder(sections[first], homeSectionKeys.indexOf(first) + 1) -
      readSectionOrder(sections[second], homeSectionKeys.indexOf(second) + 1)
    );
  });
}

function readNumber(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function readEnum<T extends string>(
  value: unknown,
  options: readonly T[],
  fallback: T,
) {
  return typeof value === "string" && options.includes(value as T)
    ? (value as T)
    : fallback;
}

function mapPhoto(
  photo: {
    id: string;
    title: string | null;
    alt: string;
    secureUrl: string;
    category?: {
      name: string;
      parent?: {
        name: string;
      } | null;
    } | null;
  },
  galleryTitle?: string,
  watermark?: EffectiveImageWatermark | null,
): CustomerSitePhoto {
  const categoryName =
    photo.category?.parent?.name ?? photo.category?.name ?? null;
  const subcategoryName = photo.category?.parent ? photo.category.name : null;
  const image = applyCloudinaryImageWatermark(photo.secureUrl, watermark);

  return {
    id: photo.id,
    title: photo.title ?? photo.alt,
    location: subcategoryName
      ? `${categoryName} / ${subcategoryName}`
      : (categoryName ?? galleryTitle ?? "Photography"),
    image: image.url,
    watermarkApplied: image.applied,
    galleryTitle,
    categoryName,
    subcategoryName,
  };
}
