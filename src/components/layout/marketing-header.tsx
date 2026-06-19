"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { onboardingPath, signInPath } from "@/config/routes";
import { MarketingContainer } from "@/components/layout/marketing-container";
import { MarketingControls } from "@/components/layout/marketing-controls";
import { getMessages, localizePath, type AppLocale, type MarketingMessages } from "@/i18n/locales";

type MarketingHeaderProps = {
  locale?: AppLocale;
  messages?: MarketingMessages;
  variant?: "overlay" | "solid";
  hasAnnouncement?: boolean;
  enabledLocales?: AppLocale[];
  stacked?: boolean;
};

export function MarketingHeader({ locale = "en", messages = getMessages(locale), variant = "overlay", hasAnnouncement = false, enabledLocales, stacked = false }: MarketingHeaderProps) {
  const copy = messages.nav;
  const isSolid = variant === "solid";
  const homePath = localizePath(locale, "/");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [announcementOffset, setAnnouncementOffset] = useState(hasAnnouncement ? 40 : 0);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const announcementHeight = hasAnnouncement ? 40 : 0;

    function handleScroll() {
      const currentScrollY = window.scrollY;
      const scrollingDown = currentScrollY > lastScrollY;

      setIsScrolled(currentScrollY > 24);
      setIsHidden(scrollingDown && currentScrollY > 260);
      setAnnouncementOffset(Math.max(0, announcementHeight - currentScrollY));
      lastScrollY = currentScrollY;
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasAnnouncement]);

  const shouldUseSolidStyle = isSolid || isScrolled;
  const isTransparentOverlay = !shouldUseSolidStyle;
  const positionClass = stacked ? "relative" : isSolid ? "sticky top-0" : "fixed inset-x-0";
  const transformClass = !isSolid && isHidden && !stacked ? "-translate-y-full" : "translate-y-0";
  const navTone = shouldUseSolidStyle ? "text-[#101418]" : "text-white";
  const hoverTone = shouldUseSolidStyle ? "transition hover:text-teal-700" : "transition hover:text-teal-200";

  return (
    <header
      style={isSolid || stacked ? undefined : { top: announcementOffset }}
      className={`${positionClass} z-40 backdrop-blur-md transition-[transform,background-color,box-shadow] duration-300 ${transformClass} ${
        shouldUseSolidStyle ? "bg-[rgba(247,248,246,0.86)] shadow-[0_12px_40px_rgba(16,20,24,0.08)]" : "bg-[rgba(16,20,24,0.82)] sm:bg-[rgba(16,20,24,0.72)]"
      }`}
    >
      <MarketingContainer className="flex h-16 items-center justify-between gap-3 md:grid md:h-[76px] md:grid-cols-[1fr_auto_1fr]">
        <nav className={`hidden items-center gap-6 font-nav text-xs font-semibold uppercase tracking-[0.22em] lg:gap-8 md:flex ${navTone}`}>
          <Link className={hoverTone} href={`${homePath}#themes`}>
            {copy.themes}
          </Link>
          <Link className={hoverTone} href={`${homePath}#features`}>
            {copy.features}
          </Link>
          <Link className={hoverTone} href={`${homePath}#pricing`}>
            {copy.pricing}
          </Link>
          <Link className={hoverTone} href={`${homePath}#contact`}>
            {copy.contact}
          </Link>
        </nav>

        <Link href={homePath} className={`focus-ring min-w-0 shrink-0 justify-self-center rounded-md ${navTone}`}>
          <span className="font-brand text-2xl font-semibold leading-none tracking-[-0.04em] sm:text-3xl md:text-4xl">PhotoFolio</span>
        </Link>

        <nav className="flex shrink-0 items-center justify-end gap-1 sm:gap-2">
          <MarketingControls locale={locale} messages={messages} variant={isTransparentOverlay ? "overlay" : "solid"} enabledLocales={enabledLocales} />
          <Button
            asChild
            variant="ghost"
            size="sm"
            className={`hidden h-10 rounded-none px-3 font-nav text-xs font-semibold uppercase tracking-[0.22em] lg:inline-flex ${
              shouldUseSolidStyle ? "text-[#101418] hover:bg-[#101418]/6 [&_svg]:text-[#101418]" : "text-white hover:bg-white/12 [&_svg]:text-white"
            }`}
          >
            <Link href={localizePath(locale, signInPath())}>
              <LogIn className="size-4" aria-hidden="true" />
              {copy.signIn}
            </Link>
          </Button>
          <Button
            asChild
            size="sm"
            className={`h-10 w-10 rounded-none px-0 font-nav text-xs font-semibold uppercase tracking-[0.22em] sm:w-auto sm:px-5 ${
              shouldUseSolidStyle ? "bg-[#101418] text-white hover:bg-teal-800" : "bg-white text-[#101418] hover:bg-white/90"
            }`}
          >
            <Link href={localizePath(locale, onboardingPath())} aria-label={copy.start}>
              <span className="hidden sm:inline">{copy.start}</span>
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </nav>
      </MarketingContainer>
    </header>
  );
}
