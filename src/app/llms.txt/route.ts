import { resolveLocalizedString } from "@/i18n/locales";
import { SITE_URL } from "@/lib/seo";
import { getPlatformAppConfig } from "@/services/admin/admin-data";
import { getPlatformAnnouncements, getPlatformLandingSettings, getPlatformPricingPlans, getPlatformThemes } from "@/services/platform/platform-data";

export const revalidate = 3600;

export async function GET() {
  const [config, landing, themes, plans, announcements] = await Promise.all([
    getPlatformAppConfig(),
    getPlatformLandingSettings().catch(() => null),
    getPlatformThemes({ enabledOnly: true }).catch(() => []),
    getPlatformPricingPlans({ enabledOnly: true }).catch(() => []),
    getPlatformAnnouncements({ enabledOnly: true }).catch(() => [])
  ]);

  const lines: string[] = [
    `# ${config.brandName}`,
    "",
    `> ${landing ? resolveLocalizedString(landing.seo.description, "en") : config.footerText}`,
    "",
    `${config.brandName} helps photographers publish clean public portfolio websites with themes, galleries, blogs, contact flows, and a custom domain option.`,
    "",
    "## Key Pages",
    "",
    `- [Home](${SITE_URL}/): Product overview and onboarding`,
    `- [Themes](${SITE_URL}/themes): Available photography website themes`,
    `- [Get Started](${SITE_URL}/get-started): Portfolio setup flow`,
    "",
    "## Themes",
    ""
  ];

  for (const theme of themes.slice(0, 12)) {
    lines.push(`- [${resolveLocalizedString(theme.name, "en")}](${SITE_URL}/themes/${theme.slug}): ${resolveLocalizedString(theme.description, "en")}`);
  }

  if (plans.length) {
    lines.push("", "## Packages", "");
    for (const plan of plans) {
      lines.push(`- ${resolveLocalizedString(plan.name, "en")}: ${resolveLocalizedString(plan.price, "en")} - ${resolveLocalizedString(plan.description, "en")}`);
    }
  }

  if (announcements.length) {
    lines.push("", "## Current Announcements", "");
    for (const announcement of announcements.slice(0, 5)) {
      lines.push(`- ${resolveLocalizedString(announcement.title, "en")}: ${resolveLocalizedString(announcement.body, "en")}`);
    }
  }

  lines.push("", "## Contact", "", `- Email: ${config.supportEmail}`, `- Location: ${config.companyAddress}`);

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400"
    }
  });
}
