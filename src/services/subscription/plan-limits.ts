import { prisma } from "@/lib/db/prisma";
import { defaultPlanFeatures, type FeatureKey } from "@/config/features";
import { getEffectivePlanKey, syncSubscriptionLifecycle } from "@/services/subscription/lifecycle";
import {
  assertCanCreateWithinLimit,
  assertResultingCountWithinLimit,
} from "@/services/subscription/limit-policy";

export const planLimitKeys = {
  blogsTotal: "blogs",
  photosTotal: "photos.total",
  heroImagesTotal: "heroImages.total",
  photosPerCategory: "photos.perCategory",
  categoriesTotal: "categories.total",
  subcategoriesPerCategory: "subcategories.perCategory",
  galleriesTotal: "galleries.total",
  photosPerGallery: "photos.perGallery",
  premiumThemesLimit: "premiumThemes.limit",
  freeMaintenanceMonths: "freeMaintenance.months",
  categoryRequestsTotal: "categoryRequests.total"
} as const;

export type PlanLimitKey = (typeof planLimitKeys)[keyof typeof planLimitKeys];
export type TenantFeatureAccess = {
  key: string;
  name: string;
  description: string | null;
  enabled: boolean;
  limit: number | null;
};

export const fallbackPlanLimits: Readonly<Record<string, Partial<Record<PlanLimitKey, number | null>>>> = {
  free: {
    [planLimitKeys.blogsTotal]: 3,
    [planLimitKeys.photosTotal]: 50,
    [planLimitKeys.heroImagesTotal]: 1,
    [planLimitKeys.photosPerCategory]: 20,
    [planLimitKeys.categoriesTotal]: 3,
    [planLimitKeys.subcategoriesPerCategory]: 3,
    [planLimitKeys.galleriesTotal]: 3,
    [planLimitKeys.photosPerGallery]: 20,
    [planLimitKeys.premiumThemesLimit]: 0,
    [planLimitKeys.categoryRequestsTotal]: 0
  },
  plus: {
    [planLimitKeys.blogsTotal]: 10,
    [planLimitKeys.photosTotal]: 300,
    [planLimitKeys.heroImagesTotal]: 3,
    [planLimitKeys.photosPerCategory]: 50,
    [planLimitKeys.categoriesTotal]: 10,
    [planLimitKeys.subcategoriesPerCategory]: 5,
    [planLimitKeys.galleriesTotal]: 10,
    [planLimitKeys.photosPerGallery]: 50,
    [planLimitKeys.premiumThemesLimit]: 2,
    [planLimitKeys.categoryRequestsTotal]: 5
  },
  pro: {
    [planLimitKeys.blogsTotal]: 50,
    [planLimitKeys.photosTotal]: 5000,
    [planLimitKeys.heroImagesTotal]: 5,
    [planLimitKeys.photosPerCategory]: 500,
    [planLimitKeys.categoriesTotal]: 20,
    [planLimitKeys.subcategoriesPerCategory]: 10,
    [planLimitKeys.galleriesTotal]: 50,
    [planLimitKeys.photosPerGallery]: 500,
    [planLimitKeys.premiumThemesLimit]: 5,
    [planLimitKeys.categoryRequestsTotal]: 20
  },
  ownership: {
    [planLimitKeys.blogsTotal]: null,
    [planLimitKeys.photosTotal]: null,
    [planLimitKeys.heroImagesTotal]: null,
    [planLimitKeys.photosPerCategory]: null,
    [planLimitKeys.categoriesTotal]: null,
    [planLimitKeys.subcategoriesPerCategory]: null,
    [planLimitKeys.galleriesTotal]: null,
    [planLimitKeys.photosPerGallery]: null,
    [planLimitKeys.premiumThemesLimit]: null,
    [planLimitKeys.freeMaintenanceMonths]: 2,
    [planLimitKeys.categoryRequestsTotal]: null
  }
};

