import Link from "next/link";
import { Camera } from "lucide-react";
import { customerPath } from "@/config/routes";
import { localizePath, type AppLocale } from "@/i18n/locales";

type CustomerSiteNavProps = {
  slug: string;
  locale: AppLocale;
  name: string;
};

export function CustomerSiteNav({ slug, locale, name }: CustomerSiteNavProps) {
  return (
    <header className="absolute inset-x-0 top-0 z-30 bg-gradient-to-b from-black/52 to-transparent">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
        <Link href={localizePath(locale, customerPath(slug))} className="flex items-center gap-3 text-white">
          <Camera className="size-5" aria-hidden="true" />
          <span className="font-display text-2xl font-black tracking-[-0.04em]">{name}</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-semibold text-white drop-shadow-sm sm:flex">
          <Link href={localizePath(locale, customerPath(slug, "/gallery"))} className="transition hover:text-white/72">Gallery</Link>
          <Link href={localizePath(locale, customerPath(slug, "/blog"))} className="transition hover:text-white/72">Blog</Link>
          <Link href={localizePath(locale, customerPath(slug, "/about"))} className="transition hover:text-white/72">About</Link>
          <Link href={localizePath(locale, customerPath(slug, "/contact"))} className="transition hover:text-white/72">Contact</Link>
        </nav>
      </div>
    </header>
  );
}
