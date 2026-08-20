"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, Compass } from "lucide-react";
import { type ReactNode } from "react";
import { CustomerContactControl } from "@/components/customer/customer-contact-control";
import { ThemeInquiryForm } from "@/components/customer/theme-inquiry-form";
import { NewThemeAutoHeader } from "@/components/customer/new-theme-auto-header";
import type {
  CustomerSiteExperienceProps,
  DemoData,
  ViewerImage,
} from "@/components/customer/customer-site-experience";
import { customerPath } from "@/config/routes";
import { localizePath } from "@/i18n/locales";
import type { NewThemeKey } from "@/lib/new-themes";
import { cn } from "@/lib/utils";

type HomeProps = CustomerSiteExperienceProps & {
  onOpen: (image: ViewerImage, collection?: ViewerImage[]) => void;
};
type SectionKey =
  | "hero"
  | "featuredPhotos"
  | "categories"
  | "galleries"
  | "contact"
  | "footer";

const navItems = [
  ["Galleries", "/gallery"],
  ["Categories", "/categories"],
  ["Blog", "/blog"],
  ["About", "/about"],
] as const;

function href(props: HomeProps, path = "") {
  return localizePath(props.locale, customerPath(props.slug, path));
}

function HomeMobileNav({
  props,
  theme,
  shellClass,
  linkClass,
}: {
  props: HomeProps;
  theme: NewThemeKey;
  shellClass: string;
  linkClass: string;
}) {
  return (
    <details className="relative ml-auto md:hidden">
      <summary className="cursor-pointer list-none text-xs uppercase tracking-[0.18em]">
        Menu
      </summary>
      <nav className={shellClass}>
        {navItems.map(([label, path]) => (
          <Link className={linkClass} key={path} href={href(props, path)}>
            {label}
          </Link>
        ))}
        <CustomerContactControl
          slug={props.slug}
          variant={theme}
          triggerClassName={linkClass}
        />
      </nav>
    </details>
  );
}

function sectionOrder(demo: DemoData) {
  return demo.sectionOrder?.length
    ? demo.sectionOrder
    : ([
        "hero",
        "galleries",
        "featuredPhotos",
        "categories",
        "contact",
        "footer",
      ] as SectionKey[]);
}

function enabled(demo: DemoData, key: SectionKey) {
  return demo.sections?.[key] ?? true;
}

function Ordered({
  demo,
  render,
}: {
  demo: DemoData;
  render: Record<SectionKey, () => ReactNode>;
}) {
  return sectionOrder(demo).map((key) =>
    enabled(demo, key) ? <div key={key}>{render[key]()}</div> : null,
  );
}

function Photo({
  item,
  items,
  onOpen,
  className,
  sizes = "(min-width: 900px) 50vw, 100vw",
}: {
  item: ViewerImage;
  items: ViewerImage[];
  onOpen: HomeProps["onOpen"];
  className: string;
  sizes?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(item, items)}
      className={cn("group relative overflow-hidden text-left", className)}
    >
      <Image
        src={item.image}
        alt={item.title}
        fill
        sizes={sizes}
        className="object-cover transition duration-700 group-hover:scale-[1.025]"
      />
    </button>
  );
}

function ContactBlock({
  props,
  theme,
  className,
}: {
  props: HomeProps;
  theme: NewThemeKey;
  className?: string;
}) {
  return (
    <section data-customer-contact-section className={className}>
      <div>
        <p className="text-xs uppercase tracking-[0.28em]">Contact</p>
        <h2 className="mt-3 text-[clamp(2.5rem,6vw,6rem)] leading-[0.88] tracking-[-0.06em]">
          {props.demo.homepage?.copy?.contactTitle ?? "Start a conversation."}
        </h2>
        <p className="mt-5 max-w-xl opacity-65">
          {props.demo.homepage?.copy?.contactBody ?? props.demo.tagline}
        </p>
      </div>
      <ThemeInquiryForm slug={props.slug} variant={theme} />
    </section>
  );
}

