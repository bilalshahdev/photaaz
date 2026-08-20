import { notFound } from "next/navigation";
import Image from "next/image";
import {
  AtSign,
  BadgeCheck,
  Camera,
  MapPin,
  Phone,
  Sparkles,
} from "lucide-react";
import {
  CustomerPublicPage,
  customerPublicSurface,
  isDarkCustomerVariant,
} from "@/components/customer/customer-public-page";
import { resolveCustomerSiteThemeVariant } from "@/lib/customer-theme";
import { customerDemos } from "@/data/customer-demos";
import { isLocale, type AppLocale } from "@/i18n/locales";
import { cn } from "@/lib/utils";
import {
  getCustomerSiteView,
  type CustomerSiteView,
} from "@/services/tenant/customer-site-data";

export const revalidate = 300;

type CustomerAboutPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function CustomerAboutPage({
  params,
}: CustomerAboutPageProps) {
  const { locale: rawLocale, slug } = await params;
  const locale: AppLocale = isLocale(rawLocale) ? rawLocale : "en";
  const site = ((await getCustomerSiteView(slug)) ?? customerDemos[slug]) as
    | CustomerSiteView
    | undefined;

  if (!site) {
    notFound();
  }

  const variant = resolveCustomerSiteThemeVariant(site.themeKey ?? slug);
  const surface = customerPublicSurface(variant);
  const isDark = isDarkCustomerVariant(variant);
  const profile = site.ownerProfile;
  const profileName = profile?.displayName || site.studioName;
  const profileHeadline =
    profile?.headline || `The photographer behind ${site.studioName}.`;
  const profileBio =
    profile?.bio ||
    `${site.studioName} creates carefully curated photography stories with a clean portfolio experience for visitors to explore.`;
  const contactItems = [
    profile?.email ? { label: profile.email, icon: AtSign } : null,
    profile?.phone ? { label: profile.phone, icon: Phone } : null,
    profile?.location || site.location
      ? { label: profile?.location || site.location, icon: MapPin }
      : null,
  ].filter((item): item is { label: string; icon: typeof AtSign } =>
    Boolean(item),
  );
  const specialties = buildSpecialtyList(site);
  const hasProfileImage = Boolean(profile?.avatarUrl);
  const isVelvet = site.themeKey === "velvet";

  return (
    <CustomerPublicPage
      slug={slug}
      locale={locale}
      site={site}
      eyebrow="About"
      title={site.studioName}
      description={site.tagline}
      heroImageAlt={`${site.studioName} about cover`}
      pageKey="about"
    >
      <section
        className={cn(
          surface.section,
          "grid gap-8 lg:items-start",
          isVelvet && "max-w-none bg-[#101010] px-5 text-white sm:px-8 lg:px-12",
          hasProfileImage && "lg:grid-cols-[0.72fr_1.28fr]",
        )}
      >
        {hasProfileImage ? (
          <aside
            className={cn(
              "overflow-hidden border",
              isVelvet ? "border-white/15 bg-[#151515]" : cn(surface.card, surface.border),
            )}
          >
            <Image
              src={profile?.avatarUrl ?? ""}
              alt={`${profileName} profile portrait`}
              width={900}
              height={1080}
              className="aspect-[4/5] w-full object-cover"
            />
          </aside>
        ) : null}

        <div>
          <p
            className={cn(
              "font-nav text-xs font-semibold uppercase tracking-[0.28em]",
              isVelvet ? "text-[#ef5559]" : surface.accent,
            )}
          >
            {site.specialty}
          </p>
          <h2 className="mt-4 max-w-3xl font-display text-4xl font-light tracking-[-0.05em] sm:text-5xl">
            {profileHeadline}
          </h2>
          <p
            className={cn(
              "mt-6 max-w-3xl whitespace-pre-line text-base leading-8 sm:text-lg",
              isDark ? "text-white/62" : "text-[#59636b]",
            )}
          >
            {profileBio}
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <InfoBlock
              icon={Camera}
              label="Photographer type"
              value={site.specialty}
              surface={surface}
              isDark={isDark}
            />
            <InfoBlock
              icon={Sparkles}
              label="Most photographed"
              value={
                specialties.slice(0, 2).join(" / ") || "Selected photography"
              }
              surface={surface}
              isDark={isDark}
            />
          </div>

          {specialties.length ? (
            <div className="mt-8">
              <p
                className={cn(
                  "font-nav text-xs font-semibold uppercase tracking-[0.24em]",
                  surface.accent,
                )}
              >
                Domains and specialties
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {specialties.map((specialty) => (
                  <span
                    key={specialty}
                    className={cn(
                      "inline-flex items-center gap-2 border px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em]",
                      surface.card,
                      surface.border,
                    )}
                  >
                    <BadgeCheck
                      className={cn("size-3.5", surface.accent)}
                      aria-hidden="true"
                    />
                    {specialty}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {contactItems.length ? (
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {contactItems.map((item) => (
                <div
                  key={item.label}
                  className={cn(
                    "flex items-center gap-3 border p-4",
                    surface.card,
                    surface.border,
                  )}
                >
                  <span
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center border",
                      surface.border,
                    )}
                  >
                    <item.icon
                      className={cn("size-4", surface.accent)}
                      aria-hidden="true"
                    />
                  </span>
                  <span
                    className={cn(
                      "min-w-0 break-words text-sm font-medium",
                      isDark ? "text-white/72" : "text-[#39434a]",
                    )}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </CustomerPublicPage>
  );
}

type AboutSurface = ReturnType<typeof customerPublicSurface>;

function InfoBlock({
  icon: Icon,
  label,
  value,
  surface,
  isDark,
}: {
  icon: typeof Camera;
  label: string;
  value: string;
  surface: AboutSurface;
  isDark: boolean;
}) {
  return (
    <div className={cn("border p-4", surface.card, surface.border)}>
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "flex size-10 shrink-0 items-center justify-center border",
            surface.border,
          )}
        >
          <Icon className={cn("size-4", surface.accent)} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p
            className={cn(
              "font-nav text-[0.68rem] font-semibold uppercase tracking-[0.22em]",
              isDark ? "text-white/45" : "text-[#7b8790]",
            )}
          >
            {label}
          </p>
          <p className="mt-1 break-words text-sm font-semibold">{value}</p>
        </div>
      </div>
    </div>
  );
}

function buildSpecialtyList(site: CustomerSiteView) {
  const values = [
    ...String(site.specialty || "")
      .split(/[,&/]+/)
      .map((item) => item.trim()),
    ...(site.categories ?? []).map((category) => category.name),
    ...(site.categories ?? []).flatMap((category) =>
      category.subcategories.map((subcategory) => subcategory.name),
    ),
    ...site.galleries.map((gallery) => gallery.location),
  ];

  return Array.from(new Set(values.filter(Boolean))).slice(0, 8);
}
