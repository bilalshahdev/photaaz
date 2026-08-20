import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Toaster } from "sonner";
import { Inter, Montserrat, Cormorant_Garamond, Raleway, Whisper, Playfair_Display, Poppins, Lato, Josefin_Sans, EB_Garamond } from "next/font/google";
import "./globals.css";
import { resolveLocalizedString, resolveLocalizedStringList } from "@/i18n/locales";
import { createMetadata, organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { getPlatformAppConfig } from "@/services/admin/admin-data";
import { brandFontVarMap } from "@/lib/brand-fonts";
import { hexToHsl } from "@/lib/utils";
import { CookieConsent } from "@/components/legal/cookie-consent";
import { getLocale } from "next-intl/server";
import { getTextDirection, isLocale } from "@/i18n/locales";

const pfInter = Inter({ subsets: ["latin"], variable: "--pf-font-inter" });
const pfMontserrat = Montserrat({ subsets: ["latin"], variable: "--pf-font-montserrat" });
const pfCormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"], variable: "--pf-font-cormorant" });
const pfRaleway = Raleway({ subsets: ["latin"], variable: "--pf-font-raleway" });
const pfWhisper = Whisper({ subsets: ["latin"], weight: "400", variable: "--pf-font-whisper" });
const pfPlayfair = Playfair_Display({ subsets: ["latin"], variable: "--pf-font-playfair" });
const pfPoppins = Poppins({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"], variable: "--pf-font-poppins" });
const pfLato = Lato({ subsets: ["latin"], weight: ["300", "400", "700"], variable: "--pf-font-lato" });
const pfJosefin = Josefin_Sans({ subsets: ["latin"], variable: "--pf-font-josefin" });
const pfGaramond = EB_Garamond({ subsets: ["latin"], variable: "--pf-font-garamond" });

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
    description: resolveLocalizedString(config.footerText, "en"),
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
  const [config, requestedLocale] = await Promise.all([getPlatformAppConfig(), getLocale()]);
  const locale = isLocale(requestedLocale) ? requestedLocale : "en";

  const fontClasses = `${pfInter.variable} ${pfMontserrat.variable} ${pfCormorant.variable} ${pfRaleway.variable} ${pfWhisper.variable} ${pfPlayfair.variable} ${pfPoppins.variable} ${pfLato.variable} ${pfJosefin.variable} ${pfGaramond.variable}`;
  const brandFontVar = brandFontVarMap[config.brandFont ?? "inter"];
  const sigHex = config.signatureColor ?? "#0f766e";
  const signatureHsl = hexToHsl(sigHex);
  const signatureLightHsl = hexToHsl(sigHex, 0.7);

  return (
    <html
      lang={locale}
      dir={getTextDirection(locale)}
      suppressHydrationWarning
      className={fontClasses}
      style={{
        "--font-brand": brandFontVar,
        "--signature-color": sigHex,
        "--primary": signatureHsl,
        "--primary-light": signatureLightHsl,
        "--ring": signatureHsl,
      } as React.CSSProperties}
    >
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
      <body>
        {children}
        <CookieConsent />
        <Toaster richColors closeButton position="top-right" />
      </body>
    </html>
  );
}