function RelayNav(props: HomeProps) {
  return (
    <NewThemeAutoHeader className="flex h-14 items-center border-b border-[#17211d] bg-[#f2f0e8]/95 px-4 text-[#17211d] backdrop-blur sm:px-7">
      <Link
        href={href(props)}
        className="mr-auto font-mono text-sm font-black uppercase tracking-[0.18em]"
      >
        {props.demo.studioName}
      </Link>
      <nav className="hidden items-center gap-6 font-mono text-[10px] uppercase tracking-[0.16em] md:flex">
        {navItems.map(([label, path]) => (
          <Link key={path} href={href(props, path)}>
            {label}
          </Link>
        ))}
        <CustomerContactControl
          slug={props.slug}
          variant="relay"
          triggerClassName="font-mono uppercase tracking-[0.16em]"
        />
      </nav>
      <HomeMobileNav
        props={props}
        theme="relay"
        shellClass="absolute right-0 top-8 z-50 grid w-52 border border-[#17211d] bg-[#f2f0e8] p-3"
        linkClass="border-b border-[#17211d]/25 py-3 text-left font-mono text-xs uppercase"
      />
    </NewThemeAutoHeader>
  );
}

export function RelayHome(props: HomeProps) {
  const items = props.demo.galleries;
  const render: Record<SectionKey, () => ReactNode> = {
    hero: () => (
      <section className="grid min-h-[72vh] border-b border-[#17211d] bg-[#f2f0e8] text-[#17211d] lg:grid-cols-[0.38fr_0.62fr]">
        <div className="flex flex-col justify-between border-b border-[#17211d] p-6 lg:border-b-0 lg:border-r lg:p-10">
          <span className="font-mono text-xs">RELAY / 00</span>
          <div>
            <h1 className="text-[clamp(4rem,10vw,9rem)] leading-[0.72] tracking-[-0.09em]">
              {props.demo.studioName}
            </h1>
            <p className="mt-7 max-w-md text-lg">{props.demo.tagline}</p>
          </div>
          <ArrowDown className="size-5" />
        </div>
        <div className="relative min-h-[56vh]">
          <Image
            src={props.demo.heroImage}
            alt={props.demo.studioName}
            fill
            priority
            sizes="70vw"
            className="object-cover"
          />
        </div>
      </section>
    ),
    galleries: () => (
      <section className="overflow-x-auto border-b border-[#17211d] bg-[#17211d] text-[#f2f0e8]">
        <div className="flex min-w-max snap-x">
          {items.map((item, index) => (
            <article
              key={item.title}
              className="w-[82vw] snap-start border-r border-white/25 p-4 sm:w-[52vw] lg:w-[38vw]"
            >
              <div className="mb-3 flex justify-between font-mono text-xs">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <span>{item.location}</span>
              </div>
              <Photo
                item={item}
                items={items}
                onOpen={props.onOpen}
                className="aspect-[4/3] w-full"
              />
              <h2 className="mt-4 text-4xl tracking-[-0.05em]">{item.title}</h2>
            </article>
          ))}
        </div>
      </section>
    ),
    featuredPhotos: () => (
      <section className="grid border-b border-[#17211d] md:grid-cols-3">
        {items.slice(0, 3).map((item, index) => (
          <div
            key={item.title}
            className="border-b border-[#17211d] p-5 last:border-b-0 md:border-b-0 md:border-r"
          >
            <p className="mb-3 font-mono text-xs">FRAME {index + 1}</p>
            <Photo
              item={item}
              items={items}
              onOpen={props.onOpen}
              className={cn(
                "w-full",
                index === 1 ? "aspect-[3/4]" : "aspect-square",
              )}
            />
          </div>
        ))}
      </section>
    ),
    categories: () => (
      <section className="grid bg-[#8db6a4] px-6 py-12 text-[#17211d] md:grid-cols-[0.35fr_0.65fr]">
        <h2 className="font-mono text-xs uppercase tracking-[0.2em]">
          Category lanes
        </h2>
        <div className="divide-y divide-[#17211d]">
          {(props.demo.categories ?? []).slice(0, 6).map((category, index) => (
            <Link
              href={href(props, "/categories")}
              key={category.slug}
              className="flex items-center justify-between py-4 text-3xl"
            >
              <span>
                {String(index + 1).padStart(2, "0")} {category.name}
              </span>
              <ArrowRight />
            </Link>
          ))}
        </div>
      </section>
    ),
    contact: () => (
      <ContactBlock
        props={props}
        theme="relay"
        className="grid gap-10 bg-[#f2f0e8] px-6 py-14 text-[#17211d] md:grid-cols-2 lg:px-12"
      />
    ),
    footer: () => (
      <footer className="flex flex-wrap justify-between gap-5 bg-[#e75a3d] px-6 py-8 font-mono text-xs uppercase text-white">
        <span>{props.demo.studioName}</span>
        <span>End of relay / {new Date().getFullYear()}</span>
      </footer>
    ),
  };
  return (
    <main>
      <RelayNav {...props} />
      <Ordered demo={props.demo} render={render} />
    </main>
  );
}

