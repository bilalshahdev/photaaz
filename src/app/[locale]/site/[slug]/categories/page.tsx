import { notFound } from "next/navigation";
import { CustomerCategoryBrowser } from "@/components/customer/customer-category-browser";
import { CustomerPublicPage } from "@/components/customer/customer-public-page";
import { resolveCustomerSiteThemeVariant } from "@/lib/customer-theme";
import { resolveNewThemeKey } from "@/lib/new-themes";
import { customerDemos } from "@/data/customer-demos";
import { customerGalleryTaxonomy } from "@/data/customer-gallery-taxonomy";
import { isLocale, type AppLocale } from "@/i18n/locales";
import {
  getCustomerSiteView,
  type CustomerSiteView,
} from "@/services/tenant/customer-site-data";

export const revalidate = 300;

type CustomerCategoriesPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function CustomerCategoriesPage({
  params,
}: CustomerCategoriesPageProps) {
  const { locale: rawLocale, slug } = await params;
  const locale: AppLocale = isLocale(rawLocale) ? rawLocale : "en";
  const site = ((await getCustomerSiteView(slug)) ?? customerDemos[slug]) as
    | CustomerSiteView
    | undefined;

  if (!site) {
    notFound();
  }

  const variant = resolveCustomerSiteThemeVariant(site.themeKey ?? slug);
  const isDemo = site.isDemo ?? !site.categories;
  const categories = site.categories?.length
    ? site.categories
    : isDemo
      ? customerGalleryTaxonomy[variant]
      : [];

  return (
    <CustomerPublicPage
      slug={slug}
      locale={locale}
      site={site}
      eyebrow="Photo categories"
      title="Categories"
      description="Browse photos by category and subcategory, then open any image in the full-screen viewer."
      heroImageAlt={`${site.studioName} categories cover`}
      pageKey="categories"
    >
      <CustomerCategoryBrowser
        slug={slug}
        galleries={site.galleries}
        categories={categories}
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
