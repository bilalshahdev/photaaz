import type { Metadata } from "next";
import { env } from "@/lib/env";

const siteName = "PhotoFolio";
const defaultTitle = "PhotoFolio - Professional Photography Websites in Minutes";
const defaultDescription =
  "Create a professional photography website in minutes. Pick a design, upload photos, and publish a polished portfolio with themes, galleries, blogs, and custom domains.";
const defaultImage = "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=90";

type SeoInput = {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  noIndex?: boolean;
};

export function absoluteUrl(path = "/") {
  return new URL(path, env.NEXT_PUBLIC_APP_URL).toString();
}

export function createMetadata({ title = defaultTitle, description = defaultDescription, path = "/", image = defaultImage, type = "website", noIndex = false }: SeoInput = {}): Metadata {
  const url = absoluteUrl(path);
  const imageUrl = image.startsWith("http") ? image : absoluteUrl(image);

  return {
    metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
    title,
    description,
    alternates: {
      canonical: url
    },
    openGraph: {
      title,
      description,
      url,
      siteName,
      type,
      images: [
        {
          url: imageUrl,
          width: 1600,
          height: 900,
          alt: title
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
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
        }
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    url: absoluteUrl("/"),
    logo: absoluteUrl("/icon.png"),
    sameAs: []
  };
}

export function softwareApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: siteName,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: absoluteUrl("/"),
    description: defaultDescription,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD"
    }
  };
}

export function themeJsonLd(theme: { name: string; slug: string; description: string; image: string; features: string[] }) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: `${theme.name} PhotoFolio Theme`,
    url: absoluteUrl(`/themes/${theme.slug}`),
    image: theme.image,
    description: theme.description,
    about: theme.features
  };
}
