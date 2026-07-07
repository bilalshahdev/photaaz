"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { BookOpen, Camera, GalleryHorizontalEnd, Info, Menu, Tags, X } from "lucide-react";
import { customerPath } from "@/config/routes";
import { customerSiteContainerClass } from "@/components/customer/customer-site-container";
import { localizePath, type AppLocale } from "@/i18n/locales";
import { type CustomerSiteThemeVariant } from "@/lib/customer-theme";
import { cn } from "@/lib/utils";

type CustomerSiteNavProps = {
  slug: string;
  locale: AppLocale;
  name: string;
  variant?: CustomerSiteThemeVariant;
  reserveSpace?: boolean;
};

const navLinks = [
  { label: "Gallery", path: "/gallery", icon: GalleryHorizontalEnd },
  { label: "Categories", path: "/categories", icon: Tags },
  { label: "Blog", path: "/blog", icon: BookOpen },
  { label: "About", path: "/about", icon: Info }
];

function Brand({ slug, locale, name, className }: Pick<CustomerSiteNavProps, "slug" | "locale" | "name"> & { className?: string }) {
  return (
    <Link href={localizePath(locale, customerPath(slug))} className={cn("flex min-w-0 items-center gap-3", className)}>
      <Camera className="size-5 shrink-0" aria-hidden="true" />
      <span className="truncate font-display text-xl font-black tracking-[-0.04em] sm:text-2xl">{name}</span>
    </Link>
  );
}

function getCustomerNavHref(slug: string, locale: AppLocale, path: string): Route {
  if (path.startsWith("#")) {
    return `${localizePath(locale, customerPath(slug))}${path}` as Route;
  }

  return localizePath(locale, customerPath(slug, path));
}

function isActiveCustomerNav(pathname: string, slug: string, path: string) {
  const normalized = pathname.replace(/\/$/, "");
  return normalized.endsWith(`/site/${slug}${path}`);
}

