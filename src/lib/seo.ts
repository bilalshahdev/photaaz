import type { Metadata } from "next";
import { defaultLocale, locales, localizePath, resolveLocalizedString, type AppLocale } from "@/i18n/locales";
import { env } from "@/lib/env";
import type { PlatformAppConfig } from "@/services/admin/admin-data";
import type { LocalizedString, PlatformPricingPlanView } from "@/services/platform/platform-data";

export const SITE_URL = env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
export const DEFAULT_SITE_NAME = "Photaaz";
export const DEFAULT_TITLE = "Photaaz - Professional Photography Websites in Minutes";
export const DEFAULT_DESCRIPTION =
  "Create a professional photography website in minutes. Pick a design, upload photos, and publish a polished portfolio with themes, galleries, blogs, and a custom domain.";
export const DEFAULT_OG_IMAGE = "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=90";

type SeoInput = {
  title?: string;
  description?: string;
  keywords?: string[];
  path?: string;
  locale?: AppLocale;
  image?: string;
  siteName?: string;
  faviconUrl?: string;
  appleTouchIconUrl?: string;
  type?: "website" | "article";
  noIndex?: boolean;
  ogTitle?: string;
  ogDescription?: string;
  canonicalUrl?: string;
};

type ThemeJsonLdInput = {
  name: LocalizedString;
  slug: string;
  description: LocalizedString;
  image: string;
  features: LocalizedString[];
};

const GEO_POSITION = "33.6844;73.0479";
const GEO_COORDINATES = "33.6844, 73.0479";

function normalizePath(path = "/") {
  return path.startsWith("/") ? path : `/${path}`;
}

export function absoluteUrl(path = "/") {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return new URL(normalizePath(path), SITE_URL).toString();
}

export function getLocalizedSeoPath(path = "/", locale: AppLocale = defaultLocale) {
  return localizePath(locale, normalizePath(path)).toString();
}

export function getLocalizedSeoUrl(path = "/", locale: AppLocale = defaultLocale) {
  return absoluteUrl(getLocalizedSeoPath(path, locale));
}

export function getSeoImageUrl(image?: string) {
  if (!image) return DEFAULT_OG_IMAGE;
  return absoluteUrl(image);
}

export function getEnabledSocialUrls(config?: PlatformAppConfig) {
  if (!config) return [];

  return Object.values(config.socialLinks)
    .filter((link) => link.enabled && link.href)
    .map((link) => link.href);
}

export function createMetadata({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  keywords = [],
  path = "/",
  locale = defaultLocale,
  image = DEFAULT_OG_IMAGE,
  siteName = DEFAULT_SITE_NAME,
  faviconUrl = "/favicon.ico",
  appleTouchIconUrl = "/apple-touch-icon.png",
  type = "website",
  noIndex = false,
  ogTitle,
  ogDescription,
  canonicalUrl
}: SeoInput = {}): Metadata {
  const normalizedPath = normalizePath(path);
  const canonical = canonicalUrl || getLocalizedSeoUrl(normalizedPath, locale);
  const imageUrl = getSeoImageUrl(image);
  const favicon = absoluteUrl(faviconUrl);
  const appleIcon = absoluteUrl(appleTouchIconUrl);
  const languageAlternates = Object.fromEntries(locales.map((item) => [item, getLocalizedSeoUrl(normalizedPath, item)]));

  return {
    metadataBase: new URL(SITE_URL),
    applicationName: siteName,
    title,
    description,
    keywords,
    authors: [{ name: siteName }],
    creator: siteName,
    publisher: siteName,
    category: "photography website platform",
    classification: "Photography SaaS",
    icons: {
      icon: favicon,
      shortcut: favicon,
      apple: appleIcon
    },
    alternates: {
      canonical,
      types: {
        "application/rss+xml": [{ url: "/feed.xml", title: `${siteName} Updates` }]
      },
      languages: {
        ...languageAlternates,
        "x-default": getLocalizedSeoUrl(normalizedPath, defaultLocale)
      }
    },
    openGraph: {
      title: ogTitle || title,
      description: ogDescription || description,
      url: canonical,
      siteName,
      locale,
      type,
      images: [
        {
          url: imageUrl,
          width: 1600,
          height: 900,
          alt: ogTitle || title
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle || title,
      description: ogDescription || description,
      images: [imageUrl]
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          googleBot: {
            index: false,
            follow: false
          }
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1
          }
        },
    other: {
      "geo.region": "PK-IS",
      "geo.placename": "Islamabad, Pakistan",
      "geo.position": GEO_POSITION,
      ICBM: GEO_COORDINATES
    }
  };
}

export function organizationJsonLd(config?: PlatformAppConfig) {
  const name = config?.brandName || DEFAULT_SITE_NAME;
  const sameAs = getEnabledSocialUrls(config);

  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "ProfessionalService"],
    "@id": `${SITE_URL}/#organization`,
    name,
    url: absoluteUrl("/"),
    logo: absoluteUrl(config?.faviconUrl || "/favicon.svg"),
    image: getSeoImageUrl(config?.socialPreviewImageUrl),
    description: config?.footerText || DEFAULT_DESCRIPTION,
    email: config?.supportEmail,
    telephone: config?.phone.enabled ? config.phone.value : undefined,
    address: {
      "@type": "PostalAddress",
      streetAddress: config?.companyAddress || "Islamabad, Pakistan",
      addressLocality: "Islamabad",
      addressCountry: "PK"
    },
    areaServed: [
      { "@type": "Country", name: "Pakistan" },
      { "@type": "Place", name: "Worldwide" }
    ],
    founder: config?.creatorLink.enabled
      ? {
          "@type": "Person",
          name: config.creatorLink.label,
          url: config.creatorLink.href
        }
      : undefined,
    sameAs
  };
}

