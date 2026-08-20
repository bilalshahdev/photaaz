import Link from "next/link";
import { Facebook, Images, Instagram, Linkedin, Mail, MapPin, MessageCircle, Music2, Palette, Phone, Youtube } from "lucide-react";
import { customerPath } from "@/config/routes";
import { customerSiteContainerClass } from "@/components/customer/customer-site-container";
import { localizePath, type AppLocale } from "@/i18n/locales";
import { translatePlatformLiteral } from "@/i18n/platform-literals";
import { type CustomerSiteThemeVariant } from "@/lib/customer-theme";
import { cn } from "@/lib/utils";
import { CustomerContactControl } from "@/components/customer/customer-contact-control";

type CustomerSiteFooterProps = {
  slug: string;
  locale: AppLocale;
  site: {
    studioName: string;
    tagline: string;
    contactEmail?: string;
    contactPhone?: string;
    location?: string;
    socialLinks?: Record<"instagram" | "facebook" | "youtube" | "linkedin" | "snapchat" | "pinterest" | "behance" | "tiktok", { href: string; enabled: boolean }>;
  };
  variant: CustomerSiteThemeVariant;
};

export function CustomerSiteFooter({ slug, locale, site, variant }: CustomerSiteFooterProps) {
  const tone = getFooterTone(variant);
  const isDark = variant === "cinematic" || variant === "luxury" || variant === "monochrome";
  const links = [
    { label: translatePlatformLiteral("Gallery", locale), href: localizePath(locale, customerPath(slug, "/gallery")) },
    { label: translatePlatformLiteral("Categories", locale), href: localizePath(locale, customerPath(slug, "/categories")) },
    { label: translatePlatformLiteral("Blog", locale), href: localizePath(locale, customerPath(slug, "/blog")) },
    { label: translatePlatformLiteral("About", locale), href: localizePath(locale, customerPath(slug, "/about")) },
  ];
  const socialLinks = [
    { key: "instagram", label: "Instagram", icon: Instagram },
    { key: "facebook", label: "Facebook", icon: Facebook },
    { key: "youtube", label: "YouTube", icon: Youtube },
    { key: "linkedin", label: "LinkedIn", icon: Linkedin },
    { key: "snapchat", label: "Snapchat", icon: MessageCircle },
    { key: "pinterest", label: "Pinterest", icon: Images },
    { key: "behance", label: "Behance", icon: Palette },
    { key: "tiktok", label: "TikTok", icon: Music2 }
  ]
    .map((social) => ({
      ...social,
      href: site.socialLinks?.[social.key as keyof NonNullable<typeof site.socialLinks>]?.href ?? "",
      enabled: site.socialLinks?.[social.key as keyof NonNullable<typeof site.socialLinks>]?.enabled ?? false
    }))
    .filter((social) => social.enabled && social.href);

  return (
    <footer className={cn(tone.section, "pb-8")}>
      <div
        className={cn(
          "grid gap-10 border-t pt-8",
          variant === "cinematic" && "border-white/10 lg:grid-cols-[1fr_0.7fr_0.8fr]",
          variant === "luxury" && "border-[rgba(216,191,136,0.28)] text-center lg:grid-cols-[1fr_0.55fr_1fr] lg:text-left",
          variant === "monochrome" && "border-white/10 lg:grid-cols-[1.1fr_1fr_1fr]",
          variant === "panorama" && "rounded-t-[2rem] border-[#cbd3cd] bg-white/45 p-8 lg:grid-cols-[1.15fr_0.7fr_0.9fr]",
          variant === "editorial" && "border-[#ddcdbf] lg:grid-cols-[1.2fr_0.6fr_0.8fr]",
          variant === "masonry" && "border-[#d9dfdc] lg:grid-cols-[1fr_1fr]",
          !["cinematic", "luxury", "monochrome", "panorama", "editorial", "masonry"].includes(variant) && cn("lg:grid-cols-[1.2fr_0.7fr_0.8fr]", isDark ? "border-white/10" : "border-current/10")
        )}
      >
        <div>
          <p className={cn("font-display text-3xl font-light tracking-[-0.05em]", variant === "editorial" && "text-2xl", variant === "masonry" && "text-xl", variant === "cinematic" && "text-2xl")}>{site.studioName}</p>
          <p className={cn("mt-3 max-w-xl text-sm leading-6", tone.muted)}>{site.tagline}</p>
          <div className={cn("mt-6 grid gap-3 text-sm", tone.muted)}>
            <span className="inline-flex items-center gap-2">
              <MapPin className="size-4" aria-hidden="true" />
              {site.location ?? "Islamabad, Pakistan"}
            </span>
            <span className="inline-flex items-center gap-2">
              <Mail className="size-4" aria-hidden="true" />
              {site.contactEmail ?? `hello@${site.studioName.toLowerCase().replace(/[^a-z0-9]+/g, "")}.com`}
            </span>
            <span className="inline-flex items-center gap-2">
              <Phone className="size-4" aria-hidden="true" />
              {site.contactPhone ?? translatePlatformLiteral("Available on request", locale)}
            </span>
          </div>
        </div>
        <div>
          <p className={cn("font-nav text-xs font-semibold uppercase tracking-[0.24em]", tone.accent)}>{translatePlatformLiteral("Pages", locale)}</p>
          <nav className={cn("mt-4 grid font-nav text-[10px] font-semibold uppercase tracking-[0.2em]", variant === "luxury" ? "gap-3" : "gap-2", variant === "masonry" && "grid-cols-2", variant === "cinematic" && "gap-3")}>
            {links.map((link) => (
              <Link key={link.label} href={link.href} className={cn("transition hover:opacity-60", tone.accent)}>
                {link.label}
              </Link>
            ))}
            <CustomerContactControl
              slug={slug}
              variant={variant}
              triggerLabel={translatePlatformLiteral("Contact", locale)}
              triggerClassName={cn("text-left transition hover:opacity-60", tone.accent)}
            />
          </nav>
        </div>
        {variant !== "masonry" && (
          <div>
            <p className={cn("font-nav text-xs font-semibold uppercase tracking-[0.24em]", tone.accent)}>{translatePlatformLiteral("Social", locale)}</p>
            {socialLinks.length ? (
              <div className={cn("mt-4 flex flex-wrap gap-2", variant === "luxury" && "justify-center lg:justify-start", variant === "cinematic" && "justify-center lg:justify-start")}>
                {socialLinks.map((social) => {
                  const Icon = social.icon;

                  return (
                    <a key={social.label} href={social.href} aria-label={social.label} className={cn("inline-flex size-10 items-center justify-center border transition hover:-translate-y-0.5", variant === "luxury" ? "border-[rgba(216,191,136,0.28)] text-[#d8bf88] hover:bg-[#d8bf88]/10" : variant === "cinematic" ? "border-white/10 text-teal-300 hover:bg-white/10" : isDark ? "border-white/10 hover:bg-white/10" : "border-current/10 hover:bg-black/5")} target="_blank" rel="noreferrer">
                      <Icon className="size-4" aria-hidden="true" />
                    </a>
                  );
                })}
              </div>
            ) : (
              <p className={cn("mt-4 text-sm", tone.muted)}>{translatePlatformLiteral("Social links can be added from Settings.", locale)}</p>
            )}
          </div>
        )}
      </div>
      <div className={cn("mt-8 border-t pt-5 text-center text-xs", isDark ? "border-white/10" : "border-current/10", tone.muted)}>
        <p>{translatePlatformLiteral("Published with Photaaz", locale)}</p>
      </div>
    </footer>
  );
}

