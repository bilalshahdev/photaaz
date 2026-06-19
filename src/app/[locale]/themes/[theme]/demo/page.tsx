import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/json-ld";
import { CustomerSiteExperience } from "@/components/customer/customer-site-experience";
import { customerDemos } from "@/data/customer-demos";
import { getRequestLocale } from "@/i18n/server";
import { createMetadata, absoluteUrl } from "@/lib/seo";
import { getPlatformTheme, getPlatformThemes } from "@/services/platform/platform-data";

export const revalidate = 300;

type ThemeDemoPageProps = {
  params: Promise<{ theme: string }>;
};

export async function generateStaticParams() {
  const themes = await getPlatformThemes({ enabledOnly: true });

  return themes.map((theme) => ({ theme: theme.slug }));
}

export async function generateMetadata({ params }: ThemeDemoPageProps): Promise<Metadata> {
  const { theme } = await params;
  const selectedTheme = await getPlatformTheme(theme);

  if (!selectedTheme) {
    return createMetadata({
      title: "Demo Not Found - PhotoFolio",
      description: "The requested PhotoFolio demo could not be found.",
      path: `/themes/${theme}/demo`,
      noIndex: true
    });
  }

  const demo = customerDemos[`${selectedTheme.slug}-demo`] ?? customerDemos.demo;

  return createMetadata({
    title: `${selectedTheme.name} Theme Live Demo - PhotoFolio`,
    description: demo.tagline,
    path: `/themes/${selectedTheme.slug}/demo`,
    image: demo.heroImage
  });
}

export default async function ThemeDemoPage({ params }: ThemeDemoPageProps) {
  const { theme } = await params;
  const [selectedTheme, locale] = await Promise.all([getPlatformTheme(theme), getRequestLocale()]);

  if (!selectedTheme) {
    notFound();
  }

  const demoSlug = `${selectedTheme.slug}-demo`;
  const demo = customerDemos[demoSlug] ?? customerDemos.demo;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: demo.studioName,
          url: absoluteUrl(`/themes/${selectedTheme.slug}/demo`),
          description: demo.tagline,
          image: demo.heroImage
        }}
      />
      <CustomerSiteExperience slug={demoSlug} locale={locale} demo={demo} />
    </>
  );
}
