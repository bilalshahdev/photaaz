import { prisma } from "@/lib/db/prisma";

type CreateTenantInput = {
  ownerUserId?: string | null;
  studioName: string;
  slug: string;
  themeKey?: string;
  categories?: string[];
  primaryType?: string;
  photoMode?: "sample" | "upload";
  defaultLocale?: string;
};

export async function createTenantForOwner({
  ownerUserId,
  studioName,
  slug,
  themeKey = "minimal",
  categories = [],
  primaryType,
  photoMode = "sample",
  defaultLocale = "en"
}: CreateTenantInput) {
  const freePlan = await prisma.plan.findUnique({
    where: {
      key: "free"
    }
  });

  const tenant = await prisma.tenant.create({
    data: {
      ownerUserId,
      name: studioName,
      slug,
      defaultLocale,
      settings: {
        create: {
          themeKey,
          businessDetails: {
            onboarding: {
              primaryType,
              photoMode
            }
          }
        }
      },
      categories: categories.length
        ? {
            createMany: {
              data: categories.map((category) => ({
                name: toTitleCase(category),
                slug: category
              })),
              skipDuplicates: true
            }
          }
        : undefined,
      pages: {
        createMany: {
          data: [
            {
              type: "HOME",
              title: "Home",
              slug: "home",
              published: true
            },
            {
              type: "ABOUT",
              title: "About",
              slug: "about",
              published: true
            },
            {
              type: "CONTACT",
              title: "Contact",
              slug: "contact",
              published: true
            }
          ]
        }
      },
      subscription: freePlan
        ? {
            create: {
              planId: freePlan.id,
              status: "TRIALING"
            }
          }
        : undefined
    }
  });
  const primaryCategorySlug = primaryType && categories.includes(primaryType) ? primaryType : categories[0];
  const primaryCategory = primaryCategorySlug
    ? await prisma.category.findFirst({
        where: {
          tenantId: tenant.id,
          slug: primaryCategorySlug
        },
        include: {
          children: {
            select: {
              id: true
            }
          }
        }
      })
    : null;
  const starterPhotoCategoryId = primaryCategory && primaryCategory.children.length === 0 ? primaryCategory.id : undefined;

  await prisma.album.create({
    data: {
      tenantId: tenant.id,
      categoryId: primaryCategory?.id,
      title: "Featured Work",
      slug: "featured-work",
      description: `A starter gallery for ${studioName}.`,
      featured: true,
      published: true,
      photos: {
        createMany: {
          data: getStarterPhotos(photoMode).map((photo, index) => ({
            tenantId: tenant.id,
            categoryId: starterPhotoCategoryId,
            title: photo.title,
            alt: photo.alt,
            cloudinaryId: `starter/${slug}/${index + 1}`,
            secureUrl: photo.secureUrl,
            width: 1200,
            height: 1500
          }))
        }
      }
    }
  });

  return tenant;
}

function toTitleCase(value: string) {
  return value.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getStarterPhotos(photoMode: "sample" | "upload") {
  if (photoMode === "upload") {
    return [
      {
        title: "Upload Placeholder",
        alt: "Photography portfolio upload placeholder",
        secureUrl: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=84"
      }
    ];
  }

  return [
    {
      title: "Golden Hour Story",
      alt: "Wedding couple during golden hour",
      secureUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=84"
    },
    {
      title: "Editorial Detail",
      alt: "Close up wedding detail photograph",
      secureUrl: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=84"
    },
    {
      title: "Portrait Session",
      alt: "Portrait photography starter image",
      secureUrl: "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?auto=format&fit=crop&w=1200&q=84"
    }
  ];
}
