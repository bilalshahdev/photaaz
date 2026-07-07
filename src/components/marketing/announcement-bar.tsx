import Link from "next/link";
import { ArrowRight, Megaphone } from "lucide-react";
import type { Route } from "next";
import { localizePath, resolveLocalizedString, type AppLocale } from "@/i18n/locales";
import type { PlatformAnnouncementView } from "@/services/platform/platform-data";

export function AnnouncementBar({ announcement, locale }: { announcement: PlatformAnnouncementView; locale: AppLocale }) {
  const title = resolveLocalizedString(announcement.title, locale);
  const body = resolveLocalizedString(announcement.body, locale);
  const linkLabel = announcement.linkLabel ? resolveLocalizedString(announcement.linkLabel, locale) : "";
  const hasLink = Boolean(announcement.linkHref && linkLabel);
  const href = announcement.linkHref?.startsWith("/") ? localizePath(locale, announcement.linkHref) : announcement.linkHref;

  function renderContent() {
    return (
      <>
        <span className="inline-flex shrink-0 items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] sm:text-xs sm:tracking-[0.2em]">
          <Megaphone className="size-4" aria-hidden="true" />
          {title}
        </span>
        <span className="min-w-0 truncate text-sm text-white/86">{body}</span>
        {hasLink ? (
          <Link href={href as Route} className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold uppercase tracking-[0.16em] underline-offset-4 hover:underline sm:tracking-[0.18em]">
            {linkLabel}
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        ) : null}
      </>
    );
  }

  return (
    <section className="relative z-50 h-10 overflow-hidden bg-[#0f625d] text-white">
      <div className="mx-auto flex h-10 max-w-7xl items-center gap-3 px-4 text-center sm:px-6 md:hidden">
        {renderContent()}
      </div>
      <div className={announcement.marquee ? "hidden whitespace-nowrap md:flex" : "hidden md:block"}>
        <div className={announcement.marquee ? "flex h-10 min-w-full animate-[announcement-marquee_28s_linear_infinite] items-center justify-center gap-8 px-4" : "mx-auto flex h-10 max-w-7xl items-center justify-center gap-3 px-4 text-center sm:px-6 lg:px-8"}>
          {renderContent()}
        </div>
        {announcement.marquee ? (
          <div className="flex h-10 min-w-full animate-[announcement-marquee_28s_linear_infinite] items-center justify-center gap-8 px-4" aria-hidden="true">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em]">
              <Megaphone className="size-4" aria-hidden="true" />
              {title}
            </span>
            <span className="text-sm text-white/86">{body}</span>
            {hasLink ? (
              <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.18em]">
                {linkLabel}
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </span>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
