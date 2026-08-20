import {
  CustomerDashboardHeader,
  CustomerDashboardPage,
} from "@/components/customer/customer-dashboard-ui";
import { ThemePreviewStudio } from "@/components/themes/theme-preview-studio";
import { isLocale, type AppLocale } from "@/i18n/locales";
import {
  getAccessibleThemeKeys,
  themeKeys,
  type ThemeKey,
} from "@/config/themes";
import { getPlatformAppConfig } from "@/services/admin/admin-data";
import {
  getTenantPlanAccess,
  planLimitKeys,
} from "@/services/subscription/plan-limits";
import { getCustomerDashboardView } from "@/services/tenant/customer-dashboard-data";
import { getPlatformThemes } from "@/services/platform/platform-data";

type CustomerThemePageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function CustomerThemePage({
  params,
}: CustomerThemePageProps) {
  const { locale: localeParam, slug } = await params;
  const locale: AppLocale = isLocale(localeParam) ? localeParam : "en";
  const [tenant, appConfig, planAccess, enabledPlatformThemes] =
    await Promise.all([
      getCustomerDashboardView(slug),
      getPlatformAppConfig(),
      getTenantPlanAccess(slug),
      getPlatformThemes({ enabledOnly: true }),
    ]);
  const planKey = planAccess?.planKey ?? tenant?.planKey ?? "free";
  const accessibleThemeKeys = getAccessibleThemeKeys(
    planKey,
    planAccess?.limits[planLimitKeys.premiumThemesLimit],
  );
  const enabledThemeKeys = enabledPlatformThemes
    .map((theme) => theme.slug)
    .filter((slug): slug is ThemeKey => themeKeys.includes(slug as ThemeKey));

  return (
    <CustomerDashboardPage>
      <CustomerDashboardHeader
        eyebrow="Theme Studio"
        title="Choose your portfolio theme."
        body="View each theme with polished demo content, then apply the layout that fits your photography site."
      />
      <ThemePreviewStudio
        tenantSlug={slug}
        currentThemeKey={tenant?.themeKey}
        accessibleThemeKeys={accessibleThemeKeys}
        enabledThemeKeys={enabledThemeKeys}
        locale={locale}
        themeChangedAt={tenant?.themeChangedAt ?? null}
        cooldownDays={appConfig.themeSwitchCooldownDays}
      />
    </CustomerDashboardPage>
  );
}