export function websiteJsonLd(config?: PlatformAppConfig) {
  const name = config?.brandName || DEFAULT_SITE_NAME;

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name,
    url: absoluteUrl("/"),
    description: config?.footerText || DEFAULT_DESCRIPTION,
    publisher: {
      "@id": `${SITE_URL}/#organization`
    },
    inLanguage: locales,
    potentialAction: {
      "@type": "SearchAction",
      target: `${absoluteUrl("/themes")}?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };
}

export function softwareApplicationJsonLd(config?: PlatformAppConfig, plans: PlatformPricingPlanView[] = []) {
  const enabledPrices = plans.filter((plan) => plan.enabled).map((plan) => resolveLocalizedString(plan.price, "en"));

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${SITE_URL}/#software`,
    name: config?.brandName || DEFAULT_SITE_NAME,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: absoluteUrl("/"),
    image: getSeoImageUrl(config?.socialPreviewImageUrl),
    description: config?.footerText || DEFAULT_DESCRIPTION,
    creator: {
      "@id": `${SITE_URL}/#organization`
    },
    offers: enabledPrices.length
      ? plans
          .filter((plan) => plan.enabled)
          .map((plan) => ({
            "@type": "Offer",
            name: resolveLocalizedString(plan.name, "en"),
            price: resolveLocalizedString(plan.price, "en").replace(/[^0-9.]/g, "") || "0",
            priceCurrency: "PKR",
            description: resolveLocalizedString(plan.description, "en"),
            availability: "https://schema.org/InStock"
          }))
      : {
          "@type": "Offer",
          price: "0",
          priceCurrency: "PKR"
        }
  };
}

export function faqJsonLd(items: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      }
    }))
  };
}

export function themeJsonLd(theme: ThemeJsonLdInput, locale: AppLocale = defaultLocale) {
  const name = resolveLocalizedString(theme.name, locale);
  const description = resolveLocalizedString(theme.description, locale);

  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: `${name} Photaaz Theme`,
    url: getLocalizedSeoUrl(`/themes/${theme.slug}`, locale),
    image: getSeoImageUrl(theme.image),
    description,
    inLanguage: locale,
    isAccessibleForFree: true,
    about: theme.features.map((feature) => resolveLocalizedString(feature, locale)),
    provider: {
      "@id": `${SITE_URL}/#organization`
    }
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; href: string }>, locale: AppLocale = defaultLocale) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: getLocalizedSeoUrl(item.href, locale)
    }))
  };
}
