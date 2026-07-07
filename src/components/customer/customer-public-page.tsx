import Image from "next/image";
import { type ReactNode } from "react";
import { ImageWatermark } from "@/components/customer/image-watermark";
import { CustomerSiteFooter } from "@/components/customer/customer-site-footer";
import { CustomerSiteNav } from "@/components/layout/customer-site-nav";
import { ScrollToTop } from "@/components/marketing/scroll-to-top";
import { resolveCustomerSiteThemeVariant, type CustomerSiteThemeVariant } from "@/lib/customer-theme";
import { type AppLocale } from "@/i18n/locales";
import { cn } from "@/lib/utils";
import { type CustomerSiteView } from "@/services/tenant/customer-site-data";

type CustomerPublicPageProps = {
  slug: string;
  locale: AppLocale;
  site: CustomerSiteView;
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
  heroImageAlt?: string;
  pageKey?: keyof NonNullable<CustomerSiteView["pageHeaders"]>;
};

type CustomerSectionHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  dark?: boolean;
};

export function isDarkCustomerVariant(variant: CustomerSiteThemeVariant) {
  return variant === "cinematic" || variant === "luxury" || variant === "monochrome";
}

export function customerPublicSurface(variant: CustomerSiteThemeVariant) {
  if (isDarkCustomerVariant(variant)) {
    return {
      main: "min-h-screen bg-[#080808] text-white",
      section: "mx-auto max-w-6xl px-5 py-12 sm:px-8 lg:px-10",
      border: "border-white/10",
      muted: "text-white/60",
      card: "border-white/10 bg-white/[0.06]",
      accent: variant === "luxury" ? "text-[#d8bf88]" : "text-teal-300"
    };
  }

  if (variant === "editorial") {
    return {
      main: "min-h-screen bg-[#f8f1e8] text-[#211917]",
      section: "mx-auto max-w-6xl px-5 py-12 sm:px-8 lg:px-10",
      border: "border-[#ddcdbf]",
      muted: "text-[#655b53]",
      card: "border-[#ddcdbf] bg-[#fffaf2]",
      accent: "text-[#9a4f32]"
    };
  }

  return {
    main: "min-h-screen bg-[#f7f2ea] text-[#15120f]",
    section: "mx-auto max-w-6xl px-5 py-12 sm:px-8 lg:px-10",
    border: "border-[#d7dedb]",
    muted: "text-[#59636b]",
    card: "border-[#d7dedb] bg-white",
    accent: "text-teal-700"
  };
}

export function CustomerSectionHeader({ eyebrow, title, description, dark = false }: CustomerSectionHeaderProps) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 border-b border-current/10 pb-5 sm:flex-row sm:items-end">
      <div>
        <p className={cn("font-nav text-xs font-semibold uppercase tracking-[0.26em]", dark ? "text-white/50" : "text-teal-700")}>{eyebrow}</p>
        <h2 className="mt-2 font-display text-4xl font-light tracking-[-0.05em] break-words">{title}</h2>
      </div>
      {description ? <p className={cn("max-w-md text-sm leading-6", dark ? "text-white/60" : "text-[#59636b]")}>{description}</p> : null}
    </div>
  );
}

export function CustomerPublicPage({ slug, locale, site, eyebrow, title, description, children, heroImageAlt, pageKey }: CustomerPublicPageProps) {
  const variant = (site.themeKey as CustomerSiteThemeVariant | undefined) ?? resolveCustomerSiteThemeVariant(slug);
  const surface = customerPublicSurface(variant);
  const pageHeader = pageKey ? site.pageHeaders?.[pageKey] : null;
  const headerImage = pageHeader?.image || (!pageKey ? site.heroImage : "");
  const headerTitle = title;
  const headerDescription = pageHeader?.description || description;

  return (
    <main className={cn(surface.main, variant === "masonry" && "lg:pl-[260px]")}>
      <section className={cn("relative min-h-[42vh] overflow-hidden text-white", headerImage ? "bg-[#15120f]" : solidHeaderClass(variant))}>
        <CustomerSiteNav slug={slug} locale={locale} name={site.studioName} variant={variant} />
        {headerImage ? (
          <>
            <Image src={headerImage} alt={heroImageAlt ?? `${site.studioName} cover`} fill priority className={cn(variant === "panorama" ? "pf-panorama-drift" : "pf-hero-drift", "object-cover opacity-58")} />
            <ImageWatermark watermark={site.imageWatermark} className="bottom-5" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,10,10,0.86),rgba(10,10,10,0.34))]" />
          </>
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(45,212,191,0.16),transparent_35%),linear-gradient(90deg,rgba(10,10,10,0.82),rgba(10,10,10,0.18))]" />
        )}
        <div className="relative mx-auto flex min-h-[42vh] max-w-6xl items-end px-5 pb-10 pt-24 sm:px-8 lg:px-10">
          <div className="pf-reveal max-w-4xl">
            <p className="font-nav text-xs font-semibold uppercase tracking-[0.28em] text-white/70">{eyebrow}</p>
            <h1 className="pf-fluid-title-page mt-4 font-display font-light leading-none tracking-[-0.05em] sm:text-7xl">{headerTitle}</h1>
            {headerDescription ? <p className="mt-5 max-w-2xl text-base leading-7 text-white/70 sm:text-lg sm:leading-8">{headerDescription}</p> : null}
          </div>
        </div>
      </section>

      {children}
      {site.sections?.footer !== false ? <CustomerSiteFooter slug={slug} locale={locale} site={site} variant={variant} /> : null}
      <ScrollToTop />
    </main>
  );
}

function solidHeaderClass(variant: CustomerSiteThemeVariant) {
  if (variant === "luxury") {
    return "bg-[#251d15]";
  }

  if (variant === "editorial") {
    return "bg-[#6f3c2d]";
  }

  if (variant === "monochrome" || variant === "cinematic") {
    return "bg-[#050505]";
  }

  return "bg-[#0f312c]";
}
