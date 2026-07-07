import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/admin/*",
        "/api",
        "/api/*",
        "/sign-in",
        "/sign-up",
        "/*/sign-in",
        "/*/sign-up",
        "/*/dashboard",
        "/*/dashboard/*",
        "/*/site/*/dashboard",
        "/*/site/*/dashboard/*"
      ]
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL
  };
}
