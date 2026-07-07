import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { resolveLocalizedStringList } from "@/i18n/locales";
import { createMetadata, organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { getPlatformAppConfig } from "@/services/admin/admin-data";

export async function generateMetadata(): Promise<Metadata> {
  const config = await getPlatformAppConfig();
  const googleVerify = process.env.GOOGLE_SITE_VERIFICATION;
  const bingVerify = process.env.BING_SITE_VERIFICATION;
  const verification =
    googleVerify || bingVerify
      ? {
          ...(googleVerify ? { google: googleVerify } : {}),
          ...(bingVerify ? { other: { "msvalidate.01": bingVerify } } : {})
        }
      : undefined;

  const metadata = createMetadata({
    title: `${config.brandName} - Professional Photography Websites in Minutes`,
    description: config.footerText,
    siteName: config.brandName,
    image: config.socialPreviewImageUrl,
    faviconUrl: config.faviconUrl,
    appleTouchIconUrl: config.appleTouchIconUrl,
    keywords: resolveLocalizedStringList(config.seoKeywords, "en")
  });

  return {
    ...metadata,
    ...(verification ? { verification } : {})
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f8f6" },
    { media: "(prefers-color-scheme: dark)", color: "#101418" }
  ]
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const config = await getPlatformAppConfig();

  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <Script
          id="ld-organization"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd(config)) }}
        />
        <Script
          id="ld-website"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd(config)) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