function FieldbookNav(props: HomeProps) {
  return (
    <NewThemeAutoHeader className="flex items-center justify-between border-b-2 border-[#26322b] bg-[#ede6d5] px-5 py-3 text-[#26322b]">
      <Link href={href(props)} className="font-serif text-2xl italic">
        {props.demo.studioName}
      </Link>
      <nav className="ml-auto hidden items-center gap-6 font-mono text-xs uppercase md:flex">
        {navItems.map(([label, path]) => (
          <Link key={path} href={href(props, path)}>
            {label}
          </Link>
        ))}
        <CustomerContactControl
          slug={props.slug}
          variant="fieldbook"
          triggerClassName="uppercase"
        />
      </nav>
      <HomeMobileNav
        props={props}
        theme="fieldbook"
        shellClass="absolute right-0 top-8 z-50 grid w-52 border-2 border-[#26322b] bg-[#ede6d5] p-3 font-mono text-xs uppercase"
        linkClass="border-b border-[#26322b]/30 py-3 text-left"
      />
    </NewThemeAutoHeader>
  );
}

export function FieldbookHome(props: HomeProps) {
  const items = props.demo.galleries;
  const render: Record<SectionKey, () => ReactNode> = {
    hero: () => (
      <section className="grid min-h-[76vh] bg-[#ede6d5] text-[#26322b] lg:grid-cols-[5rem_1fr_1fr]">
        <div className="hidden border-r-2 border-[#26322b] p-3 font-mono text-[10px] uppercase [writing-mode:vertical-rl] lg:block">
          Field record / {props.demo.location ?? "On location"}
        </div>
        <div className="flex flex-col justify-between border-b-2 border-[#26322b] p-7 lg:border-b-0 lg:border-r-2">
          <p className="font-mono text-xs uppercase">
            Entry 001 — {props.demo.specialty}
          </p>
          <h1 className="font-serif text-[clamp(4rem,9vw,8rem)] italic leading-[0.78]">
            {props.demo.studioName}
          </h1>
          <p className="max-w-md border-t border-[#26322b] pt-4 font-serif text-lg">
            {props.demo.tagline}
          </p>
        </div>
        <div className="relative min-h-[52vh] m-5 border-2 border-[#26322b] p-2">
          <Image
            src={props.demo.heroImage}
            alt="Field study"
            fill
            priority
            sizes="50vw"
            className="object-cover p-2"
          />
          <span className="absolute bottom-3 right-3 bg-[#ede6d5] px-2 font-mono text-[10px]">
            FIG. A
          </span>
        </div>
      </section>
    ),
    galleries: () => (
      <section className="bg-[#ede6d5] px-5 py-12 text-[#26322b]">
        <div className="mb-8 flex justify-between border-y-2 border-[#26322b] py-3 font-mono text-xs uppercase">
          <span>Observed stories</span>
          <span>{items.length} records</span>
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          {items.map((item, index) => (
            <article
              key={item.title}
              className={cn(
                "border-b border-[#26322b] pb-5",
                index % 3 === 0 &&
                  "md:col-span-2 md:grid md:grid-cols-[0.65fr_0.35fr] md:gap-6",
              )}
            >
              <Photo
                item={item}
                items={items}
                onOpen={props.onOpen}
                className="aspect-[4/3] w-full border-2 border-[#26322b] p-1"
              />
              <div>
                <p className="mt-3 font-mono text-[10px]">
                  NOTE {String(index + 1).padStart(3, "0")}
                </p>
                <h2 className="font-serif text-3xl italic">{item.title}</h2>
                <p className="font-mono text-xs">{item.location}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    ),
    featuredPhotos: () => (
      <section className="grid border-y-2 border-[#26322b] bg-[#d8cfba] md:grid-cols-2">
        {items.slice(0, 2).map((item, index) => (
          <div
            key={item.title}
            className="p-6 md:border-r-2 md:border-[#26322b]"
          >
            <p className="mb-3 font-serif italic">Plate {index + 1}</p>
            <Photo
              item={item}
              items={items}
              onOpen={props.onOpen}
              className="aspect-[5/4] w-full"
            />
          </div>
        ))}
      </section>
    ),
    categories: () => (
      <section className="bg-[#ede6d5] px-5 py-12 text-[#26322b]">
        <h2 className="font-serif text-5xl italic">Browse categories</h2>
        <div className="mt-8 flex flex-wrap gap-2">
          {(props.demo.categories ?? []).map((c) => (
            <Link
              href={href(props, "/categories")}
              key={c.slug}
              className="border-2 border-[#26322b] px-4 py-3 font-mono text-xs uppercase hover:bg-[#26322b] hover:text-[#ede6d5]"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>
    ),
    contact: () => (
      <ContactBlock
        props={props}
        theme="fieldbook"
        className="grid gap-10 border-t-2 border-[#26322b] bg-[#ede6d5] px-6 py-14 font-serif text-[#26322b] md:grid-cols-2"
      />
    ),
    footer: () => (
      <footer className="grid gap-4 border-t-2 border-[#26322b] bg-[#26322b] px-6 py-8 font-mono text-xs uppercase text-[#ede6d5] md:grid-cols-3">
        <span>Filed by {props.demo.studioName}</span>
        <span>{props.demo.location}</span>
        <span className="md:text-right">© {new Date().getFullYear()}</span>
      </footer>
    ),
  };
  return (
    <main>
      <FieldbookNav {...props} />
      <Ordered demo={props.demo} render={render} />
    </main>
  );
}

function KaleidoNav(props: HomeProps) {
  return (
    <NewThemeAutoHeader className="m-4 flex items-center rounded-full border-2 border-[#232136] bg-[#f6f2e7]/90 px-5 py-3 text-[#232136] backdrop-blur">
      <Link href={href(props)} className="text-xl font-black">
        {props.demo.studioName}
      </Link>
      <nav className="ml-auto hidden items-center gap-5 font-bold md:flex">
        {navItems.map(([label, path]) => (
          <Link key={path} href={href(props, path)}>
            {label}
          </Link>
        ))}
        <CustomerContactControl slug={props.slug} variant="kaleido" />
      </nav>
      <HomeMobileNav
        props={props}
        theme="kaleido"
        shellClass="absolute right-0 top-9 z-50 grid w-56 rounded-3xl border-2 border-[#232136] bg-[#ff6b5e] p-4"
        linkClass="py-2 text-left text-xl font-black"
      />
    </NewThemeAutoHeader>
  );
}

export function KaleidoHome(props: HomeProps) {
  const items = props.demo.galleries;
  const render: Record<SectionKey, () => ReactNode> = {
    hero: () => (
      <section className="grid min-h-screen grid-cols-2 grid-rows-2 bg-[#f6f2e7] pt-20 text-[#232136] lg:grid-cols-[0.25fr_0.5fr_0.25fr]">
        <div className="grid place-items-center bg-[#ffcf56] p-5 text-center text-2xl font-black uppercase">
          {props.demo.specialty}
        </div>
        <div className="relative row-span-2 min-h-[70vh] overflow-hidden rounded-[50%_50%_18%_18%] border-4 border-[#232136]">
          <Image
            src={props.demo.heroImage}
            alt={props.demo.studioName}
            fill
            priority
            sizes="50vw"
            className="object-cover"
          />
        </div>
        <div className="grid place-items-center bg-[#52b8a5] p-5 text-center text-lg">
          {props.demo.tagline}
        </div>
        <div className="col-span-1 grid place-items-center bg-[#b49be8] p-4 lg:col-start-3">
          <h1 className="rotate-[-5deg] text-[clamp(3rem,6vw,7rem)] font-black leading-[0.8] tracking-[-0.08em]">
            {props.demo.studioName}
          </h1>
        </div>
      </section>
    ),
    galleries: () => (
      <section className="grid auto-rows-[18rem] grid-cols-2 gap-3 bg-[#232136] p-3 lg:grid-cols-4">
        {items.map((item, index) => (
          <article
            key={item.title}
            className={cn(
              "relative",
              index % 5 === 0 && "col-span-2 row-span-2",
              index % 3 === 0 && "rounded-[4rem] overflow-hidden",
            )}
          >
            <Photo
              item={item}
              items={items}
              onOpen={props.onOpen}
              className="h-full w-full"
            />
            <span className="absolute bottom-3 left-3 rounded-full bg-[#f6f2e7] px-4 py-2 font-bold text-[#232136]">
              {item.title}
            </span>
          </article>
        ))}
      </section>
    ),
    featuredPhotos: () => (
      <section className="grid bg-[#ffcf56] p-5 sm:grid-cols-3">
        {items.slice(0, 3).map((item, index) => (
          <div
            className={cn("p-3", index === 1 && "sm:translate-y-10")}
            key={item.title}
          >
            <Photo
              item={item}
              items={items}
              onOpen={props.onOpen}
              className="aspect-square w-full rounded-full border-4 border-[#232136]"
            />
          </div>
        ))}
      </section>
    ),
    categories: () => (
      <section className="grid gap-5 bg-[#f6f2e7] px-5 py-16 text-[#232136] md:grid-cols-2">
        <h2 className="text-7xl font-black tracking-[-0.08em]">
          Choose a portal.
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {(props.demo.categories ?? []).slice(0, 6).map((c, index) => (
            <Link
              href={href(props, "/categories")}
              key={c.slug}
              className={cn(
                "grid aspect-square place-items-center rounded-full border-4 border-[#232136] p-4 text-center text-xl font-black",
                [
                  "bg-[#ff6b5e]",
                  "bg-[#52b8a5]",
                  "bg-[#b49be8]",
                  "bg-[#ffcf56]",
                ][index % 4],
              )}
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>
    ),
    contact: () => (
      <ContactBlock
        props={props}
        theme="kaleido"
        className="grid gap-10 bg-[#b49be8] px-6 py-16 text-[#232136] md:grid-cols-2"
      />
    ),
    footer: () => (
      <footer className="grid grid-cols-2 bg-[#232136] text-[#f6f2e7] sm:grid-cols-4">
        {[
          props.demo.studioName,
          "Galleries",
          "Journal",
          String(new Date().getFullYear()),
        ].map((x) => (
          <div
            key={x}
            className="grid min-h-28 place-items-center border border-white/20 p-3 text-center font-bold"
          >
            {x}
          </div>
        ))}
      </footer>
    ),
  };
  return (
    <main>
      <KaleidoNav {...props} />
      <Ordered demo={props.demo} render={render} />
    </main>
  );
}

function ProsceniumNav(props: HomeProps) {
  return (
    <NewThemeAutoHeader className="flex h-16 items-center border-b border-[#f1e9dc]/20 bg-[#120f15]/90 px-5 text-[#f1e9dc] backdrop-blur">
      <Link href={href(props)} className="font-serif text-2xl italic">
        {props.demo.studioName}
      </Link>
      <nav className="ml-auto hidden gap-7 text-xs uppercase tracking-[0.2em] md:flex">
        {navItems.map(([l, p]) => (
          <Link key={p} href={href(props, p)}>
            {l}
          </Link>
        ))}
        <CustomerContactControl slug={props.slug} variant="proscenium" />
      </nav>
      <HomeMobileNav
        props={props}
        theme="proscenium"
        shellClass="absolute right-0 top-9 z-50 grid w-60 border border-[#d44b3e] bg-[#120f15] p-4"
        linkClass="border-b border-white/15 py-3 text-left text-xs uppercase tracking-[0.16em]"
      />
    </NewThemeAutoHeader>
  );
}
export function ProsceniumHome(props: HomeProps) {
  const items = props.demo.galleries;
  const render: Record<SectionKey, () => ReactNode> = {
    hero: () => (
      <section className="relative flex min-h-screen items-end overflow-hidden bg-[#120f15] px-6 pb-16 pt-24 text-[#f1e9dc]">
        <Image
          src={props.demo.heroImage}
          alt="Stage"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#120f15_0%,transparent_70%)]" />
        <div className="relative max-w-5xl">
          <p className="text-xs uppercase tracking-[0.4em] text-[#d44b3e]">
            Act I / Opening image
          </p>
          <h1 className="mt-5 font-serif text-[clamp(5rem,14vw,13rem)] italic leading-[0.68]">
            {props.demo.studioName}
          </h1>
          <p className="mt-8 max-w-xl text-xl">{props.demo.tagline}</p>
        </div>
      </section>
    ),
    galleries: () => (
      <section className="bg-[#120f15] text-[#f1e9dc]">
        {items.map((item, index) => (
          <article
            key={item.title}
            className="grid min-h-[80vh] border-t border-white/15 lg:grid-cols-[0.32fr_0.68fr]"
          >
            <div className="flex flex-col justify-between p-8">
              <span className="text-xs uppercase tracking-[0.35em] text-[#d44b3e]">
                Act {index + 2}
              </span>
              <div>
                <h2 className="font-serif text-6xl italic">{item.title}</h2>
                <p className="mt-3 opacity-55">{item.location}</p>
              </div>
            </div>
            <Photo
              item={item}
              items={items}
              onOpen={props.onOpen}
              className="min-h-[55vh] w-full"
            />
          </article>
        ))}
      </section>
    ),
    featuredPhotos: () => (
      <section className="grid gap-1 bg-[#d44b3e] p-1 md:grid-cols-[1fr_0.6fr_1fr]">
        {items.slice(0, 3).map((item, i) => (
          <Photo
            key={item.title}
            item={item}
            items={items}
            onOpen={props.onOpen}
            className={cn("w-full", i === 1 ? "aspect-[3/4]" : "aspect-[4/5]")}
          />
        ))}
      </section>
    ),
    categories: () => (
      <section className="bg-[#f1e9dc] px-6 py-16 text-[#120f15]">
        <h2 className="font-serif text-7xl italic">Tonight&apos;s program</h2>
        <div className="mt-10 divide-y divide-[#120f15]">
          {(props.demo.categories ?? []).map((c, i) => (
            <Link
              href={href(props, "/categories")}
              key={c.slug}
              className="flex justify-between py-5 text-2xl"
            >
              <span>Scene {i + 1}</span>
              <span>{c.name}</span>
            </Link>
          ))}
        </div>
      </section>
    ),
    contact: () => (
      <ContactBlock
        props={props}
        theme="proscenium"
        className="grid gap-10 bg-[#120f15] px-6 py-16 font-serif text-[#f1e9dc] md:grid-cols-2"
      />
    ),
    footer: () => (
      <footer className="flex min-h-44 items-end justify-between bg-[#d44b3e] p-7 text-[#f1e9dc]">
        <span className="font-serif text-5xl italic">Curtain.</span>
        <span>© {new Date().getFullYear()}</span>
      </footer>
    ),
  };
  return (
    <main>
      <ProsceniumNav {...props} />
      <Ordered demo={props.demo} render={render} />
    </main>
  );
}

function CartographNav(props: HomeProps) {
  return (
    <NewThemeAutoHeader className="m-5 flex items-center rounded-full border border-[#10271f] bg-[#dfe7df]/90 px-5 py-3 font-mono text-xs uppercase text-[#10271f] backdrop-blur">
      <Compass className="mr-3 size-4" />
      <Link href={href(props)} className="font-bold">
        {props.demo.studioName}
      </Link>
      <nav className="ml-auto hidden gap-6 md:flex">
        {navItems.map(([l, p]) => (
          <Link key={p} href={href(props, p)}>
            {l}
          </Link>
        ))}
        <CustomerContactControl slug={props.slug} variant="cartograph" />
      </nav>
      <HomeMobileNav
        props={props}
        theme="cartograph"
        shellClass="absolute right-0 top-9 z-50 grid w-56 border border-[#10271f] bg-[#dfe7df] p-4"
        linkClass="border-b border-[#10271f]/25 py-3 text-left font-mono text-xs uppercase"
      />
    </NewThemeAutoHeader>
  );
}
export function CartographHome(props: HomeProps) {
  const items = props.demo.galleries;
  const render: Record<SectionKey, () => ReactNode> = {
    hero: () => (
      <section className="relative min-h-screen overflow-hidden bg-[#dfe7df] text-[#10271f]">
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(#10271f_1px,transparent_1px),linear-gradient(90deg,#10271f_1px,transparent_1px)] [background-size:80px_80px]" />
        <div className="relative grid min-h-screen items-center gap-8 px-7 pt-24 lg:grid-cols-[0.4fr_0.6fr]">
          <div>
            <p className="font-mono text-xs">N 33.6844° / E 73.0479°</p>
            <h1 className="mt-4 text-[clamp(4rem,9vw,9rem)] leading-[0.75] tracking-[-0.08em]">
              {props.demo.studioName}
            </h1>
            <p className="mt-7 max-w-md">{props.demo.tagline}</p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[50%_20%_45%_25%] border-2 border-[#10271f]">
            <Image
              src={props.demo.heroImage}
              alt="Destination"
              fill
              priority
              sizes="60vw"
              className="object-cover"
            />
            <span className="absolute bottom-4 left-4 rounded-full bg-[#dd6f45] px-4 py-2 font-mono text-xs text-white">
              ORIGIN
            </span>
          </div>
        </div>
      </section>
    ),
    galleries: () => (
      <section className="relative bg-[#10271f] px-6 py-16 text-[#dfe7df]">
        <div className="absolute bottom-0 left-[3.2rem] top-0 w-px bg-[#dd6f45]" />
        {items.map((item, index) => (
          <article
            key={item.title}
            className="relative mb-20 grid gap-6 pl-14 lg:grid-cols-[0.25fr_0.75fr]"
          >
            <span className="absolute left-[2.1rem] top-0 size-9 rounded-full border-4 border-[#10271f] bg-[#dd6f45]" />
            <div>
              <p className="font-mono text-xs">
                WAYPOINT {String(index + 1).padStart(2, "0")}
              </p>
              <h2 className="mt-4 text-5xl">{item.title}</h2>
              <p className="mt-3 opacity-55">{item.location}</p>
            </div>
            <Photo
              item={item}
              items={items}
              onOpen={props.onOpen}
              className={cn(
                "w-full",
                index % 2 ? "aspect-[16/7]" : "aspect-[4/3]",
              )}
            />
          </article>
        ))}
      </section>
    ),
    featuredPhotos: () => (
      <section className="grid bg-[#6f9484] p-6 md:grid-cols-2">
        {items.slice(0, 2).map((item, i) => (
          <div key={item.title} className={cn("p-4", i && "md:mt-24")}>
            <Photo
              item={item}
              items={items}
              onOpen={props.onOpen}
              className="aspect-[5/4] w-full rounded-[2rem]"
            />
          </div>
        ))}
      </section>
    ),
    categories: () => (
      <section className="bg-[#dfe7df] px-6 py-16 text-[#10271f]">
        <h2 className="text-6xl tracking-[-0.06em]">Choose a destination.</h2>
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(props.demo.categories ?? []).map((c, i) => (
            <Link
              href={href(props, "/categories")}
              key={c.slug}
              className="flex min-h-32 items-end justify-between border border-[#10271f] p-4 font-mono uppercase"
            >
              <span>{c.name}</span>
              <span>
                {i + 1}/{(props.demo.categories ?? []).length}
              </span>
            </Link>
          ))}
        </div>
      </section>
    ),
    contact: () => (
      <ContactBlock
        props={props}
        theme="cartograph"
        className="grid gap-10 bg-[#dfe7df] px-6 py-16 text-[#10271f] md:grid-cols-2"
      />
    ),
    footer: () => (
      <footer className="grid gap-4 bg-[#10271f] px-6 py-10 font-mono text-xs uppercase text-[#dfe7df] md:grid-cols-3">
        <span>{props.demo.studioName}</span>
        <span>Route complete</span>
        <span className="md:text-right">© {new Date().getFullYear()}</span>
      </footer>
    ),
  };
  return (
    <main>
      <CartographNav {...props} />
      <Ordered demo={props.demo} render={render} />
    </main>
  );
}

function VitrineNav(props: HomeProps) {
  return (
    <NewThemeAutoHeader className="grid grid-cols-[1fr_auto_1fr] items-center border-b border-[#9b8d76] bg-[#e7e2d8]/95 px-5 py-4 font-serif text-[#26221e] backdrop-blur">
      <span className="text-xs uppercase tracking-[0.25em]">Room 01</span>
      <Link href={href(props)} className="text-2xl">
        {props.demo.studioName}
      </Link>
      <nav className="ml-auto hidden gap-5 text-sm md:flex">
        {navItems.map(([l, p]) => (
          <Link key={p} href={href(props, p)}>
            {l}
          </Link>
        ))}
        <CustomerContactControl slug={props.slug} variant="vitrine" />
      </nav>
      <HomeMobileNav
        props={props}
        theme="vitrine"
        shellClass="absolute right-0 top-9 z-50 grid w-56 border border-[#9b8d76] bg-[#e7e2d8] p-4"
        linkClass="border-b border-[#9b8d76]/50 py-3 text-left font-serif"
      />
    </NewThemeAutoHeader>
  );
}
export function VitrineHome(props: HomeProps) {
  const items = props.demo.galleries;
  const render: Record<SectionKey, () => ReactNode> = {
    hero: () => (
      <section className="relative min-h-[85vh] overflow-hidden bg-[#e7e2d8] p-6 text-[#26221e]">
        <div className="mx-auto grid max-w-7xl items-center gap-8 py-12 lg:grid-cols-[0.25fr_0.5fr_0.25fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.3em]">
              Current exhibition
            </p>
            <h1 className="mt-5 font-serif text-6xl leading-[0.85]">
              {props.demo.studioName}
            </h1>
          </div>
          <div className="relative aspect-[3/4] border-[1.2rem] border-[#26221e] shadow-2xl">
            <Image
              src={props.demo.heroImage}
              alt="Exhibition work"
              fill
              priority
              sizes="50vw"
              className="object-cover"
            />
          </div>
          <p className="self-end border-t border-[#9b8d76] pt-4 font-serif text-lg">
            {props.demo.tagline}
          </p>
        </div>
      </section>
    ),
    galleries: () => (
      <section className="bg-[#d7d0c3] px-6 py-20 text-[#26221e]">
        <div className="mx-auto grid max-w-7xl auto-rows-[12rem] grid-cols-2 gap-10 md:grid-cols-4">
          {items.map((item, index) => (
            <article
              key={item.title}
              className={cn(
                "relative",
                index % 5 === 0 && "col-span-2 row-span-2",
                index % 4 === 1 && "row-span-2",
                index % 3 === 2 && "self-center",
              )}
            >
              <div className="h-full border-[0.65rem] border-[#f3efe6] bg-[#26221e] p-1 shadow-xl">
                <Photo
                  item={item}
                  items={items}
                  onOpen={props.onOpen}
                  className="h-full w-full"
                />
              </div>
              <p className="mt-2 font-serif text-sm italic">
                {item.title}, {item.location}
              </p>
            </article>
          ))}
        </div>
      </section>
    ),
    featuredPhotos: () => (
      <section className="grid bg-[#26221e] px-6 py-16 text-[#e7e2d8] md:grid-cols-[0.7fr_0.3fr]">
        {items[0] ? (
          <Photo
            item={items[0]}
            items={items}
            onOpen={props.onOpen}
            className="aspect-[16/9] w-full"
          />
        ) : null}
        <div className="flex items-end p-7">
          <p className="font-serif text-4xl">A pause between rooms.</p>
        </div>
      </section>
    ),
    categories: () => (
      <section className="bg-[#e7e2d8] px-6 py-16 text-[#26221e]">
        <p className="text-xs uppercase tracking-[0.28em]">Room directory</p>
        <div className="mt-8 grid gap-px bg-[#9b8d76] sm:grid-cols-2 lg:grid-cols-3">
          {(props.demo.categories ?? []).map((c, i) => (
            <Link
              href={href(props, "/categories")}
              key={c.slug}
              className="min-h-48 bg-[#e7e2d8] p-5 font-serif text-3xl"
            >
              <span className="block text-xs">
                ROOM {String(i + 1).padStart(2, "0")}
              </span>
              <span className="mt-16 block">{c.name}</span>
            </Link>
          ))}
        </div>
      </section>
    ),
    contact: () => (
      <ContactBlock
        props={props}
        theme="vitrine"
        className="grid gap-10 border-y border-[#9b8d76] bg-[#e7e2d8] px-6 py-16 font-serif text-[#26221e] md:grid-cols-2"
      />
    ),
    footer: () => (
      <footer className="grid gap-6 bg-[#26221e] px-6 py-14 font-serif text-[#e7e2d8] md:grid-cols-[1fr_0.6fr]">
        <span className="text-5xl">{props.demo.studioName}</span>
        <div className="border-l border-white/25 pl-5">
          <p>Exhibition catalogue</p>
          <p className="mt-4 opacity-55">
            © {new Date().getFullYear()} · {props.demo.location}
          </p>
        </div>
      </footer>
    ),
  };
  return (
    <main>
      <VitrineNav {...props} />
      <Ordered demo={props.demo} render={render} />
    </main>
  );
}

export function NewThemeHomeExperience({
  theme,
  ...props
}: HomeProps & { theme: NewThemeKey }) {
  if (theme === "relay") return <RelayHome {...props} />;
  if (theme === "fieldbook") return <FieldbookHome {...props} />;
  if (theme === "kaleido") return <KaleidoHome {...props} />;
  if (theme === "proscenium") return <ProsceniumHome {...props} />;
  if (theme === "cartograph") return <CartographHome {...props} />;
  return <VitrineHome {...props} />;
}