export type TenantPlanAccess = {
  tenantId: string;
  planKey: string;
  limits: Partial<Record<PlanLimitKey, number | null>>;
  features: TenantFeatureAccess[];
};

export async function getTenantPlanAccess(tenantSlug: string): Promise<TenantPlanAccess | null> {
  await syncSubscriptionLifecycle();

  const tenant = await prisma.tenant.findUnique({
    where: { slug: tenantSlug },
    include: {
      subscription: {
        include: {
          plan: {
            include: {
              features: {
                include: {
                  feature: true
                }
              }
            }
          }
        }
      }
    }
  });

  if (!tenant) {
    return null;
  }

  const planKey = getEffectivePlanKey(tenant.subscription);
  const effectivePlan = tenant.subscription?.plan.key === planKey ? tenant.subscription.plan : null;
  const effectiveFeatureAccess = effectivePlan?.features ?? [];
  const limits: Partial<Record<PlanLimitKey, number | null>> = {
    ...(fallbackPlanLimits[planKey] ?? fallbackPlanLimits.free)
  };

  const features = effectiveFeatureAccess.map((featureAccess) => ({
    key: featureAccess.feature.key,
    name: featureAccess.feature.name,
    description: featureAccess.feature.description,
    enabled: featureAccess.enabled,
    limit: featureAccess.limit
  }));

  for (const featureAccess of effectiveFeatureAccess) {
    if (!featureAccess.enabled || !isPlanLimitKey(featureAccess.feature.key)) {
      continue;
    }

    limits[featureAccess.feature.key] = featureAccess.limit;
  }

  return {
    tenantId: tenant.id,
    planKey,
    limits,
    features
  };
}

export async function hasTenantFeature(tenantSlug: string, featureKey: string) {
  const access = await getTenantPlanAccess(tenantSlug);

  return hasFeatureInAccess(access, featureKey);
}

export function hasFeatureInAccess(access: Pick<TenantPlanAccess, "planKey" | "features"> | null | undefined, featureKey: string) {
  if (!access) {
    return false;
  }

  const explicitFeature = access.features.find((feature) => feature.key === featureKey);

  if (explicitFeature) {
    return explicitFeature.enabled;
  }

  return Boolean(defaultPlanFeatures[access.planKey]?.[featureKey as FeatureKey]);
}

export async function assertPhotoUploadLimits(tenantSlug: string, categoryId: string) {
  const access = await getTenantPlanAccess(tenantSlug);

  if (!access) {
    throw new Error("Tenant not found.");
  }

  const [totalPhotos, categoryPhotos] = await Promise.all([
    prisma.photo.count({ where: { tenantId: access.tenantId } }),
    prisma.photo.count({ where: { tenantId: access.tenantId, categoryId } })
  ]);

  assertCanCreateWithinLimit(totalPhotos, access.limits[planLimitKeys.photosTotal], "overall photo");
  assertCanCreateWithinLimit(categoryPhotos, access.limits[planLimitKeys.photosPerCategory], "category photo");
}

export async function assertPhotoCategoryLimit(
  tenantSlug: string,
  categoryId: string,
  currentPhotoId?: string,
) {
  const access = await getTenantPlanAccess(tenantSlug);
  if (!access) throw new Error("Tenant not found.");
  const categoryPhotos = await prisma.photo.count({
    where: {
      tenantId: access.tenantId,
      categoryId,
      ...(currentPhotoId ? { id: { not: currentPhotoId } } : {}),
    },
  });
  assertCanCreateWithinLimit(
    categoryPhotos,
    access.limits[planLimitKeys.photosPerCategory],
    "category photo",
  );
}

export async function assertGalleryCreateLimit(tenantSlug: string) {
  const access = await getTenantPlanAccess(tenantSlug);

  if (!access) {
    throw new Error("Tenant not found.");
  }

  const galleryCount = await prisma.album.count({
    where: {
      tenantId: access.tenantId
    }
  });

  assertCanCreateWithinLimit(galleryCount, access.limits[planLimitKeys.galleriesTotal], "gallery");
}

