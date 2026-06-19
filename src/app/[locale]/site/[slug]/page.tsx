import { CustomerSiteExperience } from "@/components/customer/customer-site-experience";
import { customerDemos } from "@/data/customer-demos";
import { isLocale, type AppLocale } from "@/i18n/locales";
import { getCustomerSiteView } from "@/services/tenant/customer-site-data";

export const revalidate = 300;

type CustomerSitePageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function CustomerSitePage({ params }: CustomerSitePageProps) {
  const { locale: rawLocale, slug } = await params;
  const locale: AppLocale = isLocale(rawLocale) ? rawLocale : "en";
  const tenantSite = await getCustomerSiteView(slug);
  const demo = tenantSite ?? customerDemos[slug] ?? {
    ...customerDemos.demo,
    studioName: `${slug.charAt(0).toUpperCase()}${slug.slice(1)} Studio`
  };

  return <CustomerSiteExperience slug={slug} locale={locale} demo={demo} />;
}