function getFooterTone(variant: CustomerSiteThemeVariant) {
  if (variant === "cinematic") {
    return {
      section: cn(customerSiteContainerClass, "pb-16"),
      muted: "text-white/50",
      accent: "text-teal-300"
    };
  }

  if (variant === "luxury") {
    return {
      section: cn(customerSiteContainerClass, "pb-16"),
      muted: "text-[#d8cab8]",
      accent: "text-[#d8bf88]"
    };
  }

  if (variant === "monochrome") {
    return {
      section: cn(customerSiteContainerClass, "pb-16"),
      muted: "text-white/60",
      accent: "text-teal-300"
    };
  }

  if (variant === "editorial") {
    return {
      section: cn(customerSiteContainerClass, "pb-16"),
      muted: "text-[#695f58]",
      accent: "text-[#9a4f32]"
    };
  }

  if (variant === "masonry") {
    return {
      section: "px-5 pb-16 sm:px-8 lg:px-10",
      muted: "text-[#5f6970]",
      accent: "text-teal-700"
    };
  }

  if (variant === "panorama") {
    return {
      section: cn(customerSiteContainerClass, "pb-16 pt-8"),
      muted: "text-[#59645f]",
      accent: "text-teal-700"
    };
  }

  return {
    section: cn(customerSiteContainerClass, "pb-16"),
    muted: "text-[#59636b]",
    accent: "text-teal-700"
  };
}