export async function assertGalleryPhotoLimit(tenantSlug: string, albumId: string, currentPhotoId?: string) {
  const access = await getTenantPlanAccess(tenantSlug);

  if (!access) {
    throw new Error("Tenant not found.");
  }

  const galleryPhotoCount = await prisma.photo.count({
    where: {
      tenantId: access.tenantId,
      albumId,
      ...(currentPhotoId
        ? {
            id: {
              not: currentPhotoId
            }
          }
        : {})
    }
  });

  assertCanCreateWithinLimit(galleryPhotoCount, access.limits[planLimitKeys.photosPerGallery], "gallery photo");
}

export async function assertCategoryRequestLimit(tenantSlug: string) {
  const access = await getTenantPlanAccess(tenantSlug);

  if (!access) {
    throw new Error("Tenant not found.");
  }

  const limit = access.limits[planLimitKeys.categoryRequestsTotal];

  if (limit === 0) {
    throw new Error("Custom category requests are available on paid plans.");
  }

  if (limit == null) {
    return;
  }

  const submittedRequests = await prisma.platformCategoryRequest.count({
    where: {
      tenantId: access.tenantId
    }
  });

  assertCanCreateWithinLimit(submittedRequests, limit, "category request");
}

export async function assertCategoryLinkLimit(tenantSlug: string, platformSlug: string) {
  const access = await getTenantPlanAccess(tenantSlug);

  if (!access) {
    throw new Error("Tenant not found.");
  }

  const platformType = await prisma.platformPhotographyType.findUnique({
    where: {
      slug: platformSlug
    },
    include: {
      parent: true,
      children: {
        where: {
          enabled: true
        },
        select: {
          slug: true
        }
      }
    }
  });

  if (!platformType || !platformType.enabled) {
    throw new Error("Category is not available.");
  }

  const parentSlug = platformType.parent?.slug ?? platformType.slug;
  const [parentCategoryCount, existingParent, existingChildren] = await Promise.all([
    prisma.category.count({
      where: {
        tenantId: access.tenantId,
        parentId: null
      }
    }),
    prisma.category.findUnique({
      where: {
        tenantId_slug: {
          tenantId: access.tenantId,
          slug: parentSlug
        }
      },
      select: {
        id: true
      }
    }),
    prisma.category.findMany({
      where: {
        tenantId: access.tenantId,
        parent: {
          slug: parentSlug
        }
      },
      select: {
        slug: true
      }
    })
  ]);

  assertResultingCountWithinLimit(
    parentCategoryCount + (existingParent ? 0 : 1),
    access.limits[planLimitKeys.categoriesTotal],
    "category"
  );

  const existingChildSlugs = new Set(existingChildren.map((child) => child.slug));
  const childSlugsToAdd = platformType.parent ? [platformType.slug] : platformType.children.map((child) => child.slug);
  const missingChildCount = childSlugsToAdd.filter((slug) => !existingChildSlugs.has(slug)).length;

  assertResultingCountWithinLimit(
    existingChildren.length + missingChildCount,
    access.limits[planLimitKeys.subcategoriesPerCategory],
    "subcategory"
  );
}

export async function assertBlogCreateLimit(tenantSlug: string) {
  const access = await getTenantPlanAccess(tenantSlug);

  if (!access) {
    throw new Error("Tenant not found.");
  }

  if (!hasFeatureInAccess(access, "blogs")) {
    throw new Error("Blogs are not available on the current plan.");
  }

  const blogCount = await prisma.blogPost.count({
    where: {
      tenantId: access.tenantId
    }
  });

  assertCanCreateWithinLimit(blogCount, access.limits[planLimitKeys.blogsTotal], "blog post");
}

function isPlanLimitKey(value: string): value is PlanLimitKey {
  return Object.values(planLimitKeys).includes(value as PlanLimitKey);
}
