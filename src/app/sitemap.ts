import type { MetadataRoute } from "next";
import { env } from "@/lib/env";
import { getPlatformThemes } from "@/services/platform/platform-data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const themes = await getPlatformThemes({ enabledOnly: true });
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: env.NEXT_PUBLIC_APP_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1
    },
    {
      url: `${env.NEXT_PUBLIC_APP_URL}/get-started`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8
    },
    {
      url: `${env.NEXT_PUBLIC_APP_URL}/themes`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8
    }
  ];

  const themeRoutes: MetadataRoute.Sitemap = themes.flatMap((theme) => [
    {
      url: `${env.NEXT_PUBLIC_APP_URL}/themes/${theme.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.75
    },
    {
      url: `${env.NEXT_PUBLIC_APP_URL}/themes/${theme.slug}/demo`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7
    }
  ]);

  return [...staticRoutes, ...themeRoutes];
}
