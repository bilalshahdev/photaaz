import { prisma } from "@/lib/db/prisma";

export type CustomerDashboardView = {
  name: string;
  slug: string;
  themeKey: string;
  categoryCount: number;
  albumCount: number;
  photoCount: number;
  planKey: string;
  heroImage: string;
  notifications: Array<{
    id: string;
    title: string;
    body: string;
    status: "UNREAD" | "READ";
  }>;
};

export async function getCustomerDashboardView(slug: string): Promise<CustomerDashboardView | null> {
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
          photos: true
        }
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

  return {
    name: tenant.name,
    slug: tenant.slug,
    themeKey: tenant.settings?.themeKey ?? "minimal",
    categoryCount: tenant._count.categories,
    albumCount: tenant._count.albums,
    photoCount: tenant._count.photos,
    planKey: tenant.subscription?.plan.key ?? "free",
    heroImage: tenant.photos[0]?.secureUrl ?? "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=85",
    notifications: tenant.notifications
  };
}

export async function getCustomerGalleriesView(slug: string) {
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
      }
    }
  });

  if (!tenant) {
    return null;
  }

  return {
    name: tenant.name,
    categories: tenant.categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      albumCount: category._count.albums,
      photoCount: category._count.photos,
      children: category.children.map((child) => ({
        id: child.id,
        name: child.name,
        slug: child.slug,
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
      featured: album.featured,
      published: album.published,
      photoCount: album._count.photos,
      coverImage: album.photos[0]?.secureUrl
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

export async function getCustomerSettingsView(slug: string) {
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
      }
    }
  });

  if (!tenant) {
    return null;
  }

  return {
    name: tenant.name,
    slug: tenant.slug,
    status: tenant.status,
    defaultLocale: tenant.defaultLocale,
    themeKey: tenant.settings?.themeKey ?? "minimal",
    planKey: tenant.subscription?.plan.key ?? "free",
    domains: tenant.domains
  };
}
