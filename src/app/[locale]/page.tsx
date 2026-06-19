import { LandingPage } from "@/components/marketing/landing-page";
import { resolveLocalizedString } from "@/i18n/locales";
import { getRequestLocale } from "@/i18n/server";
import { createMetadata } from "@/lib/seo";
import { getPlatformLandingSettings } from "@/services/platform/platform-data";

export const revalidate = 300;

export async function generateMetadata() {
  const settings = await getPlatformLandingSettings();

  return createMetadata({
    title: resolveLocalizedString(settings.seo.title, "en"),
    description: resolveLocalizedString(settings.seo.description, "en"),
    path: "/"
  });
}

export default async function HomePage() {
  const locale = await getRequestLocale();

  return <LandingPage locale={locale} />;
}
