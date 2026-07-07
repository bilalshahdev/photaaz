import { revalidatePath, revalidateTag } from "next/cache";

export const cacheDurations = {
  platform: 300,
  tenantPublic: 300,
  tenantDashboard: 60
} as const;

export const cacheTags = {
  platform: "platform",
  platformLanding: "platform:landing",
  platformThemes: "platform:themes",
  platformPricing: "platform:pricing",
  platformAnnouncements: "platform:announcements",
  tenant: (slug: string) => `tenant:${slug}`,
  tenantPublic: (slug: string) => `tenant:${slug}:public`,
  tenantDashboard: (slug: string) => `tenant:${slug}:dashboard`,
  tenantGalleries: (slug: string) => `tenant:${slug}:galleries`
} as const;

export function revalidateTenantPublic(slug: string) {
  revalidateTag(cacheTags.tenant(slug), "max");
  revalidateTag(cacheTags.tenantPublic(slug), "max");
  revalidateTag(cacheTags.tenantGalleries(slug), "max");
  ["", "/gallery", "/categories", "/blog", "/about"].forEach((path) => {
    revalidatePath(`/site/${slug}${path}`);
    revalidatePath(`/ur/site/${slug}${path}`);
  });
}

export function revalidateTenantDashboard(slug: string) {
  revalidateTag(cacheTags.tenant(slug), "max");
  revalidateTag(cacheTags.tenantDashboard(slug), "max");
  revalidateTag(cacheTags.tenantGalleries(slug), "max");
  revalidatePath(`/site/${slug}/dashboard`);
  revalidatePath(`/site/${slug}/dashboard/galleries`);
}

export function revalidatePlatformMarketing() {
  revalidateTag(cacheTags.platform, "max");
  revalidateTag(cacheTags.platformLanding, "max");
  revalidateTag(cacheTags.platformThemes, "max");
  revalidateTag(cacheTags.platformPricing, "max");
  revalidateTag(cacheTags.platformAnnouncements, "max");
  revalidatePath("/");
  revalidatePath("/ur");
  revalidatePath("/themes");
  revalidatePath("/ur/themes");
}
