import type { MetadataRoute } from "next";
import { resolveLocalizedString } from "@/i18n/locales";
import { getPlatformAppConfig } from "@/services/admin/admin-data";

function getIconType(src: string) {
  return src.toLowerCase().split("?")[0].endsWith(".ico") ? "image/x-icon" : "image/png";
}

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const config = await getPlatformAppConfig();
  const favicon = config.faviconUrl || "/favicon.svg";
  const appleIcon = config.appleTouchIconUrl || favicon;

  return {
    name: `${config.brandName} - Photography Portfolio Websites`,
    short_name: config.brandName,
    description: resolveLocalizedString(config.footerText, "en"),
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f7f8f6",
    theme_color: config.signatureColor,
    icons: [
      {
        src: favicon,
        sizes: "any",
        type: getIconType(favicon)
      },
      {
        src: appleIcon,
        sizes: "180x180",
        type: getIconType(appleIcon),
        purpose: "any"
      }
    ],
    categories: ["photography", "portfolio", "business", "productivity"]
  };
}