function Links({ slug, locale, className, activeClassName }: Pick<CustomerSiteNavProps, "slug" | "locale"> & { className?: string; activeClassName?: string }) {
  const pathname = usePathname();

  return (
    <nav className={cn("hidden items-center text-sm font-semibold lg:flex", className)}>
      {navLinks.map((item) => {
        const isActive = isActiveCustomerNav(pathname, slug, item.path);

        return (
          <Link key={item.path} href={getCustomerNavHref(slug, locale, item.path)} aria-current={isActive ? "page" : undefined} className={cn("inline-flex min-w-20 justify-center transition hover:opacity-65", isActive && (activeClassName ?? "underline underline-offset-8"))}>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function MenuButton({ isOpen, onClick, className, label = "Menu", showLabel = false }: { isOpen: boolean; onClick: () => void; className?: string; label?: string; showLabel?: boolean }) {
  return (
    <button type="button" onClick={onClick} className={cn("inline-flex h-11 items-center justify-center gap-2 border px-3 transition lg:hidden", !showLabel && "w-11 px-0", className)} aria-label={isOpen ? "Close menu" : "Open menu"} aria-expanded={isOpen}>
      {isOpen ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
      {showLabel ? <span className="font-nav text-[0.65rem] font-semibold uppercase tracking-[0.2em]">{label}</span> : null}
    </button>
  );
}

function useAutoHideMobileChrome(isLocked: boolean) {
  const [isTopHidden, setIsTopHidden] = useState(false);
  const [isBottomHidden, setIsBottomHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (isLocked) {
      setIsTopHidden(false);
      setIsBottomHidden(false);
      return;
    }

    let previousScrollY = window.scrollY;
    let ticking = false;

    const update = () => {
      const currentScrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const isNearBottom = currentScrollY + viewportHeight >= documentHeight - 120;
      const isAtTop = currentScrollY < 32;
      const isPastIntro = currentScrollY > 96;
      const isScrollingDown = currentScrollY > previousScrollY + 8;
      const isScrollingUp = currentScrollY < previousScrollY - 8;

      setIsScrolled(!isAtTop);
      setIsBottomHidden(isAtTop || isNearBottom);

      if (!isPastIntro || isScrollingUp) {
        setIsTopHidden(false);
      } else if (isScrollingDown) {
        setIsTopHidden(true);
      }

      previousScrollY = currentScrollY;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update();

    return () => window.removeEventListener("scroll", onScroll);
  }, [isLocked]);

  return { isTopHidden, isBottomHidden, isScrolled };
}

function BottomMobileNav({ slug, locale, variant, hidden }: Pick<CustomerSiteNavProps, "slug" | "locale"> & { variant: "minimal" | "monochrome"; hidden: boolean }) {
  const dark = variant === "monochrome";
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "fixed inset-x-3 bottom-3 z-40 grid grid-cols-4 overflow-hidden border bg-secondary/95 text-white shadow-[0_18px_60px_rgba(0,0,0,0.28)] ring-1 ring-white/20 backdrop-blur-2xl transition-[transform,opacity] duration-300 ease-out lg:hidden",
        dark ? "border-white/20" : "border-white/20",
        hidden ? "pointer-events-none translate-y-[calc(100%+1rem)] opacity-0" : "translate-y-0 opacity-100"
      )}
    >
      {navLinks.map((item) => {
        const Icon = item.icon;
        const isActive = isActiveCustomerNav(pathname, slug, item.path);

        return (
          <Link
            key={item.path}
            href={getCustomerNavHref(slug, locale, item.path)}
            aria-current={isActive ? "page" : undefined}
            className={cn("flex min-h-14 flex-col items-center justify-center gap-1 border-r border-white/10 text-[0.62rem] font-semibold text-white/80 transition last:border-r-0 hover:bg-white/10 hover:text-white", isActive && "bg-white/15 text-white")}
          >
            <Icon className="size-4 drop-shadow-[0_1px_1px_rgba(0,0,0,0.55)]" aria-hidden="true" />
            <span className="max-w-full truncate px-1 drop-shadow-[0_1px_1px_rgba(0,0,0,0.55)]">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function MobileMenu({
  slug,
  locale,
  isOpen,
  variant,
  onNavigate
}: Pick<CustomerSiteNavProps, "slug" | "locale"> & { isOpen: boolean; variant: CustomerSiteThemeVariant; onNavigate: () => void }) {
  const pathname = usePathname();
  const menuStyles: Record<CustomerSiteThemeVariant, { shell: string; nav: string; link: string; label?: string; close?: string; showIcons?: boolean }> = {
    minimal: {
      shell: "mx-4 mb-4 border border-white/20 bg-secondary/95 p-2 text-white shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl",
      nav: "grid gap-1",
      link: "px-4 py-3 font-nav text-xs font-semibold uppercase tracking-[0.22em] transition hover:bg-white/10"
    },
    editorial: {
      shell: "animate-in slide-in-from-top-2 mx-0 border-t border-[#ddcdbf] bg-[#f8f1e8] px-5 py-5 text-[#211917] shadow-[0_18px_60px_rgba(94,55,33,0.12)] sm:px-8",
      nav: "grid gap-2",
      link: "border-l-2 border-transparent px-4 py-2 font-display text-3xl font-light tracking-[-0.05em] transition hover:border-[#9a4f32] hover:text-[#9a4f32]",
      label: "Portfolio Journal"
    },
    cinematic: {
      shell: "fixed inset-0 z-50 bg-black/95 p-5 pt-20 text-white backdrop-blur-2xl",
      nav: "grid gap-3",
      link: "border border-white/10 bg-white/5 px-5 py-5 font-display text-4xl font-light tracking-[-0.06em] transition hover:bg-white/10",
      label: "Now showing",
      close: "absolute right-5 top-5 border-white/20 text-white hover:bg-white/10"
    },
    masonry: {
      shell: "fixed bottom-0 left-0 top-0 z-50 w-[86vw] max-w-sm border-r border-border bg-background p-5 pt-20 text-foreground shadow-soft",
      nav: "grid gap-1",
      link: "flex min-h-14 items-center gap-3 border-b border-border px-4 py-4 font-nav text-xs font-semibold uppercase tracking-[0.2em] text-foreground transition last:border-b-0 hover:bg-muted",
      label: "Archive Index",
      close: "absolute right-5 top-5 border-border text-foreground hover:bg-muted",
      showIcons: true
    },
    luxury: {
      shell: "fixed bottom-0 right-0 top-0 z-50 w-[78vw] max-w-sm border-l border-[rgba(216,191,136,0.35)] bg-[rgba(17,16,13,0.98)] p-6 pt-24 text-[#fbf4e8] shadow-[-22px_0_80px_rgba(0,0,0,0.5)] backdrop-blur-2xl",
      nav: "grid gap-3 text-center",
      link: "border border-[rgba(216,191,136,0.35)] bg-[rgba(0,0,0,0.18)] px-4 py-4 font-nav text-xs font-semibold uppercase tracking-[0.32em] text-[#fbf4e8] transition hover:border-[#d8bf88] hover:bg-[rgba(216,191,136,0.1)] hover:text-[#d8bf88]",
      label: "Atelier Menu",
      close: "absolute right-6 top-6 border-[rgba(216,191,136,0.32)] text-[#fbf4e8] hover:bg-white/10"
    },
    monochrome: {
      shell: "mx-0 border-b border-white/10 bg-black p-2 text-white",
      nav: "grid",
      link: "border-b border-white/10 px-5 py-4 font-nav text-xs font-semibold uppercase tracking-[0.28em] text-white/75 transition last:border-b-0 hover:text-white"
    },
    panorama: {
      shell: "fixed inset-0 z-50 flex min-h-dvh flex-col bg-[#07130f] px-7 pb-10 pt-24 text-white shadow-[0_24px_90px_rgba(0,0,0,0.48)]",
      nav: "mt-auto grid gap-2 border-y border-white/10 py-5",
      link: "group flex min-h-16 items-center justify-between border-b border-white/10 py-4 font-display text-4xl font-light tracking-[-0.055em] text-white/90 transition last:border-b-0 hover:text-white",
      label: "Horizon Menu",
      close: "absolute right-6 top-6 border-white/20 bg-white/10 text-white hover:bg-white/20"
    }
  };
  const styles = menuStyles[variant];
  const isOverlayMenu = ["masonry", "cinematic", "luxury", "panorama"].includes(variant);

  if (!isOpen && !isOverlayMenu) return null;

  const closedTransform: Partial<Record<CustomerSiteThemeVariant, string>> = {
    cinematic: "-translate-y-full opacity-0",
    masonry: "-translate-x-full opacity-0",
    luxury: "translate-x-full opacity-0",
    panorama: "-translate-y-full opacity-0"
  };

  return (
    <>
      {isOverlayMenu ? (
        <button
          type="button"
          aria-label="Close menu"
          onClick={onNavigate}
          className={cn(
            "fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] transition-opacity duration-300 ease-out lg:hidden",
            isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
          )}
        />
      ) : null}
    <div
      className={cn(
        "lg:hidden",
        styles.shell,
        isOverlayMenu && "transition-[opacity,transform] duration-300 ease-out will-change-transform",
        isOverlayMenu && (isOpen ? "pointer-events-auto translate-x-0 translate-y-0 scale-100 opacity-100" : `pointer-events-none ${closedTransform[variant]}`)
      )}
      aria-hidden={!isOpen}
    >
      {styles.close ? (
        <button type="button" onClick={onNavigate} className={cn("inline-flex size-11 items-center justify-center border transition", styles.close)} aria-label="Close menu">
          <X className="size-5" aria-hidden="true" />
        </button>
      ) : null}
      {styles.label ? <p className="mb-4 font-nav text-[0.65rem] font-semibold uppercase tracking-[0.28em] opacity-60">{styles.label}</p> : null}
      <nav className={styles.nav}>
        {navLinks.map((item, index) => {
          const Icon = item.icon;
          const isActive = isActiveCustomerNav(pathname, slug, item.path);

          return (
            <Link key={item.path} href={getCustomerNavHref(slug, locale, item.path)} onClick={onNavigate} aria-current={isActive ? "page" : undefined} className={cn(styles.link, isActive && "opacity-100 ring-1 ring-current/20")}>
              {styles.showIcons ? <Icon className="size-4" aria-hidden="true" /> : null}
              <span>{item.label}</span>
              {variant === "panorama" ? <span className="font-nav text-xs font-semibold uppercase tracking-[0.28em] text-white/40 group-hover:text-white/60">{String(index + 1).padStart(2, "0")}</span> : null}
            </Link>
          );
        })}
      </nav>
    </div>
    </>
  );
}

function NavSpacer({ variant }: { variant: CustomerSiteThemeVariant }) {
  if (variant === "masonry") {
    return <div className="h-16 lg:hidden" aria-hidden="true" />;
  }

  if (variant === "luxury") {
    return <div className="h-16" aria-hidden="true" />;
  }

  return <div className="h-16 sm:h-[4.5rem]" aria-hidden="true" />;
}

export function CustomerSiteNav({ slug, locale, name, variant = "minimal", reserveSpace = false }: CustomerSiteNavProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { isTopHidden, isBottomHidden } = useAutoHideMobileChrome(isMenuOpen);
  const topChromeClass = isMenuOpen
    ? "opacity-100"
    : cn(
        "transition-[transform,opacity] duration-300 ease-out",
        isTopHidden ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
      );

  useEffect(() => {
    if (!isMenuOpen) return;

    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousHtmlPaddingRight = document.documentElement.style.paddingRight;
    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.documentElement.style.paddingRight = `${scrollbarWidth}px`;
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.documentElement.style.paddingRight = previousHtmlPaddingRight;
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
    };
  }, [isMenuOpen]);

  if (variant === "masonry") {
    return (
      <>
        {reserveSpace ? <NavSpacer variant={variant} /> : null}
        <header className={cn("fixed inset-x-0 top-0 z-30 border-b border-border bg-background/95 py-3 backdrop-blur lg:hidden", topChromeClass)}>
          <div className={cn(customerSiteContainerClass, "flex items-center justify-between")}>
            <Brand slug={slug} locale={locale} name={name} className="text-[#101418]" />
            <MenuButton isOpen={isMenuOpen} onClick={() => setIsMenuOpen((value) => !value)} className="border-border text-foreground hover:bg-muted" />
          </div>
        </header>
        <MobileMenu slug={slug} locale={locale} isOpen={isMenuOpen} variant="masonry" onNavigate={() => setIsMenuOpen(false)} />
        <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] border-r border-[#d9dfdc] bg-[#f4f2ec] px-7 py-8 text-[#101418] lg:block">
          <Brand slug={slug} locale={locale} name={name} className="text-[#101418]" />
          <nav className="mt-16 grid gap-5 font-nav text-xs font-semibold uppercase tracking-[0.26em]">
            {navLinks.map((item) => (
              <Link key={item.path} href={getCustomerNavHref(slug, locale, item.path)} aria-current={isActiveCustomerNav(pathname, slug, item.path) ? "page" : undefined} className={cn("text-[#38424a] transition hover:text-teal-700", isActiveCustomerNav(pathname, slug, item.path) && "text-teal-700")}>
                {item.label}
              </Link>
            ))}
          </nav>
          <p className="absolute bottom-8 left-7 right-7 text-xs leading-6 text-[#5f6970]">Browse by story, category, or visual sequence.</p>
        </aside>
      </>
    );
  }

  if (variant === "editorial") {
    return (
      <>
        {reserveSpace ? <NavSpacer variant={variant} /> : null}
        <header className={cn("fixed inset-x-0 top-0 z-30 border-b border-[#ddcdbf] bg-[#f8f1e8]/92 backdrop-blur-xl", topChromeClass)}>
        <div className={cn(customerSiteContainerClass, "grid grid-cols-[1fr_auto] items-center gap-5 py-4 lg:grid-cols-[1fr_auto_1fr]")}>
          <Brand slug={slug} locale={locale} name={name} className="text-[#211917]" />
          <span className="hidden font-nav text-xs font-semibold uppercase tracking-[0.32em] text-[#9a4f32] lg:inline">Portfolio Journal</span>
          <Links slug={slug} locale={locale} className="justify-end gap-7 text-[#211917]" activeClassName="text-[#9a4f32]" />
          <MenuButton isOpen={isMenuOpen} onClick={() => setIsMenuOpen((value) => !value)} className="justify-self-end border-[rgba(33,25,23,0.14)] text-[#211917] hover:bg-[#211917]/5" />
        </div>
        <MobileMenu slug={slug} locale={locale} isOpen={isMenuOpen} variant="editorial" onNavigate={() => setIsMenuOpen(false)} />
      </header>
      </>
    );
  }

  if (variant === "cinematic") {
    return (
      <>
      {reserveSpace ? <NavSpacer variant={variant} /> : null}
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-30 border-b border-white/10 bg-black/70 text-white shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl",
          topChromeClass
        )}
      >
        <div
          className={cn(
            customerSiteContainerClass,
            "flex items-center justify-between py-4 transition-[background-color,box-shadow,backdrop-filter] duration-300"
          )}
        >
          <Brand slug={slug} locale={locale} name={name} className="text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]" />
          <Links slug={slug} locale={locale} className="gap-8 rounded-full border border-white/10 bg-black/50 px-5 py-3 text-white backdrop-blur" activeClassName="text-teal-300" />
          <MenuButton isOpen={isMenuOpen} onClick={() => setIsMenuOpen((value) => !value)} className="border-white/20 bg-black/50 text-white shadow-[0_12px_34px_rgba(0,0,0,0.35)] backdrop-blur hover:bg-black/70" />
        </div>
      </header>
        <MobileMenu slug={slug} locale={locale} isOpen={isMenuOpen} variant="cinematic" onNavigate={() => setIsMenuOpen(false)} />
      </>
    );
  }

  if (variant === "luxury") {
    const leftLinks = navLinks.slice(0, 2);
    const rightLinks = navLinks.slice(2);

    return (
      <>
      {reserveSpace ? <NavSpacer variant={variant} /> : null}
      <header className={cn("fixed inset-x-0 top-0 z-30 border-b border-[rgba(216,191,136,0.2)] bg-[rgba(17,16,13,0.9)] text-[#fbf4e8] shadow-[0_18px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl", topChromeClass)}>
        <div className={cn(customerSiteContainerClass, "grid grid-cols-[1fr_auto] items-center py-4 lg:grid-cols-[1fr_auto_1fr]")}>
          <nav className="hidden items-center justify-start gap-7 text-sm font-semibold text-[#fbf4e8] lg:flex">
            {leftLinks.map((item) => (
              <Link key={item.path} href={getCustomerNavHref(slug, locale, item.path)} aria-current={isActiveCustomerNav(pathname, slug, item.path) ? "page" : undefined} className={cn("transition hover:text-[#fbf4e8]", isActiveCustomerNav(pathname, slug, item.path) && "text-[#d8bf88]")}>
                {item.label}
              </Link>
            ))}
          </nav>
          <Brand slug={slug} locale={locale} name={name} className="justify-start text-[#fbf4e8] lg:justify-center" />
          <nav className="hidden items-center justify-end gap-7 text-sm font-semibold text-[#fbf4e8] lg:flex">
            {rightLinks.map((item) => (
              <Link key={item.path} href={getCustomerNavHref(slug, locale, item.path)} aria-current={isActiveCustomerNav(pathname, slug, item.path) ? "page" : undefined} className={cn("transition hover:text-[#fbf4e8]", isActiveCustomerNav(pathname, slug, item.path) && "text-[#d8bf88]")}>
                {item.label}
              </Link>
            ))}
          </nav>
          <MenuButton isOpen={isMenuOpen} onClick={() => setIsMenuOpen((value) => !value)} className="justify-self-end border-white/20 text-[#fbf4e8] hover:bg-white/10" />
        </div>
      </header>
        <MobileMenu slug={slug} locale={locale} isOpen={isMenuOpen} variant="luxury" onNavigate={() => setIsMenuOpen(false)} />
      </>
    );
  }

  if (variant === "monochrome") {
    return (
      <>
        {reserveSpace ? <NavSpacer variant={variant} /> : null}
        <header className={cn("fixed inset-x-0 top-0 z-30 border-b border-white/10 bg-black/75 text-white backdrop-blur", topChromeClass)}>
          <div className={cn(customerSiteContainerClass, "flex items-center justify-center py-4 lg:justify-between")}>
            <Brand slug={slug} locale={locale} name={name} />
            <Links slug={slug} locale={locale} className="gap-8 font-nav text-xs uppercase tracking-[0.24em] text-white/75" activeClassName="text-white" />
          </div>
        </header>
        <BottomMobileNav slug={slug} locale={locale} variant="monochrome" hidden={isBottomHidden} />
      </>
    );
  }

  if (variant === "panorama") {
    return (
      <>
      {reserveSpace ? <NavSpacer variant={variant} /> : null}
      <header className={cn("fixed inset-x-0 top-0 z-30 border-b border-white/10 bg-[#07130f]/85 text-white shadow-[0_18px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl", topChromeClass)}>
        <div
          className={cn(
            customerSiteContainerClass,
            "flex items-center justify-between py-4 transition-[background-color,box-shadow,backdrop-filter] duration-300"
          )}
        >
          <Brand slug={slug} locale={locale} name={name} className="drop-shadow-[0_1px_3px_rgba(0,0,0,0.55)]" />
          <Links slug={slug} locale={locale} className="gap-6 rounded-none border border-white/20 bg-white/10 px-5 py-3 text-white backdrop-blur" activeClassName="text-teal-200" />
          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            className="inline-flex size-11 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white shadow-[0_12px_34px_rgba(0,0,0,0.28)] backdrop-blur-xl transition hover:bg-white/20 lg:hidden"
            aria-label="Open navigation"
            aria-expanded={isMenuOpen}
          >
            <Menu className="size-4" aria-hidden="true" />
          </button>
        </div>
      </header>
        <MobileMenu slug={slug} locale={locale} isOpen={isMenuOpen} variant="panorama" onNavigate={() => setIsMenuOpen(false)} />
      </>
    );
  }

  return (
    <>
      {reserveSpace ? <NavSpacer variant={variant} /> : null}
      <header className={cn("fixed inset-x-0 top-0 z-30 bg-black/45 text-white backdrop-blur-xl", topChromeClass)}>
        <div className={cn(customerSiteContainerClass, "flex items-center justify-center py-4 lg:justify-between")}>
          <Brand slug={slug} locale={locale} name={name} className="text-white" />
          <Links slug={slug} locale={locale} className="gap-6 text-white drop-shadow-sm" activeClassName="text-teal-200" />
        </div>
      </header>
      <BottomMobileNav slug={slug} locale={locale} variant="minimal" hidden={isBottomHidden} />
    </>
  );
}
