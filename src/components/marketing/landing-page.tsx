import { LandingPageClient } from "@/components/marketing/landing-page-client";
import type { AppLocale } from "@/i18n/locales";
import { getMessages } from "@/i18n/locales";
import { getEnabledTranslationLocales, getPlatformAppConfig } from "@/services/admin/admin-data";
import { getPlatformAnnouncements, getPlatformLandingSettings, getPlatformPricingPlans, getPlatformThemes } from "@/services/platform/platform-data";

export async function LandingPage({ locale }: { locale: AppLocale }) {
  const [settings, themes, pricingPlans, announcements, enabledLocales, appConfig] = await Promise.all([
    getPlatformLandingSettings(),
    getPlatformThemes({ enabledOnly: true }),
    getPlatformPricingPlans({ enabledOnly: true }),
    getPlatformAnnouncements({ enabledOnly: true }),
    getEnabledTranslationLocales(),
    getPlatformAppConfig()
  ]);

  return (
    <LandingPageClient
      locale={locale}
      messages={getMessages(locale)}
      settings={settings}
      themes={themes}
      pricingPlans={pricingPlans}
      announcements={announcements}
      enabledLocales={enabledLocales}
      appConfig={appConfig}
    />
  );
}
