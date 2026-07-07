import { LandingPage } from "@/components/marketing/landing-page";
import { resolveLocalizedString, resolveLocalizedStringList } from "@/i18n/locales";
import { getRequestLocale } from "@/i18n/server";
import { createMetadata } from "@/lib/seo";
import { getPlatformAppConfig } from "@/services/admin/admin-data";
import { getPlatformLandingSettings } from "@/services/platform/platform-data";

export const revalidate = 300;

export async function generateMetadata() {
  const [settings, appConfig, locale] = await Promise.all([getPlatformLandingSettings(), getPlatformAppConfig(), getRequestLocale()]);

  return createMetadata({
    title: resolveLocalizedString(settings.seo.title, locale),
    description: resolveLocalizedString(settings.seo.description, locale),
    path: "/",
    locale,
    keywords: [...resolveLocalizedStringList(settings.seo.keywords, locale), ...resolveLocalizedStringList(appConfig.seoKeywords, locale)]
  });
}

export default async function HomePage() {
  const locale = await getRequestLocale();

  return <LandingPage locale={locale} />;
}
