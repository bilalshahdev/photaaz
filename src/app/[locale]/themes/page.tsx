import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, CheckCircle2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarketingHeader } from "@/components/layout/marketing-header";
import { JsonLd } from "@/components/seo/json-ld";
import { getThemeIcon } from "@/components/themes/theme-icon";
import { themeDemoPath, themePath } from "@/config/routes";
import { localizePath } from "@/i18n/locales";
import { getRequestLocale } from "@/i18n/server";
import { createMetadata, themeJsonLd } from "@/lib/seo";
import { getEnabledTranslationLocales } from "@/services/admin/admin-data";
import { fallbackThemes, getPlatformThemes } from "@/services/platform/platform-data";

export const revalidate = 300;

export const metadata: Metadata = createMetadata({
  title: "Photography Website Themes - PhotoFolio",
  description: "Explore premium portfolio themes for photographers, including Minimal, Editorial, Cinematic, Masonry, and Luxury layouts.",
  path: "/themes",
  image: fallbackThemes[0]?.image
});

export default async function ThemesPage() {
  const [themes, enabledLocales, locale] = await Promise.all([
    getPlatformThemes({ enabledOnly: true }),
    getEnabledTranslationLocales(),
    getRequestLocale()
  ]);

  return (
    <main className="bg-[#f7f8f6] text-[#101418]">
      <JsonLd data={themes.map(themeJsonLd)} />
      <MarketingHeader locale={locale} variant="solid" enabledLocales={enabledLocales} />
      <section className="px-4 pb-20 pt-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-4xl">
            <p className="font-nav text-sm font-semibold uppercase tracking-[0.28em] text-teal-700">Themes</p>
            <h1 className="mt-4 font-display text-6xl font-light leading-none tracking-[-0.05em]">
              Five portfolio experiences, built as real layouts.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#59636b]">
              Choose a UI theme first. Your photography type, content, colors, and domain come after.
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {themes.map(({ name, slug, image, description, features, iconKey }) => {
              const Icon = getThemeIcon(iconKey);

              return (
              <article key={slug} className="group relative grid overflow-hidden border border-[#d7dedb]/80 bg-white shadow-[0_18px_55px_rgba(16,20,24,0.08)] transition-shadow duration-300 hover:shadow-[0_28px_80px_rgba(16,20,24,0.14)] md:grid-cols-[1.12fr_0.88fr]">
                <div className="relative m-3 min-h-[280px] overflow-hidden bg-[#101418] md:mr-0 md:min-h-[360px]">
                  <Image src={image} alt={`${name} theme`} fill className="object-cover transition duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-white/5" />
                </div>
                <div className="flex min-h-[360px] flex-col p-7">
                  <div className="flex items-center justify-between gap-4">
                    <span className="inline-flex size-10 items-center justify-center border border-[#d7dedb] bg-[#f7f8f6] text-teal-700">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <p className="font-nav text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-[#7a858c]">
                      UI theme
                    </p>
                  </div>
                  <h2 className="mt-8 font-display text-5xl font-light leading-none tracking-[-0.055em]">{name}</h2>
                  <p className="mt-3 text-sm leading-6 text-[#59636b]">{description}</p>
                  <ul className="mt-5 space-y-2 text-sm text-[#101418]">
                    {features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <CheckCircle2 className="size-4 shrink-0 text-teal-700" aria-hidden="true" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto grid gap-2 pt-7">
                    <Button asChild variant="outline" className="rounded-none border-[#d7dedb] bg-[#ffffff] font-nav text-xs font-semibold uppercase tracking-[0.18em] hover:border-[#101418]">
                      <Link href={localizePath(locale, themePath(slug))}>
                        Details
                        <ArrowRight className="size-4" aria-hidden="true" />
                      </Link>
                    </Button>
                    <Button asChild className="rounded-none bg-[#101418] font-nav text-xs font-semibold uppercase tracking-[0.18em] text-white hover:bg-teal-800">
                      <Link href={localizePath(locale, themeDemoPath(slug))}>
                        Live demo
                        <ExternalLink className="size-4" aria-hidden="true" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </article>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
