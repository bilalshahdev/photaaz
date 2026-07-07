import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/json-ld";
import { CustomerSiteExperience } from "@/components/customer/customer-site-experience";
import { customerDemos } from "@/data/customer-demos";
import { resolveLocalizedString } from "@/i18n/locales";
import { getRequestLocale } from "@/i18n/server";
import { breadcrumbJsonLd, createMetadata, getLocalizedSeoUrl } from "@/lib/seo";
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
  const [selectedTheme, locale] = await Promise.all([getPlatformTheme(theme), getRequestLocale()]);

  if (!selectedTheme) {
    return createMetadata({
      title: "Demo Not Found - Photaaz",
      description: "The requested Photaaz demo could not be found.",
      path: `/themes/${theme}/demo`,
      locale,
      noIndex: true
    });
  }

  const demo = customerDemos[`${selectedTheme.slug}-demo`] ?? customerDemos.demo;

  return createMetadata({
    title: `${resolveLocalizedString(selectedTheme.name, locale)} Theme Live Demo - Photaaz`,
    description: demo.tagline,
    path: `/themes/${selectedTheme.slug}/demo`,
    locale,
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
        data={[
          breadcrumbJsonLd(
            [
              { name: "Home", href: "/" },
              { name: "Themes", href: "/themes" },
              { name: resolveLocalizedString(selectedTheme.name, locale), href: `/themes/${selectedTheme.slug}` },
              { name: "Live demo", href: `/themes/${selectedTheme.slug}/demo` }
            ],
            locale
          ),
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: demo.studioName,
            url: getLocalizedSeoUrl(`/themes/${selectedTheme.slug}/demo`, locale),
            description: demo.tagline,
            image: demo.heroImage,
            inLanguage: locale
          }
        ]}
      />
      <CustomerSiteExperience slug={demoSlug} locale={locale} demo={demo} />
    </>
  );
}
