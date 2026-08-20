import { notFound } from "next/navigation";
import { CustomerGalleryBrowser } from "@/components/customer/customer-gallery-browser";
import { CustomerPublicPage } from "@/components/customer/customer-public-page";
import { customerDemos } from "@/data/customer-demos";
import { isLocale, type AppLocale } from "@/i18n/locales";
import { resolveCustomerSiteThemeVariant } from "@/lib/customer-theme";
import { resolveNewThemeKey } from "@/lib/new-themes";
import {
  getCustomerSiteView,
  type CustomerSiteView,
} from "@/services/tenant/customer-site-data";

export const revalidate = 300;

type CustomerGalleryPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function CustomerGalleryPage({
  params,
}: CustomerGalleryPageProps) {
  const { locale: rawLocale, slug } = await params;
  const locale: AppLocale = isLocale(rawLocale) ? rawLocale : "en";
  const site = ((await getCustomerSiteView(slug)) ?? customerDemos[slug]) as
    | CustomerSiteView
    | undefined;

  if (!site) {
    notFound();
  }

  const variant = resolveCustomerSiteThemeVariant(site.themeKey ?? slug);
  const isDemo = site.isDemo ?? !site.photos;

  return (
    <CustomerPublicPage
      slug={slug}
      locale={locale}
      site={site}
      eyebrow="Portfolio galleries"
      title="Galleries"
      description={`Curated albums from ${site.studioName}, arranged as complete visual stories.`}
      heroImageAlt={`${site.studioName} gallery cover`}
      pageKey="gallery"
    >
      <CustomerGalleryBrowser
        slug={slug}
        galleries={site.galleries}
        variant={variant}
        imageWatermark={site.imageWatermark}
        isDemo={isDemo}
        presentation={
          site.themeKey === "velvet"
            ? "velvet"
            : resolveNewThemeKey(site.themeKey, slug)
        }
      />
    </CustomerPublicPage>
  );
}
