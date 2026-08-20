"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { ArrowRight, LogIn, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { onboardingPath, signInPath } from "@/config/routes";
import { MarketingContainer } from "@/components/layout/marketing-container";
import { MarketingControls } from "@/components/layout/marketing-controls";
import { getMessages, localizePath, type AppLocale, type MarketingMessages } from "@/i18n/locales";
import { brandFontSizeClasses, type BrandFontSize } from "@/lib/brand-fonts";

type MarketingHeaderProps = {
  locale?: AppLocale;
  messages?: MarketingMessages;
  variant?: "overlay" | "solid";
  hasAnnouncement?: boolean;
  enabledLocales?: AppLocale[];
  stacked?: boolean;
  brandName?: string;
  brandFontSize?: BrandFontSize;
};

export function MarketingHeader({ locale = "en", messages = getMessages(locale), variant = "overlay", hasAnnouncement = false, enabledLocales, stacked = false, brandName = "Photaaz", brandFontSize = "sm" }: MarketingHeaderProps) {
  const copy = messages.nav;
  const isSolid = variant === "solid";
  const homePath = localizePath(locale, "/");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
  const hoverTone = shouldUseSolidStyle ? "transition hover:text-primary" : "transition hover:text-primary-light";
  const mobileMenuTone = shouldUseSolidStyle ? "border-[#d7dedb] bg-[#f7f8f6] text-[#101418]" : "border-white/14 bg-[#101418]/96 text-white";
  const mobileLinkTone = shouldUseSolidStyle ? "border-[#101418]/10 hover:bg-[#101418]/5" : "border-white/10 hover:bg-white/10";
  const navItems = [
    { label: copy.themes, href: `${homePath}#themes` },
    { label: copy.features, href: `${homePath}#features` },
    { label: copy.pricing, href: `${homePath}#pricing` },
    { label: copy.contact, href: `${homePath}#contact` },
    { label: "blog" in copy ? copy.blog : "Blog", href: localizePath(locale, "/blog") }
  ];

  return (
    <header
      style={isSolid || stacked ? undefined : { top: announcementOffset }}
      className={`${positionClass} z-40 backdrop-blur-md transition-[transform,background-color,box-shadow] duration-300 ${transformClass} ${
        shouldUseSolidStyle ? "bg-[rgba(247,248,246,0.86)] shadow-[0_12px_40px_rgba(16,20,24,0.08)]" : "bg-[rgba(16,20,24,0.82)] sm:bg-[rgba(16,20,24,0.72)]"
      }`}
    >
      <MarketingContainer className="flex h-14 items-center justify-between gap-3 md:grid md:h-[68px] md:grid-cols-[1fr_auto_1fr]">
        <nav className={`hidden items-center gap-5 font-nav text-[0.68rem] font-semibold uppercase tracking-[0.18em] lg:flex lg:gap-6 ${navTone}`}>
          {navItems.map((item) => (
            <Link key={item.href} className={hoverTone} href={item.href as Route}>
              {item.label}
            </Link>
          ))}
        </nav>

        <Link href={homePath} className={`focus-ring min-w-0 shrink-0 justify-self-center rounded-md ${navTone}`}>
          <span className={`font-brand font-semibold leading-none tracking-[-0.04em] ${brandFontSizeClasses[brandFontSize]}`}>{brandName}</span>
        </Link>

        <nav className="flex shrink-0 items-center justify-end gap-3 sm:gap-3">
          <MarketingControls locale={locale} messages={messages} variant={isTransparentOverlay ? "overlay" : "solid"} enabledLocales={enabledLocales} />
          <button
            type="button"
            onClick={() => setIsMenuOpen((value) => !value)}
            className={`inline-flex size-9 items-center justify-center border transition lg:hidden ${
              shouldUseSolidStyle ? "border-[#101418]/18 text-[#101418] hover:bg-[#101418]/6" : "border-white/32 text-white hover:bg-white/10"
            }`}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="size-4" aria-hidden="true" /> : <Menu className="size-4" aria-hidden="true" />}
          </button>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className={`hidden h-9 rounded-none px-3 font-nav text-[0.68rem] font-semibold uppercase tracking-[0.18em] lg:inline-flex ${
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
            className={`hidden h-9 rounded-none px-4 font-nav text-[0.68rem] font-semibold uppercase tracking-[0.18em] lg:inline-flex ${
              shouldUseSolidStyle ? "bg-[#101418] text-white hover:bg-primary/90" : "bg-white text-[#101418] hover:bg-white/90"
            }`}
          >
            <Link href={localizePath(locale, onboardingPath())} aria-label={copy.start}>
              <span className="hidden sm:inline">{copy.start}</span>
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </nav>
      </MarketingContainer>
      {isMenuOpen ? (
        <div className={`mx-4 mb-4 border p-2 shadow-[0_18px_60px_rgba(16,20,24,0.18)] backdrop-blur lg:hidden ${mobileMenuTone}`}>
          <nav className="grid">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href as Route} onClick={() => setIsMenuOpen(false)} className={`border-b px-4 py-2.5 font-nav text-[0.68rem] font-semibold uppercase tracking-[0.18em] transition last:border-b-0 ${mobileLinkTone}`}>
                {item.label}
              </Link>
            ))}
            <Link href={localizePath(locale, signInPath())} onClick={() => setIsMenuOpen(false)} className={`border-b px-4 py-2.5 font-nav text-[0.68rem] font-semibold uppercase tracking-[0.18em] transition ${mobileLinkTone}`}>
              {copy.signIn}
            </Link>
            <Link href={localizePath(locale, onboardingPath())} onClick={() => setIsMenuOpen(false)} className={`mt-2 inline-flex items-center justify-center gap-2 px-4 py-2.5 font-nav text-[0.68rem] font-semibold uppercase tracking-[0.18em] transition ${shouldUseSolidStyle ? "bg-[#101418] text-white hover:bg-primary/90" : "bg-white text-[#101418] hover:bg-white/90"}`}>
              {copy.start}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
