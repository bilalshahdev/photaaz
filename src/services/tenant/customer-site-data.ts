import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { customerDemos } from "@/data/customer-demos";
import { cacheDurations, cacheTags } from "@/lib/cache";

export type CustomerSiteView = {
  studioName: string;
  specialty: string;
  tagline: string;
  heroImage: string;
  galleries: Array<{ title: string; location: string; image: string }>;
  isDemo?: boolean;
};

async function getCustomerSiteViewFromDb(slug: string): Promise<CustomerSiteView | null> {
  const tenant = await prisma.tenant.findUnique({
    where: {
      slug
    },
    include: {
      settings: true,
      categories: {
        where: {
          parentId: null
        },
        orderBy: {
          createdAt: "asc"
        }
      },
      albums: {
        where: {
          published: true
        },
        include: {
          category: {
            include: {
              parent: true
            }
          },
          photos: {
            orderBy: {
              createdAt: "asc"
            }
          }
        },
        orderBy: [
          {
            featured: "desc"
          },
          {
            createdAt: "asc"
          }
        ],
        take: 3
      }
    }
  });

  if (!tenant || tenant.status !== "ACTIVE") {
    return null;
  }

  const primaryCategory = tenant.categories[0]?.name ?? "Photography";
  const firstAlbum = tenant.albums[0];
  const firstPhoto = firstAlbum?.photos[0];
  const fallback = customerDemos[slug] ?? customerDemos.demo;

  return {
    studioName: tenant.name,
    specialty: `${primaryCategory} photography`,
    tagline: `Selected work, stories, and visual collections by ${tenant.name}.`,
    heroImage: firstPhoto?.secureUrl ?? fallback.heroImage,
    galleries: tenant.albums.length
      ? tenant.albums.map((album) => ({
          title: album.title,
          location: album.category?.parent ? `${album.category.parent.name} / ${album.category.name}` : album.category?.name ?? album.description ?? "Featured",
          image: album.photos[0]?.secureUrl ?? fallback.heroImage
        }))
      : fallback.galleries
  };
}

export function getCustomerSiteView(slug: string): Promise<CustomerSiteView | null> {
  return unstable_cache(
    () => getCustomerSiteViewFromDb(slug),
    ["customer-site-view", slug],
    {
      revalidate: cacheDurations.tenantPublic,
      tags: [cacheTags.tenant(slug), cacheTags.tenantPublic(slug)]
    }
  )();
}
