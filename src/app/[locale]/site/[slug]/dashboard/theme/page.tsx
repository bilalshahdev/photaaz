import {
  CustomerDashboardHeader,
  CustomerDashboardPage
} from "@/components/customer/customer-dashboard-ui";
import { ThemePreviewStudio } from "@/components/themes/theme-preview-studio";
import { isLocale, type AppLocale } from "@/i18n/locales";
import { getAccessibleThemeKeys } from "@/config/themes";
import { getPlatformAppConfig } from "@/services/admin/admin-data";
import { getTenantPlanAccess, planLimitKeys } from "@/services/subscription/plan-limits";
import { getCustomerDashboardView } from "@/services/tenant/customer-dashboard-data";

type CustomerThemePageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function CustomerThemePage({ params }: CustomerThemePageProps) {
  const { locale: localeParam, slug } = await params;
  const locale: AppLocale = isLocale(localeParam) ? localeParam : "en";
  const [tenant, appConfig, planAccess] = await Promise.all([
    getCustomerDashboardView(slug),
    getPlatformAppConfig(),
    getTenantPlanAccess(slug)
  ]);
  const planKey = planAccess?.planKey ?? tenant?.planKey ?? "free";
  const accessibleThemeKeys = getAccessibleThemeKeys(planKey, planAccess?.limits[planLimitKeys.premiumThemesLimit]);

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
        locale={locale}
        themeChangedAt={tenant?.themeChangedAt ?? null}
        cooldownDays={appConfig.themeSwitchCooldownDays}
      />
    </CustomerDashboardPage>
  );
}
