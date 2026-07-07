import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/json-ld";
import { onboardingPath, themeDemoPath, themesPath } from "@/config/routes";
import { localizePath, resolveLocalizedString } from "@/i18n/locales";
import { getRequestLocale } from "@/i18n/server";
import { breadcrumbJsonLd, createMetadata, themeJsonLd } from "@/lib/seo";
import { getPlatformTheme, getPlatformThemes } from "@/services/platform/platform-data";

export const revalidate = 300;

type ThemeDetailPageProps = {
  params: Promise<{ theme: string }>;
};

export async function generateStaticParams() {
  const themes = await getPlatformThemes({ enabledOnly: true });

  return themes.map((theme) => ({ theme: theme.slug }));
}

export async function generateMetadata({ params }: ThemeDetailPageProps): Promise<Metadata> {
  const { theme } = await params;
  const [selectedTheme, locale] = await Promise.all([getPlatformTheme(theme), getRequestLocale()]);

  if (!selectedTheme) {
    return createMetadata({
      title: "Theme Not Found - Photaaz",
      description: "The requested Photaaz theme could not be found.",
      path: `/themes/${theme}`,
      locale,
      noIndex: true
    });
  }

  const themeName = resolveLocalizedString(selectedTheme.name, locale);
  const themeDescription = resolveLocalizedString(selectedTheme.description, locale);

  return createMetadata({
    title: selectedTheme.seoTitle ? resolveLocalizedString(selectedTheme.seoTitle, locale) : `${themeName} Photography Website Theme - Photaaz`,
    description: selectedTheme.seoDescription ? resolveLocalizedString(selectedTheme.seoDescription, locale) : themeDescription,
    path: `/themes/${selectedTheme.slug}`,
    locale,
    image: selectedTheme.image
  });
}

export default async function ThemeDetailPage({ params }: ThemeDetailPageProps) {
  const { theme } = await params;
  const [selectedTheme, locale] = await Promise.all([getPlatformTheme(theme), getRequestLocale()]);

  if (!selectedTheme) {
    notFound();
  }

  const themeName = resolveLocalizedString(selectedTheme.name, locale);
  const themeDescription = resolveLocalizedString(selectedTheme.description, locale);
  const themeFeatures = selectedTheme.features.map((feature) => resolveLocalizedString(feature, locale));

  return (
    <main className="bg-[#f7f8f6] text-[#101418]">
      <JsonLd data={[breadcrumbJsonLd([{ name: "Home", href: "/" }, { name: "Themes", href: "/themes" }, { name: themeName, href: `/themes/${selectedTheme.slug}` }], locale), themeJsonLd(selectedTheme, locale)]} />
      <header className="sticky top-0 z-40 border-b border-[#d7dedb] bg-[#f7f8f6] shadow-[0_12px_40px_rgba(16,20,24,0.08)] sm:bg-[#f7f8f6]/94 sm:backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 md:grid md:h-[76px] md:grid-cols-[1fr_auto_1fr] lg:px-8">
          <Link href={localizePath(locale, themesPath())} className="inline-flex size-10 shrink-0 items-center justify-center font-nav text-xs font-semibold uppercase tracking-[0.22em] text-[#101418] transition hover:bg-[#101418]/6 hover:text-teal-700 md:h-auto md:w-fit md:justify-start md:gap-2 md:hover:bg-transparent">
            <ArrowLeft className="size-4" aria-hidden="true" />
            <span className="hidden md:inline">All themes</span>
          </Link>
          <Link href={localizePath(locale, "/")} className="focus-ring min-w-0 shrink-0 justify-self-center rounded-md text-[#101418]">
            <span className="font-brand text-2xl font-semibold leading-none tracking-[-0.04em] sm:text-3xl md:text-4xl">Photaaz</span>
          </Link>
          <nav className="flex shrink-0 items-center justify-end gap-1 sm:gap-2">
            <Button asChild variant="outline" size="sm" className="hidden h-10 rounded-none border-[#101418] bg-transparent px-4 font-nav text-xs font-semibold uppercase tracking-[0.18em] md:inline-flex">
              <Link href={localizePath(locale, themeDemoPath(selectedTheme.slug))}>
                Live demo
                <ExternalLink className="size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="sm" className="h-10 w-10 rounded-none bg-[#101418] px-0 font-nav text-xs font-semibold uppercase tracking-[0.18em] text-white hover:bg-teal-800 sm:w-auto sm:px-5">
              <Link href={localizePath(locale, onboardingPath())} aria-label="Start">
                <span className="hidden sm:inline">Start</span>
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </nav>
        </div>
      </header>
      <section className="px-4 pb-20 pt-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1fr] lg:items-end">
          <div>
            <p className="font-nav text-xs font-semibold uppercase tracking-[0.22em] text-teal-700">Theme detail</p>
            <h1 className="pf-fluid-title-page mt-4 font-display font-light leading-none tracking-[-0.055em]">
              {themeName}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-[#59636b]">{themeDescription}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-none bg-[#101418] px-6 font-nav text-xs font-semibold uppercase tracking-[0.22em] text-white hover:bg-[#101418]/90">
                <Link href={localizePath(locale, themeDemoPath(selectedTheme.slug))}>
                  Live demo
                  <ExternalLink className="size-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-none border-[#101418] bg-transparent px-6 font-nav text-xs font-semibold uppercase tracking-[0.22em]">
                <Link href={localizePath(locale, onboardingPath())}>
                  Start with this theme
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden border border-[#d7dedb] bg-white">
            <Image src={selectedTheme.image} alt={`${themeName} theme preview`} fill priority className="object-cover" />
          </div>
        </div>
      </section>

      <section className="border-y border-[#d7dedb] bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
          {themeFeatures.map((feature) => (
            <article key={feature} className="border border-[#d7dedb] bg-[#f7f8f6] p-6">
              <CheckCircle2 className="size-5 text-teal-700" aria-hidden="true" />
              <h2 className="mt-8 text-xl font-semibold">{feature}</h2>
              <p className="mt-3 text-sm leading-6 text-[#59636b]">
                Built into the theme so photographers can publish without assembling pages from scratch.
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
